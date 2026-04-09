/**
 * Fan Screen Map Capture
 *
 * Captures screenshots of every fan-facing screen in desktop + iPhone viewports.
 * Uses E2E auth bypass (no Magic SDK needed).
 *
 * Requires: even-web running on localhost + even-back Docker with bypass enabled.
 *
 * Run:
 *   E2E_AUTH_BYPASS_SECRET=d4a85541b4789f1534cf44572a93053e \
 *   BASE_URL=http://localhost:3001 \
 *   npx playwright test scripts/screen-map-capture.spec.ts --headed
 *
 * Pattern: backstage-screen-map/scripts/screen-map-capture.spec.ts
 */
import { test, expect } from "@playwright/test";
import path from "node:path";
import fs from "node:fs";

const OUTPUT_BASE = path.resolve(__dirname, "..");
const DESKTOP_DIR = path.join(OUTPUT_BASE, "desktop");
const IPHONE_DIR = path.join(OUTPUT_BASE, "iphone");

const bypassSecret = process.env.E2E_AUTH_BYPASS_SECRET;
const baseURL = process.env.BASE_URL ?? "http://localhost:3000";

const DESKTOP_VIEWPORT = { width: 1440, height: 900 };
const IPHONE_VIEWPORT = { width: 390, height: 844 };

interface ScreenDef {
  name: string;
  path: string;
  /** Optional: wait for this selector before capturing */
  waitFor?: string;
  /** If true, requires auth (default: true for most screens) */
  auth?: boolean;
}

// ── All fan-facing screens (derived from route audit 2026-04-08) ──
// Naming: NN-category-detail (matches backstage convention)
const SCREENS: ScreenDef[] = [
  // Browse (public)
  { name: "01-explore", path: "/explore", auth: false },
  { name: "02-releases-all", path: "/en/releases/all", auth: false },
  { name: "03-search", path: "/en/search", auth: false },
  { name: "04-artists-all", path: "/en/artists/all", auth: false },
  { name: "05-watch", path: "/en/watch", auth: false },

  // Artist pages
  { name: "06-artist-twenty-one-pilots", path: "/en/artists/twenty-one-pilots", auth: false },
  { name: "07-artist-kehlani", path: "/en/artists/kehlani", auth: false },

  // Release pages (various types)
  { name: "08-release-latest", path: "/en/r/latest-release", waitFor: "text=latest release" },
  { name: "09-release-doppelganger", path: "/en/r/doppelganger", auth: false },
  { name: "10-release-apple", path: "/en/r/apple", auth: false },
  { name: "11-release-debi-tirar", path: "/en/r/debi-tirar-mas-fotos" },
  { name: "12-release-video-type", path: "/en/r/east-atlanta-fairytale" },

  // Experience & Community
  { name: "13-experience", path: "/en/experience/experience-release" },
  { name: "14-community", path: "/en/community/in-good-compenny-live-2" },
  { name: "15-experience-shortlink", path: "/en/e/experience-release" },

  // Release type routing (redirects — capture landing page)
  { name: "16-routing-experience", path: "/en/r/experience-release" },
  { name: "17-routing-community", path: "/en/r/in-good-compenny-live-2" },

  // Auth pages
  { name: "18-auth-login", path: "/en/auth/login", auth: false },
  { name: "19-auth-onboarding", path: "/en/auth/onboarding", auth: false },

  // Authenticated pages
  { name: "20-user-library", path: "/en/users" },
  { name: "21-chats", path: "/en/chats" },

  // Checkout
  { name: "22-checkout-apple", path: "/en/checkout/apple" },
  { name: "23-order-legacy", path: "/en/releases/order/latest-release" },

  // Access pages (post-purchase, authenticated)
  { name: "24-access-audio", path: "/en/access/audio/latest-release" },
  { name: "25-access-video", path: "/en/access/video/latest-release" },
  { name: "26-access-gallery", path: "/en/access/gallery/latest-release" },
  { name: "27-access-merch", path: "/en/access/merchandise/latest-release" },
  { name: "28-access-event", path: "/en/access/event/latest-release" },
  { name: "29-access-stems", path: "/en/access/stems/latest-release" },
  { name: "30-access-media-album", path: "/en/access/media/album/latest-release" },

  // Portal pages
  { name: "31-portal-p", path: "/en/p/latest-release" },
  { name: "32-portal-community", path: "/en/community/portal/in-good-compenny-live-2" },
  { name: "33-portal-experience", path: "/en/experience/portal/experience-release" },

  // i18n locales
  { name: "34-locale-en", path: "/en/explore", auth: false },
  { name: "35-locale-es", path: "/es/explore", auth: false },
  { name: "36-locale-fr", path: "/fr/explore", auth: false },
  { name: "37-locale-ja", path: "/ja/explore", auth: false },
  { name: "38-locale-pt", path: "/pt/explore", auth: false },
  { name: "39-locale-ar-rtl", path: "/ar/explore", auth: false },
];

async function bypassAuth(page: import("@playwright/test").Page): Promise<void> {
  if (!bypassSecret) {
    throw new Error("E2E_AUTH_BYPASS_SECRET is required. Set it as env var.");
  }

  // Navigate to establish origin
  await page.goto("/explore", { waitUntil: "domcontentloaded" });

  // CSRF + credentials flow (shares cookie jar with browser)
  const csrfResponse = await page.context().request.get("/api/auth/csrf");
  if (!csrfResponse.ok()) throw new Error(`CSRF fetch failed: HTTP ${csrfResponse.status()}`);
  const { csrfToken } = (await csrfResponse.json()) as { csrfToken: string };

  const response = await page.context().request.post("/api/auth/callback/credentials", {
    form: { csrfToken, didToken: bypassSecret },
  });

  const finalUrl = response.url();
  if (finalUrl.includes("error=")) {
    throw new Error(`Auth bypass failed — error in redirect: ${finalUrl}`);
  }

  // Reload to pick up session
  await page.goto("/explore", { waitUntil: "domcontentloaded" });

  // Verify session
  const sessionRes = await page.context().request.get("/api/auth/session");
  const session = await sessionRes.json();
  if (!session?.user?.email) {
    throw new Error(`Auth bypass: session not created. Got: ${JSON.stringify(session)}`);
  }

  console.log(`Auth OK: ${session.user.email}`);
}

