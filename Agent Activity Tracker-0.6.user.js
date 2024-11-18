// ==UserScript==
// @name         Agent Activity Tracker
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  Highlight agents with High Avil time, show a movable popup with the count and highest duration, download the info as Excel,
// @author       mkeshaa
// @match        https://c2-na-prod.awsapps.com/connect/*
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.16.9/xlsx.full.min.js
// ==/UserScript==

(function() {
    'use strict';

    function durationToSeconds(duration) {
        let parts = duration.split(':');
        return (+parts[0]) * 3600 + (+parts[1]) * 60 + (+parts[2]);
    }

    function formatDuration(seconds) {
        let hours = Math.floor(seconds / 3600);
        let minutes = Math.floor((seconds % 3600) / 60);
        let secs = seconds % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    function downloadExcel(activityData) {
        let wb = XLSX.utils.book_new();
        for (let activity in activityData) {
            let ws_data = [['Agent Login', 'Activity', 'Duration']];
            activityData[activity].forEach(agent => {
                ws_data.push([agent.login, agent.activity, agent.duration]);
            });
            let ws = XLSX.utils.aoa_to_sheet(ws_data);
            XLSX.utils.book_append_sheet(wb, ws, activity);
        }
        XLSX.writeFile(wb, 'Agent_Activities.xlsx');
    }

    function highlightAgentsAndShowCount() {
        document.querySelectorAll('.highlighted-agent').forEach(row => {
            row.style.backgroundColor = '';
            row.classList.remove('highlighted-agent');
        });
        let existingPopup = document.getElementById('agent-count-popup');
        if (existingPopup) {
            existingPopup.remove();
        }

        let rows = document.querySelectorAll('table tbody tr');
        let activityCount = {};
        let highestDuration = {};
        let activityData = {};

        rows.forEach(row => {
            let cells = row.querySelectorAll('td');
            let login = cells[0].innerText.trim();
            let activity = cells[2].innerText.trim();
            let duration = cells[4].innerText.trim();
            let durationInSeconds = durationToSeconds(duration);

            if (!activityCount[activity]) {
                activityCount[activity] = 0;
                highestDuration[activity] = 0;
                activityData[activity] = [];
            }
            activityCount[activity]++;
            if (durationInSeconds > highestDuration[activity]) {
                highestDuration[activity] = durationInSeconds;
            }

            if (activity === 'Available' && durationInSeconds >= 300) {
                row.style.backgroundColor = '#cde9f6'; // Highlight the row
                row.classList.add('highlighted-agent');
                activityData[activity].push({ login, activity, duration });
            } else if (activity !== 'Available') {
                activityData[activity].push({ login, activity, duration });
            }
        });

        let popup = document.createElement('div');
        popup.id = 'agent-count-popup';
        popup.style.position = 'fixed';
        popup.style.top = '2cm';  // Set 5 cm from the top
        popup.style.left = '10px';  // Set 10px from the right
        popup.style.left = '2cm';  // Set 5 cm from the top
        popup.style.padding = '15px';
        popup.style.backgroundColor = '#e3f2fd'; // Light blue background
        popup.style.color = 'black'; // Black text
        popup.style.fontFamily = 'var(--picasa-font-family-amazon-ember-regular-name)';
        popup.style.fontSize = '16px';
        popup.style.zIndex = 1000;
        popup.style.borderRadius = '10px';
        popup.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
        popup.style.cursor = 'move';

        let popupContent = '';
        for (let activity in activityCount) {
            popupContent += `<div>${activity}: ${activityCount[activity]} (Highest Duration: ${formatDuration(highestDuration[activity])})</div>`;
        }

        popup.innerHTML = popupContent.trim();

        let downloadButton = document.createElement('button');
        downloadButton.innerText = 'Download Excel';
        downloadButton.style.marginTop = '10px';
        downloadButton.style.padding = '10px';
        downloadButton.style.backgroundColor = '#4CAF50';
        downloadButton.style.color = 'white';
        downloadButton.style.border = 'none';
        downloadButton.style.borderRadius = '5px';
        downloadButton.style.cursor = 'pointer';
        downloadButton.style.fontSize = '14px';
        downloadButton.style.transition = 'background-color 0.3s';

        downloadButton.addEventListener('mouseover', function() {
            this.style.backgroundColor = '#45a049';
        });
        downloadButton.addEventListener('mouseout', function() {
            this.style.backgroundColor = '#4CAF50';
        });

        downloadButton.addEventListener('click', () => downloadExcel(activityData));
        popup.appendChild(downloadButton);

        document.body.appendChild(popup);

        let isDragging = false;
        let offsetX, offsetY;

        popup.addEventListener('mousedown', function(e) {
            isDragging = true;
            offsetX = e.clientX - popup.getBoundingClientRect().left;
            offsetY = e.clientY - popup.getBoundingClientRect().top;
            popup.style.cursor = 'grabbing';
        });

        document.addEventListener('mousemove', function(e) {
            if (isDragging) {
                popup.style.left = `${e.clientX - offsetX}px`;
                popup.style.top = `${e.clientY - offsetY}px`;
            }
        });

        document.addEventListener('mouseup', function() {
            isDragging = false;
            popup.style.cursor = 'move';
        });
    }

    highlightAgentsAndShowCount();

    setInterval(highlightAgentsAndShowCount, 5000);
})();
