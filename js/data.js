/**
 * Fan Screen Map — Data Layer
 * Navigation taxonomy, E2E flows, and screenshot registry for EVEN Fan App (even-web).
 *
 * Mirrors backstage-screen-map structure for convention parity.
 * Source: Investigation against local stack (even-web + even-back Docker) — 2026-04-08
 */

// ── Screenshot files registry ──────────────────────────────────────────
// key = screen name, value = { d: desktopFile|null, i: iphoneFile|null }
// Pattern: backstage-screen-map/js/data.js
// Captured: 2026-04-09 via scripts/screen-map-capture.spec.ts
// Desktop: 1440x900, iPhone: 390x844
const FILES = {
  // Browse (public)
  "Explore": { d: "01-explore", i: "01-explore" },
  "All Releases": { d: "02-releases-all", i: "02-releases-all" },
  "Search": { d: "03-search", i: "03-search" },
  "All Artists": { d: "04-artists-all", i: "04-artists-all" },
  "Watch": { d: "05-watch", i: "05-watch" },
  // Artist pages
  "Artist: Twenty One Pilots": { d: "06-artist-twenty-one-pilots", i: "06-artist-twenty-one-pilots" },
  "Artist: Kehlani": { d: "07-artist-kehlani", i: "07-artist-kehlani" },
  // Release pages
  "Release: Latest Release": { d: "08-release-latest", i: "08-release-latest" },
  "Release: Doppelganger": { d: "09-release-doppelganger", i: "09-release-doppelganger" },
  "Release: Apple": { d: "10-release-apple", i: "10-release-apple" },
  "Release: Debi Tirar Mas Fotos": { d: "11-release-debi-tirar", i: "11-release-debi-tirar" },
  "Release: East Atlanta (Video)": { d: "12-release-video-type", i: "12-release-video-type" },
  // Experience & Community
  "Experience Page": { d: "13-experience", i: "13-experience" },
  "Community Page": { d: "14-community", i: "14-community" },
  "Experience Shortlink": { d: "15-experience-shortlink", i: "15-experience-shortlink" },
  // Type routing (redirects)
  "Routing: Experience": { d: "16-routing-experience", i: "16-routing-experience" },
  "Routing: Community": { d: "17-routing-community", i: "17-routing-community" },
  // Auth
  "Auth Login": { d: "18-auth-login", i: "18-auth-login" },
  "Auth Onboarding": { d: "19-auth-onboarding", i: "19-auth-onboarding" },
  // Authenticated
  "User Library": { d: "20-user-library", i: "20-user-library" },
  "Chats": { d: "21-chats", i: "21-chats" },
  // Checkout
  "Checkout (redirect)": { d: "22-checkout-apple", i: "22-checkout-apple" },
  "Legacy Order": { d: "23-order-legacy", i: "23-order-legacy" },
  // Access pages (redirect to auth/login from SSR — works in browser post-hydration)
  "Access: Audio": { d: "24-access-audio", i: "24-access-audio" },
  "Access: Video": { d: "25-access-video", i: "25-access-video" },
  "Access: Gallery": { d: "26-access-gallery", i: "26-access-gallery" },
  "Access: Merchandise": { d: "27-access-merch", i: "27-access-merch" },
  "Access: Event": { d: "28-access-event", i: "28-access-event" },
  "Access: Stems": { d: "29-access-stems", i: "29-access-stems" },
  "Access: Album Browser": { d: "30-access-media-album", i: "30-access-media-album" },
  // Portal pages (redirects)
  "Portal /p/": { d: "31-portal-p", i: "31-portal-p" },
  "Portal Community": { d: "32-portal-community", i: "32-portal-community" },
  "Portal Experience": { d: "33-portal-experience", i: "33-portal-experience" },
  // i18n locales
  "Locale: English": { d: "34-locale-en", i: "34-locale-en" },
  "Locale: Spanish": { d: "35-locale-es", i: "35-locale-es" },
  "Locale: French": { d: "36-locale-fr", i: "36-locale-fr" },
  "Locale: Japanese": { d: "37-locale-ja", i: "37-locale-ja" },
  "Locale: Portuguese": { d: "38-locale-pt", i: "38-locale-pt" },
  "Locale: Arabic (RTL)": { d: "39-locale-ar-rtl", i: "39-locale-ar-rtl" },
};

const CAPTURED = new Proxy({}, {
  get: (_, k) => FILES[k] ? (FILES[k].d || FILES[k].i) : undefined,
});