/**
 * Wait for viewport-visible images to finish loading.
 * Handles: next/image lazy loading, opacity-0→1 CSS transitions, API-driven content.
 * Does NOT use networkidle (never completes in EVEN apps due to persistent connections).
 */
async function waitForImages(page: import("@playwright/test").Page, timeout = 5000): Promise<void> {
  // Wait for visible images to complete (loaded OR 404 — both are img.complete=true)
  await page
    .waitForFunction(
      () => {
        const images = Array.from(document.querySelectorAll("img[src]"));
        if (images.length === 0) return true;
        const visible = images.filter((img) => {
          const rect = img.getBoundingClientRect();
          return rect.top < window.innerHeight && rect.width > 0;
        });
        if (visible.length === 0) return true;
        return visible.every((img) => (img as HTMLImageElement).complete);
      },
      { timeout },
    )
    .catch(() => {}); // timeout = capture anyway

  // Buffer for CSS opacity transitions (next/image onLoadingComplete)
  await page.waitForTimeout(400);
}

interface CaptureResult {
  screen: string;
  viewport: string;
  status: "ok" | "redirect" | "error";
  httpCode: number | string;
  finalUrl?: string;
}

async function captureScreen(
  page: import("@playwright/test").Page,
  screen: ScreenDef,
  viewport: { width: number; height: number },
  outDir: string,
): Promise<CaptureResult> {
  const viewportName = viewport.width > 500 ? "desktop" : "iphone";

  await page.setViewportSize(viewport);

  try {
    const response = await page.goto(screen.path, {
      waitUntil: "domcontentloaded",
      timeout: 20000,
    });

    const httpCode = response?.status() ?? "timeout";

    if (screen.waitFor) {
      await page
        .locator(screen.waitFor)
        .first()
        .waitFor({ state: "visible", timeout: 10000 })
        .catch(() => {});
    }

    // Always wait for images to load (handles next/image lazy loading + API-driven content)
    await waitForImages(page);

    await page.screenshot({
      path: path.join(outDir, `${screen.name}.png`),
      fullPage: false,
    });

    const finalUrl = page.url();
    const redirected = !finalUrl.includes(screen.path.replace("/en", "").split("?")[0]);

    console.log(`  ✓ ${viewportName}/${screen.name}.png (${httpCode}${redirected ? ` → ${finalUrl.replace(baseURL, "")}` : ""})`);

    return {
      screen: screen.name,
      viewport: viewportName,
      status: redirected ? "redirect" : "ok",
      httpCode,
      finalUrl: redirected ? finalUrl.replace(baseURL, "") : undefined,
    };
  } catch (err) {
    console.error(`  ✗ ${viewportName}/${screen.name} — ${(err as Error).message.slice(0, 100)}`);
    return { screen: screen.name, viewport: viewportName, status: "error", httpCode: "error" };
  }
}

test.describe("Fan Screen Map Capture", () => {
  test.setTimeout(1_200_000); // 20 min for all screens x 2 viewports

  test.beforeAll(() => {
    fs.mkdirSync(DESKTOP_DIR, { recursive: true });
    fs.mkdirSync(IPHONE_DIR, { recursive: true });
  });

  test("capture all screens — desktop 1440x900 + iPhone 390x844", async ({ page }) => {
    // Authenticate
    await page.setViewportSize(DESKTOP_VIEWPORT);
    await bypassAuth(page);

    const results: CaptureResult[] = [];

    // Desktop captures
    console.log(`\n── Desktop (${DESKTOP_VIEWPORT.width}x${DESKTOP_VIEWPORT.height}) ──`);
    for (const screen of SCREENS) {
      results.push(await captureScreen(page, screen, DESKTOP_VIEWPORT, DESKTOP_DIR));
    }

    // iPhone captures
    console.log(`\n── iPhone (${IPHONE_VIEWPORT.width}x${IPHONE_VIEWPORT.height}) ──`);
    for (const screen of SCREENS) {
      results.push(await captureScreen(page, screen, IPHONE_VIEWPORT, IPHONE_DIR));
    }

    // Summary
    const desktopFiles = fs.readdirSync(DESKTOP_DIR).filter((f) => f.endsWith(".png"));
    const iphoneFiles = fs.readdirSync(IPHONE_DIR).filter((f) => f.endsWith(".png"));

    const ok = results.filter((r) => r.status === "ok").length;
    const redirects = results.filter((r) => r.status === "redirect").length;
    const errors = results.filter((r) => r.status === "error").length;

    console.log(`\n=== CAPTURE SUMMARY ===`);
    console.log(`Screenshots: ${desktopFiles.length} desktop + ${iphoneFiles.length} iPhone = ${desktopFiles.length + iphoneFiles.length} total`);
    console.log(`Results: ${ok} OK | ${redirects} redirect | ${errors} error`);

    if (errors > 0) {
      console.log(`\nErrors:`);
      results.filter((r) => r.status === "error").forEach((r) => console.log(`  - ${r.viewport}/${r.screen}`));
    }

    // At least 50% should capture successfully
    expect(desktopFiles.length).toBeGreaterThan(SCREENS.length * 0.5);
    expect(iphoneFiles.length).toBeGreaterThan(SCREENS.length * 0.5);
  });
});
