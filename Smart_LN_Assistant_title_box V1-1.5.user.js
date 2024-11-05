// ==UserScript==
// @name         Smart_LN_Assistant_title_box V1
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Load notes Assistor Title box
// @author       mkeshaa
// @match        https://trans-logistics.amazon.com/fmc/execution/*
// @grant        GM_addStyle
// ==/UserScript==

(function () {
    'use strict';

    const popupHTML = `
        <div id="popup-box" class="closed">
            <div id="popup-header">
                <span id="popup-title">LN Assistor</span>
                <button id="close-btn">X</button>
            </div>
            <div id="popup-content">
                <ul>
                    <li><strong>TNM:</strong> Trailer Not Moving.</li>
                    <li><strong>LT:</strong> Late Truck.</li>
                    <li><strong>GBS:</strong> Gap between Stops.</li>
                    <li><strong>LD:</strong> Late Departure.</li>
                    <li><strong>DNA:</strong> Driver Not Assigned.</li>
                    <li><strong>NE<200mi:</strong> No empties <200 miles.</li>
                    <li><strong>NE>200mi:</strong> No empties >200 miles.</li>
                    <li><strong>LS:</strong> Load status.</li>
                    <li><strong>LNR_CF:</strong> Load not ready Customer facing.</li>
                    <li><strong>LNR_NCF:</strong> Load not ready Non-Customer facing.</li>
                    <li><strong>Tour_adjust:</strong> Tour adjust due to cancellation or other.</li>
                    <li><strong>RD_NCF:</strong> Report Delay for NCF/Empty.</li>
                    <li><strong>RD_CF:</strong> Report Delay for CF.</li>
                    <li><strong>IM:</strong> Pickup/Waybill number from IM team.</li>
                    <li><strong>EXT:</strong> External loads.</li>
                    <li><strong>Mech_trailer:</strong> Mech trailer issue reported in transit.</li>
                    <li><strong>App_issue:</strong> Relay application issues.</li>
                    <li><strong>OTHR:</strong> General Load notes.</li>
                    <li><strong>Time_stamp:</strong> Time stamp related issue.</li>
                </ul>
            </div>
        </div>`;

    document.body.insertAdjacentHTML('beforeend', popupHTML);

    GM_addStyle(`
        #popup-box {
            position: fixed;
            bottom: 10px;
            right: 10px;
            width: 320px;
            border-radius: 8px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
            overflow: hidden;
            transition: all 0.3s ease-in-out;
            z-index: 9999;
        }

        #popup-header {
            background-color: #0066C0;
            color: #fff;
            padding: 10px 15px;
            font-family: "Amazon Ember", Arial, sans-serif;
            font-size: 14px;
            font-weight: bold;
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: pointer;
        }

        #popup-content {
            background-color: #fff;
            padding: 15px;
            font-size: 12px;
            font-family: "Amazon Ember", Arial, sans-serif;
            color: #0f1111;
            max-height: 300px;
            overflow-y: auto;
        }

        #popup-box.closed {
            width: 200px;
            height: 40px;
            animation: blink 1s infinite; /* Add blinking effect */
        }

        #popup-box.closed #popup-content,
        #popup-box.closed #close-btn {
            display: none;
        }

        #popup-title {
            margin: 0;
        }

        #close-btn {
            background-color: transparent;
            border: none;
            color: #fff;
            font-size: 18px;
            cursor: pointer;
        }

        ul {
            list-style-type: disc;
            padding-left: 20px;
        }

        li {
            margin-bottom: 8px;
        }

        #popup-box.open {
            width: 320px;
            height: auto;
            animation: none; /* Stop animation when open */
        }

        @keyframes blink {
            0%, 100% {
                background-color: #0066C0;
            }
            50% {
                background-color: #cde9f6; /* Lighter color during blink */
            }
        }
    `);

    const popupBox = document.getElementById('popup-box');
    const closeBtn = document.getElementById('close-btn');

    popupBox.addEventListener('click', function () {
        if (popupBox.classList.contains('closed')) {
            popupBox.classList.remove('closed');
            popupBox.classList.add('open');
        }
    });

    closeBtn.addEventListener('click', function (e) {
        e.stopPropagation();  // Prevents the click from toggling the popup
        popupBox.classList.add('closed');
        popupBox.classList.remove('open');
    });
})();