// ── Navigation Taxonomy ────────────────────────────────────────────────
const TAXONOMY = {
  "Auth": {
    level: "L0",
    screens: [
      { name: "Login / SignUp", route: "/auth/login", level: "L0", auth: false },
      { name: "OAuth Callback", route: "/auth/callback", level: "FS", auth: false },
      { name: "Fan Onboarding", route: "/auth/onboarding", level: "FS", auth: true },
    ]
  },
  "Browse & Discovery": {
    level: "L0",
    screens: [
      { name: "Explore (Home)", route: "/explore", level: "L0", auth: false },
      { name: "All Releases", route: "/releases/all", level: "L1", auth: false },
      { name: "Search", route: "/search", level: "L1", auth: false },
      { name: "All Artists", route: "/artists/all", level: "L1", auth: false },
      { name: "Artist Profile", route: "/artists/[slug]", level: "L1", auth: false },
      { name: "Artist Collection", route: "/artists/[slug]/collection/[id]", level: "L2", auth: false },
      { name: "Watch (Video Feed)", route: "/watch", level: "L0", auth: false },
    ]
  },
  "Release Pages": {
    level: "L1",
    screens: [
      { name: "Release Detail (Music)", route: "/r/[slug]", level: "L1", auth: false },
      { name: "Release Portal (Post-Purchase)", route: "/p/[slug]", level: "L1", auth: true },
      { name: "Restricted Release", route: "/releases/restricted/[slug]", level: "L2", auth: true },
      { name: "Experience Page", route: "/experience/[slug]", level: "L1", auth: false },
      { name: "Experience Portal", route: "/experience/portal/[slug]", level: "L2", auth: false },
      { name: "Community Page", route: "/community/[slug]", level: "L1", auth: false },
      { name: "Community Portal", route: "/community/portal/[slug]", level: "L2", auth: false },
    ]
  },
  "Checkout": {
    level: "FS",
    screens: [
      { name: "Checkout Page", route: "/checkout/[slug]", level: "FS", auth: false },
      { name: "Legacy Order Page", route: "/releases/order/[slug]", level: "L1", auth: false },
      { name: "Experience Confirmation", route: "/experience/confirmation/[slug]", level: "FS", auth: false },
      { name: "Community Confirmation", route: "/community/confirmation/[slug]", level: "FS", auth: false },
    ]
  },
  "Post-Purchase Access": {
    level: "L2",
    screens: [
      { name: "Audio Player", route: "/access/audio/[slug]", level: "L2", auth: true },
      { name: "Video Player", route: "/access/video/[slug]", level: "L2", auth: true },
      { name: "Gallery", route: "/access/gallery/[slug]", level: "L2", auth: true },
      { name: "Document Viewer", route: "/access/document/[slug]", level: "L2", auth: true },
      { name: "Merchandise", route: "/access/merchandise/[slug]", level: "L2", auth: true },
      { name: "Event / RSVP", route: "/access/event/[slug]", level: "L2", auth: true },
      { name: "Podcast Player", route: "/access/podcast/[slug]", level: "L2", auth: true },
      { name: "Stems Download", route: "/access/stems/[slug]", level: "L2", auth: true },
      { name: "Album Browser", route: "/access/media/album/[slug]", level: "L2", auth: true },
      { name: "Campaign", route: "/access/campaign/[slug]", level: "L2", auth: true },
      { name: "Custom Content", route: "/access/custom/[slug]", level: "L2", auth: true },
      { name: "External Link", route: "/access/external/[slug]", level: "L2", auth: true },
    ]
  },
  "Social & Chat": {
    level: "L0",
    screens: [
      { name: "Chats List", route: "/chats", level: "L0", auth: false },
      { name: "Chat Thread", route: "/chats/[slug]", level: "L1", auth: false },
      { name: "General Chat", route: "/chat-general/[id]", level: "L1", auth: true },
    ]
  },
  "User & Library": {
    level: "L0",
    screens: [
      { name: "User Profile / Library", route: "/users", level: "L0", auth: true },
      { name: "Mobile Menu", route: "/menu", level: "L0", auth: true },
    ]
  },
  "Drop Links & Misc": {
    level: "L1",
    screens: [
      { name: "Drop Link Page", route: "/l/[slug]", level: "L1", auth: false },
    ]
  },
};

