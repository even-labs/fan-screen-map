/**
 * Render Functions — Fan Screen Map v0.1.0
 * Adapted from backstage-screen-map render.js
 * Depends on: data.js (FILES, FLOW_GROUPS, TAXONOMY, INVESTIGATION_FINDINGS, BLOCKERS)
 */

function renderMetrics(container, flowGroups, taxonomy) {
  let totalScreens = 0;
  Object.values(taxonomy).forEach(domain => { totalScreens += domain.screens.length; });

  let totalFlows = 0;
  let p0Count = 0;
  flowGroups.forEach(g => {
    totalFlows += g.flows.length;
    g.flows.forEach(f => { if (f.priority === "P0") p0Count++; });
  });

  let desktopCount = 0;
  let iphoneCount = 0;
  Object.values(FILES).forEach(f => { if (f.d) desktopCount++; if (f.i) iphoneCount++; });

  container.innerHTML = `
    <div class="metric"><div class="value">${totalScreens}</div><div class="label">Screens</div></div>
    <div class="metric"><div class="value">${totalFlows}</div><div class="label">E2E Flows</div></div>
    <div class="metric"><div class="value">${p0Count}</div><div class="label">P0 Revenue</div></div>
    <div class="metric"><div class="value">${desktopCount + iphoneCount}</div><div class="label">Screenshots<br><small>${desktopCount}d + ${iphoneCount}i</small></div></div>
  `;
}

function renderFindings(container, findings) {
  let html = '<table><thead><tr><th>Status</th><th>Finding</th><th>Date</th></tr></thead><tbody>';
  findings.forEach(f => {
    const tagClass = f.status === 'proven' ? 'tag-done' : f.status === 'bug' ? 'tag-p0' : 'tag-p1';
    html += `<tr><td><span class="tag ${tagClass}">${f.status}</span></td><td>${f.finding}</td><td style="font-size:11px;color:var(--color-muted)">${f.date}</td></tr>`;
  });
  html += '</tbody></table>';
  container.innerHTML = html;
}

function renderStoryboards(container, flowGroups, files) {
  flowGroups.forEach(group => {
    let html = `<h3>${group.title}</h3>`;
    if (group.description) html += `<p style="font-size:12px;color:var(--color-muted);margin-bottom:12px">${group.description}</p>`;

    if (group.isCompact) {
      html += '<table><thead><tr><th>#</th><th>Flow</th><th>Priority</th><th>Suite</th></tr></thead><tbody>';
      group.flows.forEach(f => {
        html += `<tr><td>${f.id}</td><td>${f.name}</td><td><span class="tag tag-${f.priority.toLowerCase()}">${f.priority}</span></td><td><span class="tag tag-suite">${f.suite}</span></td></tr>`;
      });
      html += '</tbody></table>';
    } else {
      group.flows.forEach(f => {
        const pClass = f.priority.toLowerCase();
        html += `<div class="flow-card ${pClass}">`;
        html += `<div class="flow-header">`;
        html += `<span class="tag tag-${pClass}">${f.priority}</span>`;
        html += `<span class="name">Flow ${f.id}: ${f.name}</span>`;
        html += `<div class="meta">`;
        html += `<span class="tag tag-suite">${f.suite}</span>`;
        html += f.complexity ? `<span class="tag tag-suite">${f.complexity}</span>` : '';
        html += f.blocker ? `<span class="tag tag-p0">${f.blocker}</span>` : '';
        html += `</div></div>`;

        if (f.steps) {
          html += `<div class="flow-strip">`;
          f.steps.forEach(step => {
            const fileEntry = files[step.screen] || null;
            html += `<div class="flow-step"><div class="thumbs">`;
            // Desktop thumbnail
            if (fileEntry && fileEntry.d) {
              html += `<div class="thumb desktop"><img src="desktop/${fileEntry.d}.png" alt="${step.screen} desktop" loading="lazy"></div>`;
            } else {
              html += `<div class="thumb desktop placeholder"><span class="need">Capture</span><span class="route">${(step.route || '').slice(0,25)}</span></div>`;
            }
            // iPhone thumbnail
            if (fileEntry && fileEntry.i) {
              html += `<div class="thumb iphone"><img src="iphone/${fileEntry.i}.png" alt="${step.screen} iPhone" loading="lazy"></div>`;
            } else {
              html += `<div class="thumb iphone placeholder"><span class="need">—</span></div>`;
            }
            html += `</div>`;
            html += `<div class="label">${step.screen}</div>`;
            html += `<div class="level"><span class="tag tag-${(step.level || '-').toLowerCase().replace('/','-')}">${step.level || '-'}</span></div>`;
            html += `</div>`;
          });
          html += `</div>`;
        }

        if (f.assertions) {
          html += `<div class="flow-details"><details><summary>Assertions</summary><div class="content"><ul>`;
          f.assertions.forEach(a => html += `<li>${a}</li>`);
          html += `</ul></div></details></div>`;
        }
        html += `</div>`;
      });
    }
    container.innerHTML += html;
  });
}

function renderBlockers(container, blockers) {
  let html = '<table><thead><tr><th>Blocker</th><th>Severity</th><th>Flows</th><th>Mitigation</th></tr></thead><tbody>';
  blockers.forEach(b => {
    const tagClass = b.severity === 'Critical' ? 'tag-p0' : b.severity === 'High' ? 'tag-p1' : 'tag-p2';
    html += `<tr><td><strong>${b.name}</strong></td><td><span class="tag ${tagClass}">${b.severity}</span></td><td style="font-size:11px">${b.flows.join(', ')}</td><td style="font-size:12px;color:var(--color-muted)">${b.mitigation}</td></tr>`;
  });
  html += '</tbody></table>';
  container.innerHTML = html;
}

function renderTaxonomy(container, taxonomy) {
  let html = '';
  Object.entries(taxonomy).forEach(([section, domain]) => {
    html += `<h3>${section}</h3><table><thead><tr><th>Level</th><th>Screen</th><th>Route</th><th>Auth</th></tr></thead><tbody>`;
    domain.screens.forEach(s => {
      const authTag = s.auth ? '<span class="tag tag-p1">Auth</span>' : '<span class="tag tag-done">Public</span>';
      html += `<tr><td><span class="tag tag-${s.level.toLowerCase()}">${s.level}</span></td><td>${s.name}</td><td style="font-family:var(--font-mono);font-size:11px">${s.route}</td><td>${authTag}</td></tr>`;
    });
    html += '</tbody></table>';
  });
  container.innerHTML = html;
}
