/**
 * Main — Fan Screen Map Entry Point
 * Depends on: data.js, render.js, mermaid, svg-pan-zoom (loaded via <script> tags)
 */
document.addEventListener('DOMContentLoaded', () => {
  mermaid.initialize({
    theme: 'dark',
    startOnLoad: false,
    flowchart: {
      curve: 'basis',
      padding: 20,
      nodeSpacing: 30,
      rankSpacing: 60,
      useMaxWidth: false,
    },
  });

  renderMetrics(document.getElementById('metrics'), FLOW_GROUPS, TAXONOMY);
  renderFindings(document.getElementById('findings'), INVESTIGATION_FINDINGS);
  renderStoryboards(document.getElementById('storyboards'), FLOW_GROUPS, FILES);
  renderBlockers(document.getElementById('blockers'), BLOCKERS);
  renderTaxonomy(document.getElementById('taxonomy'), TAXONOMY);

  // Render Mermaid then attach svg-pan-zoom
  mermaid.run().then(() => {
    document.querySelectorAll('.mermaid svg').forEach((svg) => {
      svg.setAttribute('width', '100%');
      svg.setAttribute('height', '500');

      if (typeof svgPanZoom !== 'undefined') {
        svgPanZoom(svg, {
          zoomEnabled: true,
          panEnabled: true,
          controlIconsEnabled: true,
          fit: true,
          center: true,
          minZoom: 0.3,
          maxZoom: 10,
          zoomScaleSensitivity: 0.3,
        });
      }
    });
  });

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