// ── E2E Flow Groups ────────────────────────────────────────────────────
const FLOW_GROUPS = [
  {
    title: "Auth Flows",
    description: "Authentication and session management. Magic SDK (Email OTP, SMS, OAuth) + NextAuth session.",
    flows: [
      {
        id: 1, name: "Email OTP Login", priority: "P1", suite: "Auth", complexity: "Medium",
        blocker: "Magic SDK (external)",
        steps: [
          { screen: "Explore", route: "/explore", level: "L0" },
          { screen: "Login", route: "/auth/login", level: "L0" },
          { screen: "OTP Verification", route: "/auth/login", level: "L0" },
          { screen: "Onboarding (conditional)", route: "/auth/onboarding", level: "FS" },
          { screen: "Redirect to Explore", route: "/explore", level: "L0" },
        ],
        assertions: ["Session created", "User redirected", "auth_completed PostHog event"]
      },
      {
        id: 2, name: "Inline Auth at Checkout", priority: "P0", suite: "Auth", complexity: "Complex",
        blocker: "Magic SDK + Stripe",
        steps: [
          { screen: "Release Page", route: "/r/[slug]", level: "L1" },
          { screen: "Inline Auth Modal", route: "/r/[slug]", level: "L1" },
          { screen: "Stripe Checkout", route: "external", level: "FS" },
        ],
        assertions: ["Auth + checkout in single flow", "No navigation to /auth/login"]
      },
      {
        id: 3, name: "E2E Bypass Auth (CI)", priority: "P0", suite: "Auth", complexity: "Simple",
        blocker: "None (bypass implemented)",
        steps: [
          { screen: "CSRF Token", route: "/api/auth/csrf", level: "-" },
          { screen: "Credentials Callback", route: "/api/auth/callback/credentials", level: "-" },
          { screen: "Session Active", route: "/explore", level: "L0" },
        ],
        assertions: ["Session cookie set", "walletAddress in session", "No Magic SDK calls"]
      },
      {
        id: 4, name: "Session Persistence", priority: "P1", suite: "Auth", complexity: "Simple",
        blocker: "None",
        steps: [
          { screen: "Login (bypass)", route: "/api/auth/callback/credentials", level: "-" },
          { screen: "Explore", route: "/explore", level: "L0" },
          { screen: "Release Page", route: "/r/[slug]", level: "L1" },
          { screen: "Refresh Page", route: "/r/[slug]", level: "L1" },
        ],
        assertions: ["Session persists across navigation", "Session survives refresh"]
      },
      {
        id: 5, name: "Logout", priority: "P3", suite: "Auth", complexity: "Simple",
        blocker: "None",
        steps: [
          { screen: "Any Auth Page", route: "/users", level: "L0" },
          { screen: "Logout Action", route: "/", level: "-" },
          { screen: "Explore (logged out)", route: "/explore", level: "L0" },
        ],
        assertions: ["Session destroyed", "Redirected to explore"]
      },
    ]
  },
  {
    title: "Browse & Discovery Flows",
    description: "Public-facing content discovery. All screens accessible without auth.",
    flows: [
      {
        id: 6, name: "Explore Page Browse", priority: "P2", suite: "Browse", complexity: "Simple",
        blocker: "None",
        steps: [
          { screen: "Explore", route: "/explore", level: "L0" },
        ],
        assertions: ["Releases load", "Images render", "Carousel functional"]
      },
      {
        id: 7, name: "Search Artist or Release", priority: "P2", suite: "Browse", complexity: "Simple",
        blocker: "Algolia (external)",
        steps: [
          { screen: "Search", route: "/search", level: "L1" },
          { screen: "Result Click", route: "/artists/[slug]", level: "L1" },
        ],
        assertions: ["Results appear on type", "Navigation to detail works"]
      },
      {
        id: 8, name: "Artist Discovery", priority: "P2", suite: "Browse", complexity: "Medium",
        blocker: "None",
        steps: [
          { screen: "All Artists", route: "/artists/all", level: "L1" },
          { screen: "Artist Profile", route: "/artists/[slug]", level: "L1" },
          { screen: "Click Release", route: "/r/[slug]", level: "L1" },
        ],
        assertions: ["Tabs switch", "Release cards link correctly"]
      },
    ]
  },
  {
    title: "Release View Flows",
    description: "Release detail pages with pricing, tiers, and content preview.",
    flows: [
      {
        id: 9, name: "View Music Release", priority: "P2", suite: "Releases", complexity: "Medium",
        blocker: "CloudFront (audio preview)",
        steps: [
          { screen: "Release Page", route: "/r/[slug]", level: "L1" },
        ],
        assertions: ["Tiers render with prices", "Track list visible", "Artist info present"]
      },
      {
        id: 10, name: "View Experience Release", priority: "P2", suite: "Releases", complexity: "Medium",
        blocker: "None",
        steps: [
          { screen: "Experience Page", route: "/experience/[slug]", level: "L1" },
        ],
        assertions: ["Experience type detected", "Access list visible"]
      },
      {
        id: 11, name: "View Community Release", priority: "P2", suite: "Releases", complexity: "Medium",
        blocker: "None",
        steps: [
          { screen: "Community Page", route: "/community/[slug]", level: "L1" },
        ],
        assertions: ["Community type detected", "Waitlist form shows for scheduled status"]
      },
    ]
  },
  {
    title: "Purchase Flows",
    description: "Revenue-critical checkout and payment flows. Stripe test mode required.",
    flows: [
      {
        id: 12, name: "Standard Tier Purchase", priority: "P0", suite: "Payments", complexity: "Complex",
        blocker: "Stripe (test mode)",
        steps: [
          { screen: "Release Page", route: "/r/[slug]", level: "L1" },
          { screen: "Checkout Page", route: "/checkout/[slug]", level: "FS" },
          { screen: "Stripe Checkout", route: "external", level: "FS" },
          { screen: "Confirmation", route: "/community/confirmation/[slug]", level: "FS" },
        ],
        assertions: ["checkout_initiated fired", "Purchase created", "Access granted"]
      },
      {
        id: 13, name: "Free Release Acquisition", priority: "P1", suite: "Payments", complexity: "Medium",
        blocker: "None",
        steps: [
          { screen: "Release Page (free)", route: "/r/[slug]", level: "L1" },
          { screen: "Get Access Click", route: "/r/[slug]", level: "L1" },
          { screen: "Confirmation", route: "/community/confirmation/[slug]", level: "FS" },
        ],
        assertions: ["No Stripe session", "Access granted immediately"]
      },
      {
        id: 14, name: "Gift Purchase", priority: "P1", suite: "Payments", complexity: "Complex",
        blocker: "Stripe",
        steps: [
          { screen: "Release Page", route: "/r/[slug]", level: "L1" },
          { screen: "Checkout (Gift Form)", route: "/checkout/[slug]", level: "FS" },
          { screen: "Stripe Checkout", route: "external", level: "FS" },
        ],
        assertions: ["Gift form validates", "Recipient email captured", "Gift email sent"]
      },
      {
        id: 15, name: "Waitlist Join", priority: "P2", suite: "Releases", complexity: "Simple",
        blocker: "None",
        steps: [
          { screen: "Release Page (waitlist)", route: "/r/[slug]", level: "L1" },
          { screen: "Waitlist Form Submit", route: "/r/[slug]", level: "L1" },
        ],
        assertions: ["waitlist_joined fired", "Form submission succeeds"]
      },
    ]
  },
  {
    title: "Post-Purchase Content Flows",
    description: "Content consumption after purchase. All require auth + access rights.",
    flows: [
      {
        id: 16, name: "Play Audio Album", priority: "P0", suite: "Content", complexity: "Medium",
        blocker: "CloudFront (audio CDN)",
        steps: [
          { screen: "Portal", route: "/community/portal/[slug]", level: "L2" },
          { screen: "Audio Player", route: "/access/audio/[slug]", level: "L2" },
        ],
        assertions: ["Audio streams", "Track switching works", "song_played fired"]
      },
      {
        id: 17, name: "Watch Video Content", priority: "P0", suite: "Content", complexity: "Medium",
        blocker: "Mux (video CDN)",
        steps: [
          { screen: "Portal", route: "/experience/portal/[slug]", level: "L2" },
          { screen: "Video Player", route: "/access/video/[slug]", level: "L2" },
        ],
        assertions: ["Mux player loads", "Video plays", "video_playback_started fired"]
      },
      {
        id: 18, name: "Claim Merchandise", priority: "P1", suite: "Content", complexity: "Complex",
        blocker: "Shipping form",
        steps: [
          { screen: "Portal", route: "/community/portal/[slug]", level: "L2" },
          { screen: "Merchandise Page", route: "/access/merchandise/[slug]", level: "L2" },
          { screen: "Shipping Form", route: "/access/merchandise/[slug]", level: "L2" },
        ],
        assertions: ["Form validates", "Claim submitted", "merch_claim_completed fired"]
      },
    ]
  },
  {
    title: "Social & Chat Flows",
    description: "Real-time chat powered by GetStream SDK.",
    flows: [
      {
        id: 19, name: "Release Chat", priority: "P2", suite: "Chat", complexity: "Medium",
        blocker: "GetStream (external)",
        steps: [
          { screen: "Chats List", route: "/chats", level: "L0" },
          { screen: "Chat Thread", route: "/chats/[slug]", level: "L1" },
        ],
        assertions: ["Chat loads", "Messages render", "Can send message"]
      },
    ]
  },
  {
    title: "Account & Library Flows",
    description: "User profile, library, and onboarding.",
    flows: [
      {
        id: 20, name: "View Library", priority: "P1", suite: "Account", complexity: "Simple",
        blocker: "None",
        steps: [
          { screen: "User Library", route: "/users", level: "L0" },
        ],
        assertions: ["Owned releases display", "Click navigates to portal"]
      },
    ]
  },
  {
    title: "Drop Link & Share Flows",
    description: "Short links and promotional landing pages.",
    flows: [
      {
        id: 21, name: "Visit Drop Link", priority: "P2", suite: "Drop Links", complexity: "Medium",
        blocker: "None",
        steps: [
          { screen: "Drop Link Page", route: "/l/[slug]", level: "L1" },
          { screen: "Email Form Submit", route: "/l/[slug]", level: "L1" },
        ],
        assertions: ["drop_link_viewed fired", "Form submits", "Social links functional"]
      },
      {
        id: 22, name: "Studio Claim Code", priority: "P2", suite: "Releases", complexity: "Medium",
        blocker: "Claim code system",
        steps: [
          { screen: "Release with code", route: "/r/[slug]?code=XXXX", level: "L1" },
          { screen: "Code processed", route: "/p/[slug]", level: "L1" },
        ],
        assertions: ["Claim code processed server-side", "Access granted without payment"]
      },
    ]
  },
  {
    title: "Validation & Edge Cases",
    description: "Error handling, edge cases, and responsive validation.",
    isCompact: true,
    flows: [
      { id: 23, name: "Checkout Disabled Statuses", priority: "P3", suite: "Validation" },
      { id: 24, name: "Currency Conversion (13 currencies)", priority: "P3", suite: "Validation" },
      { id: 25, name: "RTL Locale Layout (Arabic)", priority: "P3", suite: "Validation" },
      { id: 26, name: "Unauthenticated Access to Protected Page", priority: "P3", suite: "Auth" },
      { id: 27, name: "Session Expiry Mid-Checkout", priority: "P3", suite: "Auth" },
      { id: 28, name: "Empty Library State", priority: "P3", suite: "Validation" },
      { id: 29, name: "404 Page", priority: "P3", suite: "Error" },
      { id: 30, name: "Mobile Responsive Checkout", priority: "P3", suite: "Responsive" },
      { id: 31, name: "reCAPTCHA Gate on Release Page", priority: "P3", suite: "Validation" },
    ]
  },
];

