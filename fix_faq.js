const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'index.html');
let content = fs.readFileSync(filePath, 'utf8');

// 1. We will find all occurrences of `<div class="faq-item`
// The first 4 will be left alone.
// The 5th onwards will have ` style="display: none;" class="faq-hidden"` appended to the opening tag.
let faqCount = 0;
content = content.replace(/<div class="faq-item/g, (match) => {
  faqCount++;
  if (faqCount > 4) {
    return match + ' faq-extra" style="display: none;"';
  }
  return match;
});

// 2. Add the "Show all FAQs" button right before the closing `</div>\n      </div>\n    </section>` of the FAQ section.
// The FAQ section ends with:
//         </div>
//       </div>
//     </section>
// Let's insert the button right after the last faq-item's closing tag, which is right before the `</div>` of the faq container.
const faqEndString = `          </div>
        </div>
      </div>
    </section>

    <!-- FAQPage Schema -->`;

const replacementString = `          </div>
          
          <div style="text-align: center; margin-top: var(--space-8);">
            <button id="show-all-faqs-btn" class="btn btn--secondary">Show all FAQs</button>
          </div>
        </div>
      </div>
    </section>

    <script>
      document.addEventListener('DOMContentLoaded', () => {
        const btn = document.getElementById('show-all-faqs-btn');
        if (btn) {
          btn.addEventListener('click', () => {
            const hiddenFaqs = document.querySelectorAll('.faq-extra');
            hiddenFaqs.forEach(faq => {
              faq.style.display = 'block';
              // slight delay for animation if needed, but display block works
            });
            btn.style.display = 'none'; // hide button after showing all
          });
        }
      });
    </script>

    <!-- FAQPage Schema -->`;

content = content.replace(faqEndString, replacementString);

fs.writeFileSync(filePath, content, 'utf8');
console.log('FAQ section updated successfully.');
