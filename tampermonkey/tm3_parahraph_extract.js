// ==UserScript==
// @name         Simple Paragraph Text Extractor
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Extracts all text from <p> tags and displays it on a clean page.
// @author       kkmcgg
// @match        http://*/*
// @match        https://*/*
// @grant        GM_addStyle
// @run-at       document-idle
// ==/UserScript==

(function() {
    'use strict';

    /**
     * Creates and injects a trigger button to run the script.
     */
    function createTriggerButton() {
        const button = document.createElement('button');
        button.textContent = 'Extract ¶';
        button.title = 'Extract Paragraph Text';
        button.id = 'extract-p-trigger-button';

        // Apply some basic styling to the button
        Object.assign(button.style, {
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            zIndex: '999999',
            backgroundColor: '#fff',
            color: '#000',
            border: '2px solid #000',
            borderRadius: '8px',
            padding: '10px 15px',
            fontSize: '16px',
            cursor: 'pointer',
            fontWeight: 'bold',
            boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
        });

        button.addEventListener('click', extractAndDisplayParagraphs, { once: true });
        document.body.appendChild(button);
    }

    /**
     * Finds all <p> tags, extracts their text, and replaces the page content.
     */
    function extractAndDisplayParagraphs() {
        console.log("Extracting paragraph text...");

        // --- Step 1: Get all <p> elements and extract their innerText ---
        const paragraphElements = document.querySelectorAll('p');

        // Use Array.from to convert NodeList to Array, then map over it.
        // .innerText gets the rendered text content.
        // .trim() removes leading/trailing whitespace.
        // .filter(Boolean) removes any empty paragraphs.
        const allParagraphText = Array.from(paragraphElements)
            .map(p => p.innerText.trim())
            .filter(Boolean)
            .join('\n\n'); // Separate each paragraph with a double newline for readability.

        // --- Step 2: Wipe the page clean ---
        document.head.innerHTML = '';
        document.body.innerHTML = '';

        // --- Step 3: Apply a clean, readable style for the new content ---
        GM_addStyle(`
            body {
                background-color: #f4f4f4 !important;
                color: #333 !important;
                font-family: Georgia, serif !important;
                line-height: 1.8 !important;
                font-size: 18px !important;
                max-width: 800px;
                margin: 40px auto !important;
                padding: 20px 40px !important;
            }
            pre {
                white-space: pre-wrap; /* Allows text to wrap */
                word-wrap: break-word;
                font-family: inherit; /* Use the body's serif font */
            }
        `);

        // --- Step 4: Create a <pre> element to hold the text and add it to the body ---
        // A <pre> tag is used to respect the newline characters we added.
        const textContainer = document.createElement('pre');
        textContainer.textContent = allParagraphText;

        document.body.appendChild(textContainer);

        console.log("Paragraph text extracted and displayed.");
    }

    // Add the trigger button once the page has finished loading.
    window.addEventListener('load', createTriggerButton);

})();
