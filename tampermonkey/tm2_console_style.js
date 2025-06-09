// ==UserScript==
// @name         Reddit to Console Styler
// @namespace    http://tampermonkey.net/
// @version      3.1
// @description  Aggressively re-styles a Reddit page into a simple, console-like format for readability.
// @author       kkmcgg
// @match        https://*.reddit.com/*
// @match        http://*/*
// @match        https://*/*
// @grant        GM_addStyle
// @run-at       document-idle
// ==/UserScript==

(function() {
    'use strict';

    /**
     * Creates and injects the trigger button onto the page.
     */
    function createTriggerButton() {
        const button = document.createElement('button');
        button.textContent = '📟';
        button.title = 'Apply Console Style';
        button.id = 'readable-trigger-button';

        Object.assign(button.style, {
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            zIndex: '999999',
            backgroundColor: '#1e1e1e',
            color: '#00ff41',
            border: '2px solid #00ff41',
            borderRadius: '8px',
            width: '50px',
            height: '50px',
            fontSize: '24px',
            cursor: 'pointer',
            fontFamily: 'monospace',
            boxShadow: '0 4px 8px rgba(0,0,0,0.5)',
            transition: 'transform 0.2s ease-in-out'
        });

        button.addEventListener('mouseover', () => button.style.transform = 'scale(1.1)');
        button.addEventListener('mouseout', () => button.style.transform = 'scale(1)');
        button.addEventListener('click', activateConsoleStyle, { once: true });

        document.body.appendChild(button);
    }

    /**
     * This function removes known clutter and applies a new style sheet.
     * It avoids deleting the body to prevent blank pages.
     */
    function activateConsoleStyle() {
        console.log("Activating Console Style...");

        // --- Step 1: Remove known clutter elements ---
        // This is a safer approach than rebuilding the page from scratch.
        const selectorsToRemove = [
            'header',
            'shreddit-header',
            'aside',
            '[role="banner"]',
            '[data-testid="frontpage-sidebar"]',
            '#SHORTCUT_FOCUSABLE_DIV > div:first-child', // Removes the top bar on some layouts
            'iframe',
            '.ad',
            '.premium-banner-outer',
            'div[data-testid="subreddit-sidebar"]',
            '#right-sidebar-container'
        ];

        document.querySelectorAll(selectorsToRemove.join(', ')).forEach(el => el.remove());

        // --- Step 2: Hide the button ---
        const triggerButton = document.getElementById('readable-trigger-button');
        if (triggerButton) {
            triggerButton.style.display = 'none';
        }

        // --- Step 3: Apply console/chat styling to the whole page ---
        // By targeting '*' and overriding, we can restyle the remaining content
        // without needing to parse and reconstruct it.
        GM_addStyle(`
            /* Reset and apply base theme */
            html, body {
                background-color: #121212 !important;
                background-image: none !important;
            }

            /* Apply console font and colors to all text elements */
            * {
                font-family: 'Courier New', Courier, monospace !important;
                color: #e0e0e0 !important;
                background-color: transparent !important;
                border: none !important;
                text-decoration: none !important;
            }

            /* Style links to be visible but not distracting */
            a, a * {
                color: #64b5f6 !important; /* A light blue for links */
                text-decoration: underline !important;
            }

            h1, h2, h3, h4, h5, h6 {
                 color: #4CAF50 !important; /* Green for headers */
            }

            /* Specific overrides for Reddit's custom elements */
            shreddit-comment,
            shreddit-post {
                background-color: #1e1e1e !important;
                border: 1px solid #333 !important;
                border-radius: 4px;
                padding: 10px !important;
                margin-bottom: 15px !important;
            }

            /* Remove distracting media and voting UI */
            shreddit-aspect-ratio,
            [data-testid="post-media-container"],
            [aria-label="upvote"],
            [aria-label="downvote"],
            [data-testid="post-context-menu"],
            faceplate-screen-sizer-provider,
            [slot="vote-bar"],
            [noun="award"] {
                display: none !important;
            }

            /* Make user links stand out like in the chat log */
            [data-testid="comment_author_link"], [slot="authorName"] {
                color: #4CAF50 !important; /* Green for usernames */
                font-weight: bold !important;
            }
        `);

        console.log("Console style applied.");
    }

    // Wait for the window to be fully loaded before adding our trigger button
    window.addEventListener('load', createTriggerButton);

})();
