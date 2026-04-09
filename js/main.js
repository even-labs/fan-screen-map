/**
 * Main — Fan Screen Map Entry Point (v0.1.0)
 * Depends on: data.js, render.js (loaded in order via <script> tags)
 */
document.addEventListener('DOMContentLoaded', () => {
  mermaid.initialize({ theme: 'dark', startOnLoad: true });

  renderMetrics(document.getElementById('metrics'), FLOW_GROUPS, TAXONOMY);
  renderFindings(document.getElementById('findings'), INVESTIGATION_FINDINGS);
  renderStoryboards(document.getElementById('storyboards'), FLOW_GROUPS, FILES);
  renderBlockers(document.getElementById('blockers'), BLOCKERS);
  renderTaxonomy(document.getElementById('taxonomy'), TAXONOMY);

  // Lightbox — click thumbnail to preview full size
  const lb = document.getElementById('lightbox');
  const lbImg = lb.querySelector('img');
  const lbCaption = lb.querySelector('.caption');

  document.addEventListener('click', (e) => {
    const thumb = e.target.closest('.flow-step .thumb:not(.placeholder) img');
    if (thumb) {
      lbImg.src = thumb.src;
      lbCaption.textContent = thumb.alt;
      lb.classList.add('active');
    }
  });

  lb.addEventListener('click', () => lb.classList.remove('active'));
  lb.querySelector('.close').addEventListener('click', () => lb.classList.remove('active'));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') lb.classList.remove('active');
  });
});