// ── Local Investigation Findings (2026-04-08) ──────────────────────────
const INVESTIGATION_FINDINGS = [
  // Stack & connectivity
  { status: "proven", finding: "Backend Docker boots OK after bundle install + ABSOUL env stub", date: "2026-04-08" },
  { status: "proven", finding: "DB staging data persists in .docker-data/ — 1,120 users, 681 releases, 1,236 purchases. Seeds NOT needed.", date: "2026-04-08" },
  { status: "proven", finding: "CORS localhost:3000 works (RAILS_ALLOWED_ORIGINS in .env.develop)", date: "2026-04-08" },
  // Auth bypass
  { status: "proven", finding: "Backend E2E bypass works — celsius+testfan@even.biz (fan, verified, onboarded, 49 purchases)", date: "2026-04-08" },
  { status: "proven", finding: "Frontend NextAuth bypass implemented and working — session with real wallet from backend", date: "2026-04-08" },
  { status: "proven", finding: "Bypass iteracion 1 fallo (wallet dinamico). Iteracion 2 exitosa (fetch backend para wallet real).", date: "2026-04-08" },
  // Pages tested
  { status: "proven", finding: "Explore page renders against local backend (HTTP 200, 62KB)", date: "2026-04-08" },
  { status: "proven", finding: "Release page /r/latest-release renders authenticated (HTTP 200, 84KB) — 4 tracks, 8 accesses", date: "2026-04-08" },
  { status: "proven", finding: "API endpoint /api/v1/releases/[slug] returns correct JSON:API data", date: "2026-04-08" },
  // Access rights
  { status: "proven", finding: "Test fan had 49 purchases but 0 access_rights. Created 4 ARs via Rails runner for latest-release, second-release, debi-tirar-mas-fotos, hope-we-have-fun.", date: "2026-04-08" },
  // Bugs found
  { status: "bug", finding: "Release page 500 for some releases — double URL in mediaURL() + manual prepend (local-only, staging uses CloudFront absolute URLs)", date: "2026-04-08" },
  { status: "bug", finding: "/access/* pages redirect to /auth/signIn from SSR — request interceptor calls getSession() (client-only) on server, returns null, overwrites Bearer token. Not a blocker for Playwright (browser handles cookies).", date: "2026-04-08" },
  // Gaps
  { status: "gap", finding: "New env vars from main require stubs in .env.develop (ABSOUL_MAGIC_*). Each rebase can bring new vars.", date: "2026-04-08" },
  { status: "gap", finding: "NEXTAUTH_URL was missing http:// protocol — fixed locally", date: "2026-04-08" },
  { status: "proven", finding: "78 screenshots captured (39 desktop 1440x900 + 39 iPhone 390x844) via Playwright capture script. 52 OK, 26 redirect, 0 errors.", date: "2026-04-09" },
];

