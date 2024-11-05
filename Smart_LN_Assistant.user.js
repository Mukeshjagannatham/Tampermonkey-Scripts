// ==UserScript==
// @name         Smart_LN_Assistant
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  Load notes Assistor
// @author       mkeshaa
// @match        https://trans-logistics.amazon.com/fmc/execution/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    
    // Detect the browser
    if (navigator.userAgent.indexOf('Chrome') !== -1) {
        alert('This script is only supported on Firefox. Please install Tampermonkey for Firefox.');
        return; // Prevent the script from running in Chrome
    }

    // Your script logic here...
    console.log('Script running in Firefox');
})();

    const replacementTexts = {
        'TNM': 'TNM\nDriver/Dispatch:\nLong/Lat:\nProximity and Route:\nMiles to destination:\nIssue:\nResolution:',
        'LT': 'LT\n\nDriver/Dispatch:\nIssue:\nResolution:\nMiles to destination:',
        'NE<200mi': 'C2C\nDriver/Dispatch:\nIssue: No Empties < 200 miles\nDriver/Dispatch:\nResolution: Checked SDT passed, no empties, Approved BT.\nYMS:\nQS:',
        'NE>200mi': 'C2C\nDriver/Dispatch:\nIssue: No Empties > 200 miles\nDriver/Dispatch:\nResolution: Checked SDT passed, no empties, Redirected driver to nearby site: ABC1/ No nearby sites to redirect Approved BT.\nGot approval from FMER-BT group:\nYMS:\nQS:',
        'LS': 'C2C\nDriver/Dispatch:\nIssue: Load Status\nDriver/Dispatch:\nResolution: Advised to check with the GS at site.',
        'LNR_CF': 'C2C\nDriver/Dispatch:\nIssue: Load not Ready - SDTpast/SDT not past - CF\nResolution: Checked load is not ready, SDT past CF load escalated to recovery\nSDT not past advised to wait until SDT\nLoading status form SSP:',
        'LNR_NCF': 'C2C\nDriver/Dispatch:\nIssue: Load not Ready - SDTpast/SDT not past - NCF\nResolution: Checked load is not ready, SDT past NCF load Created case for cancellation\nCase ID:\nSDT not past advised to wait until SDT',
        'Tour_adjust': 'C2C\nDriver/Dispatch:\nIssue: Load Cancelled; trip adjustment needed\nResolution: Checked load was cancelled, adjusted the trip with FMER.',
        'RD_NCF': 'C2C\nDriver/Dispatch:\n\Issue: Driver delayed due to XYZ reason\nResolution: Advised to report delay from relay application and continue.',
        'RD_CF': 'C2C\nDriver/Dispatch:\n\Issue: Driver delayed due to XYZ reason\nResolution: Advised to report delay from relay application and escalated to recovery for monitoring.',
        'IM': 'C2C\nDriver/Dispatch:\n\Issue: Waybill/pickup number\nResolution: Created case for IM team to provide waybill/pickup number.\nCase ID:',
        'EXT': 'C2C\nDriver/Dispatch:\n\Issue: related to external load\nResolution: Transferred call to external team for better assistance.',
        'Mech_trailer': 'C2C\nDriver/Dispatch:\n\Issue: Mech_trailer\nResolution: Created WO sim with the details provided by Driver/Dispatch. Advised to wait for an update.\nWO SIM: (Not Visible to carrier).',
        'App_issue': 'C2C\nDriver/Dispatch:\n\Issue: App related issue\nResolution: Advised to try basic trouble shooting steps.',
        'OTHR': 'C2C\nDriver/Dispatch:\n\Issue: ABC\nResolution: ABC.',
        'GBS': 'GBS:\nNo gaps found, Escalated\nGaps found adjusted with FMER.',
        'LD': 'LD:\nDriver/Dispatch:\nReason for delayed departure:\nETA to depart from site:',
        'DNA': 'DNA:\nDispatch:\nDriver will be assigned by the carrier as confirmed/Dispatch unresponsive left VM\nDispatch, please assign the driver to this tour ASAP to avoid rejection.',
        'Time_stamp': 'Unable to mark Time stamp:\nSteps for Carriers to create Case for Time stamps in carrier portal\n1.Log in to the Relay Carrier Portal(relay website).\n2.Click on the hamburger menu(three-line icon) and select "Support center".\n3.Choose "Create/Submit a New Case" from the options.\n4.Select "Trip Completion Dispute" from the dropdown menu.\n5.Enter details such as VRID, check-in/check-out times in the provided text box.\n6.Submit the case.\n\nPlease follow the above steps to file a dispute for time stamps as ROC is no longer able to provide any time stamps. ',
        'LN_title': 'LN_template',
    };
    let suggestionBox = null;

    function createSuggestionBox(text) {
        if (!suggestionBox) {
            suggestionBox = document.createElement('div');
            suggestionBox.id = 'tnm-suggestion-box';
            suggestionBox.style.position = 'absolute';
            suggestionBox.style.padding = '10px';
            suggestionBox.style.backgroundColor = 'white';
            suggestionBox.style.border = '1px solid #ccc';
            suggestionBox.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
            suggestionBox.style.cursor = 'pointer';
            suggestionBox.style.zIndex = '1000';
            suggestionBox.innerText = `Click to copy the ln format:\n${text}`;

            suggestionBox.onclick = function() {
                const textareaElement = document.evaluate('/html/body/div[2]/div[2]/div/div/div[5]/div[2]/div[1]/div/div/div[1]/textarea', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                if (textareaElement) {
                    if (replacementTexts[text]) {
                        textareaElement.value = textareaElement.value.replace(new RegExp(text, 'g'), replacementTexts[text]);
                        console.log(`Replaced ${text} with replacement text:`, textareaElement.value);
                    } else {
                        console.warn(`Replacement text for ${text} not found`);
                    }
                } else {
                    console.error('Textarea element not found');
                }
            };

            document.body.appendChild(suggestionBox);
            console.log('Suggestion box created');
        }
    }

    function removeSuggestionBox() {
        if (suggestionBox) {
            suggestionBox.remove();
            suggestionBox = null;
            console.log('Suggestion box removed');
        }
    }

    function checkForKeywords() {
        const textareaElement = document.evaluate('/html/body/div[2]/div[2]/div/div/div[5]/div[2]/div[1]/div/div/div[1]/textarea', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        console.log('Checking textarea element:', textareaElement);

        if (textareaElement) {
            const text = textareaElement.value;
            if (text.includes('TNM')) {
                console.log("'TNM' detected in the textarea element");
                const rect = textareaElement.getBoundingClientRect();
                createSuggestionBox('TNM');
                suggestionBox.style.left = `${rect.left + window.scrollX}px`;
                suggestionBox.style.top = `${rect.bottom + window.scrollY}px`;
            } else if (text.includes('LT')) {
                console.log("'LT' detected in the textarea element");
                const rect = textareaElement.getBoundingClientRect();
                createSuggestionBox('LT');
                suggestionBox.style.left = `${rect.left + window.scrollX}px`;
                suggestionBox.style.top = `${rect.bottom + window.scrollY}px`;
            } else if (text.includes('NE<200mi')) {
                console.log("'NE<200mi' detected in the textarea element");
                const rect = textareaElement.getBoundingClientRect();
                createSuggestionBox('NE<200mi');
                suggestionBox.style.left = `${rect.left + window.scrollX}px`;
                suggestionBox.style.top = `${rect.bottom + window.scrollY}px`;
            } else if (text.includes('NE>200mi')) {
                console.log("'NE>200mi' detected in the textarea element");
                const rect = textareaElement.getBoundingClientRect();
                createSuggestionBox('NE>200mi');
                suggestionBox.style.left = `${rect.left + window.scrollX}px`;
                suggestionBox.style.top = `${rect.bottom + window.scrollY}px`;
            } else if (text.includes('LS')) {
                console.log("'LS' detected in the textarea element");
                const rect = textareaElement.getBoundingClientRect();
                createSuggestionBox('LS');
                suggestionBox.style.left = `${rect.left + window.scrollX}px`;
                suggestionBox.style.top = `${rect.bottom + window.scrollY}px`;
                } else if (text.includes('LNR_CF')) {
                console.log("'LNR_CF' detected in the textarea element");
                const rect = textareaElement.getBoundingClientRect();
                createSuggestionBox('LNR_CF');
                suggestionBox.style.left = `${rect.left + window.scrollX}px`;
                suggestionBox.style.top = `${rect.bottom + window.scrollY}px`;
            } else if (text.includes('LNR_NCF')) {
                console.log("'LNR_NCF' detected in the textarea element");
                const rect = textareaElement.getBoundingClientRect();
                createSuggestionBox('LNR_NCF');
                suggestionBox.style.left = `${rect.left + window.scrollX}px`;
                suggestionBox.style.top = `${rect.bottom + window.scrollY}px`;
            } else if (text.includes('Tour_adjust')) {
                console.log("'Tour_adjust' detected in the textarea element");
                const rect = textareaElement.getBoundingClientRect();
                createSuggestionBox('Tour_adjust');
                suggestionBox.style.left = `${rect.left + window.scrollX}px`;
                suggestionBox.style.top = `${rect.bottom + window.scrollY}px`;
            } else if (text.includes('RD_NCF')) {
                console.log("'RD_NCF' detected in the textarea element");
                const rect = textareaElement.getBoundingClientRect();
                createSuggestionBox('RD_NCF');
                suggestionBox.style.left = `${rect.left + window.scrollX}px`;
                suggestionBox.style.top = `${rect.bottom + window.scrollY}px`;
            } else if (text.includes('RD_CF')) {
                console.log("'RD_CF' detected in the textarea element");
                const rect = textareaElement.getBoundingClientRect();
                createSuggestionBox('RD_CF');
                suggestionBox.style.left = `${rect.left + window.scrollX}px`;
                suggestionBox.style.top = `${rect.bottom + window.scrollY}px`;
                } else if (text.includes('IM')) {
                console.log("'IM' detected in the textarea element");
                const rect = textareaElement.getBoundingClientRect();
                createSuggestionBox('IM');
                suggestionBox.style.left = `${rect.left + window.scrollX}px`;
                suggestionBox.style.top = `${rect.bottom + window.scrollY}px`;
            } else if (text.includes('EXT')) {
                console.log("'EXT' detected in the textarea element");
                const rect = textareaElement.getBoundingClientRect();
                createSuggestionBox('EXT');
                suggestionBox.style.left = `${rect.left + window.scrollX}px`;
                suggestionBox.style.top = `${rect.bottom + window.scrollY}px`;
            } else if (text.includes('Mech_trailer')) {
                console.log("'Mech_trailer' detected in the textarea element");
                const rect = textareaElement.getBoundingClientRect();
                createSuggestionBox('Mech_trailer');
                suggestionBox.style.left = `${rect.left + window.scrollX}px`;
                suggestionBox.style.top = `${rect.bottom + window.scrollY}px`;
            } else if (text.includes('App_issue')) {
                console.log("'App_issue' detected in the textarea element");
                const rect = textareaElement.getBoundingClientRect();
                createSuggestionBox('App_issue');
                suggestionBox.style.left = `${rect.left + window.scrollX}px`;
                suggestionBox.style.top = `${rect.bottom + window.scrollY}px`;
             } else if (text.includes('OTHR')) {
                console.log("'OTHR' detected in the textarea element");
                const rect = textareaElement.getBoundingClientRect();
                createSuggestionBox('OTHR');
                suggestionBox.style.left = `${rect.left + window.scrollX}px`;
                suggestionBox.style.top = `${rect.bottom + window.scrollY}px`;
              } else if (text.includes('GBS')) {
                console.log("'GBS' detected in the textarea element");
                const rect = textareaElement.getBoundingClientRect();
                createSuggestionBox('GBS');
                suggestionBox.style.left = `${rect.left + window.scrollX}px`;
                suggestionBox.style.top = `${rect.bottom + window.scrollY}px`;
            } else if (text.includes('LD')) {
                console.log("'LD' detected in the textarea element");
                const rect = textareaElement.getBoundingClientRect();
                createSuggestionBox('LD');
                suggestionBox.style.left = `${rect.left + window.scrollX}px`;
                suggestionBox.style.top = `${rect.bottom + window.scrollY}px`;
            } else if (text.includes('DNA')) {
                console.log("'DNA' detected in the textarea element");
                const rect = textareaElement.getBoundingClientRect();
                createSuggestionBox('DNA');
                suggestionBox.style.left = `${rect.left + window.scrollX}px`;
                suggestionBox.style.top = `${rect.bottom + window.scrollY}px`;
             } else if (text.includes('Time_stamp')) {
                console.log("'Time_stamp' detected in the textarea element");
                const rect = textareaElement.getBoundingClientRect();
                createSuggestionBox('Time_stamp');
                suggestionBox.style.left = `${rect.left + window.scrollX}px`;
                suggestionBox.style.top = `${rect.bottom + window.scrollY}px`;
            }
        } else {
            removeSuggestionBox();
        }
    }

    const observer = new MutationObserver(checkForKeywords);
    observer.observe(document.body, { childList: true, subtree: true });

    document.body.addEventListener('input', checkForKeywords);

    checkForKeywords();
    console.log('Initial check complete');
})();
