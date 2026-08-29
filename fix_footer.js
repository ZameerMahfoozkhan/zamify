const fs = require('fs');
const path = require('path');

const files = [
  'index.html',
  'pages/about.html',
  'pages/contact.html',
  'pages/privacy.html',
  'pages/terms.html',
  'pages/work.html',
  'services/web-development.html'
];

files.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (!fs.existsSync(filePath)) return;

  let content = fs.readFileSync(filePath, 'utf8');

  // Determine prefix based on depth
  const depth = file.split('/').length - 1;
  const prefix = depth === 0 ? '' : '../';

  const newFooter = `  <footer class="footer">
    <div class="container">
      <div class="footer__grid">
        <div>
          <a href="${prefix}index.html" class="footer__logo">
            <img src="${prefix}assets/images/logo.webp" alt="Zamify Footer Logo" width="2172" height="724" style="height: 40px; width: auto;">
          </a>
          <div class="footer__tagline">Build. Create. Grow.</div>
          <p class="footer__brand-desc">A global digital agency helping ambitious businesses build stronger brands, better digital experiences, and sustainable online growth.</p>

          <div class="social-links" style="margin-top: var(--space-6);">
            <a href="[WHATSAPP LINK]" target="_blank" rel="noopener" class="social-link" aria-label="WhatsApp"><i class="ph ph-whatsapp-logo"></i></a>
            <a href="[INSTAGRAM LINK]" target="_blank" rel="noopener" class="social-link" aria-label="Instagram"><i class="ph ph-instagram-logo"></i></a>
            <a href="[LINKEDIN LINK]" target="_blank" rel="noopener" class="social-link" aria-label="LinkedIn"><i class="ph ph-linkedin-logo"></i></a>
            <a href="[X LINK]" target="_blank" rel="noopener" class="social-link" aria-label="X"><i class="ph ph-x-logo"></i></a>
          </div>
        </div>

        <div>
          <div class="footer__col-title">Navigation</div>
          <div class="footer__links">
            <a href="${prefix}index.html#services" class="footer__link">Services</a>
            <a href="${prefix}pages/work.html" class="footer__link">Work</a>
            <a href="${prefix}pages/about.html" class="footer__link">About</a>
            <a href="${prefix}index.html#process" class="footer__link">Process</a>
            <a href="${prefix}pages/contact.html" class="footer__link">Contact</a>
          </div>
        </div>

        <div>
          <div class="footer__col-title">Legal</div>
          <div class="footer__links">
            <a href="${prefix}pages/privacy.html" class="footer__link">Privacy Policy</a>
            <a href="${prefix}pages/terms.html" class="footer__link">Terms of Service</a>
          </div>
        </div>
      </div>

      <div class="footer__bottom">
        <span class="footer__copyright">&copy; 2026 Zamify. All rights reserved. <span style="opacity: 0.7; margin-left: 8px;">Developed by <a href="https://shreyansh-two.vercel.app/" target="_blank" rel="noopener" style="text-decoration: underline; color: inherit;">Shreyansh Yadav</a></span></span>
      </div>
    </div>
  </footer>`;

  // Replace existing footer
  const regex = /<footer class="footer">[\s\S]*?<\/footer>/;
  content = content.replace(regex, newFooter);
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Updated footer in ' + file);
});