// ── Blocker Summary ────────────────────────────────────────────────────
const BLOCKERS = [
  { name: "Stripe", severity: "Critical", flows: [2, 12, 14], mitigation: "Stripe test mode keys + test card 4242..." },
  { name: "Magic SDK", severity: "Critical", flows: [1], mitigation: "E2E bypass implemented (Flow 3)" },
  { name: "CloudFront", severity: "High", flows: [9, 16], mitigation: "Validate player presence, not actual playback" },
  { name: "GetStream", severity: "Medium", flows: [19], mitigation: "GetStream test environment or mock" },
  { name: "Mux", severity: "Medium", flows: [17], mitigation: "Mux test environment or mock player" },
  { name: "Algolia", severity: "Low", flows: [7], mitigation: "Algolia test index or mock" },
  { name: "Double URL Bug", severity: "High", flows: [9], mitigation: "Fix mediaURL() or guard against absolute URLs. Use releases without ActiveStorage relative paths (e.g., latest-release)." },
  { name: "SSR getSession() null", severity: "Medium", flows: [16, 17, 18], mitigation: "Not a Playwright blocker — browser handles cookies. Fix: check IS_SERVER in request interceptor." },
  { name: "Env var drift", severity: "Medium", flows: [], mitigation: "Each rebase from main can add new ENV.fetch() vars that crash boot. Maintain .env.develop stubs." },
];

