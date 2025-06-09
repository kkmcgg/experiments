// ==UserScript==
// @name         Aggressive Readability Declutterer
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Tries very, very hard to strip a page down to just the readable text by removing non-essential elements and re-styling for clarity.
// @author       kkmcgg
// @match        http://*/*
// @match        https://*/*
// @grant        GM_addStyle
// @run-at       document-idle
// ==/UserScript==

(function() {
    'use_strict';

    /**
     * Creates and injects the "Readable Mode" button onto the page.
     * This button allows the user to trigger the decluttering process manually.
     */
    function createTriggerButton() {
        const button = document.createElement('button');
        button.textContent = '📖';
        button.title = 'Enter Readable Mode';

        // Style the button to be non-intrusive but easily accessible
        button.style.position = 'fixed';
        button.style.bottom = '20px';
        button.style.right = '20px';
        button.style.zIndex = '999999';
        button.style.backgroundColor = '#ffffff';
        button.style.color = '#000000';
        button.style.border = '2px solid #000000';
        button.style.borderRadius = '50%';
        button.style.width = '50px';
        button.style.height = '50px';
        button.style.fontSize = '24px';
        button.style.cursor = 'pointer';
        button.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
        button.style.transition = 'transform 0.2s ease-in-out';

        button.addEventListener('mouseover', () => {
            button.style.transform = 'scale(1.1)';
        });
        button.addEventListener('mouseout', () => {
            button.style.transform = 'scale(1)';
        });

        button.addEventListener('click', activateReadableMode, { once: true });

        document.body.appendChild(button);
    }

    /**
     * The main function that performs the decluttering.
     */
    function activateReadableMode() {
        console.log('Activating Aggressive Readable Mode...');

        // Selectors for elements to remove. This is an extensive list.
        const selectorsToRemove = [
            // Structural & Semantic Tags
            'nav', 'header', 'footer', 'aside', 'sidebar',
            // Common ID and Class Names for non-content
            '.ad', '.ads', '.advert', '.advertisement', '.banner', '.ad-container', // Ads
            '#sidebar', '#secondary', '.sidebar', '.widget-area', // Sidebars
            '#comments', '.comments-area', // Comments
            '#footer', '.site-footer', // Footers
            '#header', '.site-header', // Headers
            '#navigation', '.navigation', '.nav', // Navigation
            '.social', '.social-links', '.share-buttons', // Social media
            '.cookie-banner', '.cookie-notice', '#cookie-consent', // Cookie notices
            '.modal', '.popup', '#overlay', // Popups and modals
            '.related-posts', '.yarpp-related', // Related content
            'form', // Forms (search, login, etc.)
            'iframe', // Iframes (often ads or trackers)
            'script', // All scripts
            'style', // All inline/embedded styles
            'link[rel="stylesheet"]', // External stylesheets
            // ARIA roles
            '[role="banner"]', '[role="navigation"]', '[role="complementary"]', '[role="contentinfo"]', '[role="search"]',
            // Promotional sections
            '.promo', '#promo', '.promotion'
        ];

        // --- Step 1: Remove elements by selector ---
        document.querySelectorAll(selectorsToRemove.join(', ')).forEach(el => el.remove());

        // --- Step 2: Heuristically remove elements that are likely non-content ---
        // This looks for elements that are small, visually hidden, or positioned absolutely.
        document.querySelectorAll('div, section, span, p').forEach(el => {
            const style = window.getComputedStyle(el);
            const rect = el.getBoundingClientRect();

            // Remove elements that are not visible or very small
            if (rect.height < 10 || rect.width < 10 || style.display === 'none' || style.visibility === 'hidden') {
                el.remove();
                return;
            }

            // Remove elements that are likely sidebars or popups based on position
            if (style.position === 'absolute' || style.position === 'fixed' || style.position === 'sticky') {
                 el.remove();
            }
        });


        // --- Step 3: Remove all attributes from remaining elements ---
        // This helps to neutralize any remaining styling or scripting hooks.
        const allElements = document.body.getElementsByTagName('*');
        for (let el of allElements) {
            // Whitelist 'href' on 'a' tags and 'src' on 'img' tags if you want to keep them
             const allowedAttrs = ['href', 'src', 'alt'];
             for (let i = el.attributes.length - 1; i >= 0; i--) {
                const attr = el.attributes[i];
                if (!allowedAttrs.includes(attr.name)) {
                     el.removeAttribute(attr.name);
                }
             }
        }

        // --- Step 4: Apply clean, readable styles ---
        // We use GM_addStyle for its efficiency and because it works well in userscripts.
        GM_addStyle(`
            /* Global Reset & Typography */
            body, html {
                background-color: #f4f4f4 !important;
                color: #333 !important;
                font-family: 'Georgia', serif !important;
                line-height: 1.8 !important;
                font-size: 18px !important;
                margin: 0 !important;
                padding: 0 !important;
                overflow: auto !important;
            }

            /* Main Content Container */
            body {
                display: block !important;
                max-width: 800px !important;
                margin: 40px auto !important; /* Center the content */
                padding: 20px 40px !important;
                border: 1px solid #ddd;
                background: #fff !important;
                box-shadow: 0 0 15px rgba(0,0,0,0.1);
            }

            /* Remove all positioning to force a single column */
            * {
                position: static !important;
                float: none !important;
                width: auto !important;
                height: auto !important;
                margin: 1em 0 !important;
                padding: 0 !important;
                display: block !important;
                background: transparent !important;
                border: none !important;
                font-size: 1em !important; /* Inherit from body */
                color: inherit !important;
            }

            /* Styling for key elements */
            h1, h2, h3, h4, h5, h6 {
                font-family: 'Helvetica Neue', sans-serif !important;
                color: #111 !important;
                line-height: 1.3 !important;
                margin-top: 1.5em !important;
                margin-bottom: 0.5em !important;
            }

            p, li, blockquote {
                max-width: 100% !important; /* Ensure text wraps */
            }

            a {
                color: #0056b3 !important;
                text-decoration: underline !important;
            }

            img, figure {
                 max-width: 100% !important;
                 height: auto !important;
                 margin: 20px auto !important;
                 display: block !important;
                 border-radius: 4px;
            }

            pre, code {
                font-family: 'Menlo', 'monospace' !important;
                background-color: #eee !important;
                padding: 15px !important;
                border-radius: 4px;
                white-space: pre-wrap !important; /* Wrap long lines of code */
                word-break: break-all;
            }

            /* Hide the trigger button after it has been used */
            #${'readable-trigger-button'} {
                display: none !important;
            }
        `);

        // Finally, hide the button that triggered this.
        const triggerButton = document.querySelector('button[title="Enter Readable Mode"]');
        if (triggerButton) {
            triggerButton.style.display = 'none';
        }

        console.log('Readable Mode activated.');
    }

    // Wait for the window to load before adding the button.
    window.addEventListener('load', createTriggerButton);

})();