// ── Test Data Available (staging DB) ───────────────────────────────────
const TEST_DATA = {
  fan: {
    email: "celsius+testfan@even.biz",
    wallet: "0xTestFanCelsius0000000000000000000000001",
    role: "fan",
    purchases: 49,
    accessRights: 4,
  },
  releasesWithAccess: [
    { slug: "latest-release", name: "latest release", tracks: 4, albumId: 855, arId: 7406 },
    { slug: "second-release", name: "second release", tracks: 10, albumId: 833, arId: 7407 },
    { slug: "debi-tirar-mas-fotos", name: "Debi Tirar Mas Fotos", tracks: 17, albumId: 432, arId: 7408 },
    { slug: "hope-we-have-fun", name: "Hope We Have Fun", tracks: 5, albumId: 470, arId: 7409 },
  ],
  releasesForBrowse: [
    { slug: "access-revamp-release", name: "Access Revamp Release", artist: "Twenty One Pilots", pricing: "PWYW" },
    { slug: "kehlani-release", name: "Kehlani Release", artist: "Kehlani", pricing: "PWYW" },
    { slug: "apple", name: "Apple", artist: "Hero!", pricing: "PWYW $10 min" },
    { slug: "doppelganger", name: "Doppelganger", artist: "Chillenow", pricing: "PWYW" },
  ],
  bypass: {
    secret: "d4a85541b4789f1534cf44572a93053e",
    headerEmail: "X-E2E-Email",
  },
};
