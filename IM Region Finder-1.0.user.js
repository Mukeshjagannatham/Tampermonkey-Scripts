// ==UserScript==
// @name         IM Region Finder
// @version      1.0
// @description  IM region and Email generator
// @author       mkeshaa@
// @match        https://trans-logistics.amazon.com/fmc/execution/*
// ==/UserScript==
(function() {
    'use strict';

    const mappings = [
        { keys: ["XMS1", "CLE2", "CLE3", "CMH1", "CMH4", "FOE1", "IGQ1", "IGQ2", "IND1", "IND9", "FWA4", "MDW2", "MDW4", "MDW6", "MDW7", "MKC6", "MKE1", "MKE2", "MKE6", "MQJ1", "ORD2", "ORD5", "ORD6", "ORD9", "SDF6", "SDF8", "SDF9", "STL8", "XMD1", "YIL1", "IND8", "STL4", "PCW1", "AKC1", "IND5", "DET3", "DTW1", "GRR1", "XCM1", "CVG2", "IND4", "POH2", "CVG9", "MKE5", "DSM5", "MKC4", "LEX2", "MCI7", "IND2", "DTW3", "EVEO", "MDW5", "LEX1", "HIL3", "MSP1", "ORD4", "CMH3", "CMH6", "XMD2", "XIN1", "XMC1", "MSP6", "MCI3", "DET6", "RFD4", "MDW8", "FWA6", "MQJ2", "MDW9", "JVL1", "ICT2", "XCE1", "RFD7", "BLV2", "CMH2", "LUK2", "OMA2", "SDF1", "DET2", "DTW8", "DTW9", "STL6", "STP2", "STL9", "KRB6", "FAR1", "FSD1", "HMW4", "LUK7", "QXX6", "MLI1", "RFD2", "PIT4", "CMH7", "HMW3", "LAN2", "BNSF Chicago", "BNSF Corwith", "BNSF Cicero", "BNSF Willow", "BNSF Logistics Park KS", "BNSF St Louis", "BNSF St Paul", "CSXT Columbus", "CSXT Cleveland", "CSXT Bedford Park", "NSRR Calumet", "NSRR Columbus", "NSRR Landers",], email: "Midwest  - im-azim-support-mw@amazon.com" },
        { keys: ["ABE4", "ABE2", "ABE8", "ACY1", "ACY9", "AVP1", "AVP8", "BOS7", "BDL2", "BDL3", "BWI2", "DCA1", "DCA6", "EWR4", "EWR5", "EWR9", "HNE1", "JFK8", "LDJ5", "LGA5", "LGA7", "LGA9", "MTN1", "PHL4", "PHL7", "PNE5", "RDG1", "TEN1", "TEB6", "TEB3", "TEB9", "XNJ2", "BWI4", "ILG1", "MDT1", "RIC2", "PHL5", "HGR2", "AVP3", "KRB2", "EWR8", "RIC1", "ACY8", "ORF2", "BDL1", "MCO6", "HMD3", "CDW5", "AVP9", "SYR1", "PHL9", "BDL6", "ORF3", "PIT2", "XLX1", "TTN2", "SWF1", "BWI1", "BDL4", "ACY2", "ALB1", "RIC9", "TEB4", "MMU9", "MDT8", "EWR7", "RIC3", "XPH8", "MTN7", "MTN3", "SWF2", "PHL6", "XPH3", "XJF1", "HEA2", "BUF9", "BOS3", "MDT4", "XPH4", "BDL5", "CHO1", "HDC3", "HGR5", "MDT9", "RIC4", "ROC1", "RMN3", "ACY5", "ABE3", "MDT2", "BOS5", "WBW2", "LBE1", "HIA1", "XPH1", "HGR6", "NSRR Norfolk", "CSX Syracuse", "CSXT North Kearny", "CSXT Baltimore", "CSXT Springfield", "CSXT Chambersburg", "CSXT Philadelphia", "CSXT North Bergen",], email: "North East - im-azim-support-ne@amazon.com" },
        { keys: ["ATL2", "ATL7", "AGS2", "CLT2", "CLT4", "JAX2", "JAX3", "JAX7", "MCO1", "MCO2", "MEM1", "MEM4", "MEM5", "TPA1", "TPA2", "TPA3", "XEW2", "BNA3", "CAE1", "TPA4", "MEM6", "CSG1", "MIA1", "MQY1", "XAT2", "RDU1", "CLT3", "AGS1", "BHM1", "CHA1", "SAV3", "CLT9", "MEM8", "XHH3", "MCO9", "TPA6", "XHH2", "MGE7", "GSP1", "CHA2", "LAL4", "LFT1", "MIA5", "HGA6", "TPAY", "CLT6", "BNA2", "MGE1", "GSO1", "PGA1", "BNA5", "ATL8", "ATL6", "MEM3", "PBI2", "DTN8", "XLX6", "MOB5", "XCL1", "SAV7", "XME1", "STL3", "XGA1", "HSV2", "MIA2", "SAV4", "AGS3", "HSV1", "XAT3", "MIA7", "AKR1", "CRG1", "PDK2", "MGE3", "XRD4", "XFL2", "TLH2", "RDU2", "MCO5", "TYS1", "BNA6", "RDU4", "XCH2", "PBI3", "TMB8", "XMI3", "CSXT Central Florida", "CSXT Jacksonville", "NSRR Charlotte", "CSXT Fairburn", "BNSF Fairburn", "BNSF Memphis", "CSXT Tampa",], email: "South East - im-azim-support-se@amazon.com" },
        { keys: ["BFI3", "BFI4", "DEN4", "SCK4", "FAT1", "GYR1", "GYR2", "GYR3", "OAK4", "OLM1", "PHX3", "PHX6", "SMF1", "SMF7", "SMF3", "TUS1", "TUS2", "XBF2", "SJC7", "SMF6", "PDX9", "RNT9", "SCK1", "ABQ1", "PHX7", "SCK3", "BFI7", "GEG2", "OAK3", "GEG1", "DEN3", "SCK6", "PDX6", "QXY8", "EUG5", "JHW1", "RNO4", "MCE1", "XTC1", "KRB9", "DEN2", "DEN7", "PHX5", "ONT1", "QXY9", "SLA6", "BUR7", "XLX2", "SDM4", "XLX3", "KRB4", "ABS4", "XBF3", "XLA4", "XLG1", "PSC2", "PDX7", "DEN8", "BDU5", "AZA5", "AZA9", "DPX7", "XPD1", "BFI9", "DWS4", "HLA6", "TCY5", "KENT", "XSE2", "PAE2", "SCK8", "AUN2", "HIO9", "LAS1", "LAS2", "LAS7", "LAX9", "LGB3", "LGB7", "LGB8", "ONT2", "ONT5", "ONT6", "ONT8", "PSP1", "SBD1", "SBD3", "XLA3", "BFL1", "LGB6", "OXR1", "SAN3", "VGT1", "SNA4", "FAT2", "LAS6", "ONT9", "LGB9", "VGT2", "BFL2", "XCA2", "XLX7", "SBD2", "LGB4", "XLA1", "KRB1", "CNO5", "DLX5", "DUR1", "KSBD", "LGB5", "MIT2", "BNSF Denver", "BNSF Los Angeles", "BNSF San Bernardino", "BNSF Stockton", "BNSF South Seattle", "BNSF Portland", "BNSF Phoenix",], email: "South West - im-azim-support-sw@amazon.com" },
        { keys: ["DAL2", "DAL3", "DAL9", "DFW7", "FTW1", "FTW2", "FTW4", "FTW6", "FTW8", "SAT2", "IAH1", "CONGLOBAL", "AFW1", "DFW6", "XDA1", "FTW5", "AFW5", "OKC1", "LIT1", "DFW8", "DFW9", "FTW3", "SAT1", "TUL2", "AUS2", "HOU6", "HOU2", "ELP1", "AUS3", "HOU1", "OKC2", "HOU8", "TUL5", "HOU3", "AUS5", "HOU5", "SAT6", "FTW9", "XDA2", "LIT2", "SAT4", "HOU7", "SAT3", "SAT7", "ABS2", "IAH3", "HOU9", "DPA7", "XTX1", "XCH1", "BNSF Alliance", "BNSF Houston",], email: "Texas - im-azim-support-tx@amazon.com" }
    ];

    function normalizeText(text) {
        return text.toLowerCase().replace(/[-_]/g, ' ').trim();
    }

    function getElementByXpath(xpath) {
        return document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    }

    function showPopup(email, referenceElement) {
        let popup = document.createElement("div");
        popup.style.position = "absolute";
        popup.style.backgroundColor = "#ffffff";
        popup.style.color = "#343636";
        popup.style.border = "1px solid #0f1111";
        popup.style.padding = "10px";
        popup.style.borderRadius = "5px";
        popup.style.zIndex = "10000";
        popup.style.fontFamily = "Amazon Ember, Arial, sans-serif";
        popup.style.fontSize = "12px";
        popup.style.display = "flex";
        popup.style.alignItems = "center";
        popup.style.gap = "10px";

        let emailText = document.createElement("span");
        emailText.innerText = email;

        let copyButton = document.createElement("button");
        copyButton.innerText = "Copy";
        copyButton.style.padding = "5px 10px";
        copyButton.style.border = "none";
        copyButton.style.background = "#0f1111";
        copyButton.style.color = "#ffffff";
        copyButton.style.cursor = "pointer";
        copyButton.style.borderRadius = "3px";
        copyButton.onclick = function() {
            navigator.clipboard.writeText(email).then(() => {
                copyButton.innerText = "Copied!";
                setTimeout(() => { copyButton.innerText = "Copy"; }, 2000);
            });
        };

        popup.appendChild(emailText);
        popup.appendChild(copyButton);
        document.body.appendChild(popup);

        let rect = referenceElement.getBoundingClientRect();
        popup.style.top = `${rect.bottom + window.scrollY + 5}px`;
        popup.style.left = `${rect.left + window.scrollX}px`;

        setTimeout(() => { popup.remove(); }, 5000);
    }

    function checkValue() {
        let xpathValue = getElementByXpath("/html/body/div[2]/div[2]/div/div/div[2]/div/div[3]/div/div/div[3]/div/div[2]/div[3]/div/div[2]/table/tbody/tr[2]/td/div/div[1]/table/tbody/tr[4]/td[1]/table/tbody/tr/td[1]/span");

        if (xpathValue) {
            let text = xpathValue.innerText.trim();
            let normalizedText = normalizeText(text);

            for (let group of mappings) {
                for (let key of group.keys) {
                    let normalizedKey = normalizeText(key);
                    if (normalizedText === normalizedKey) {
                        showPopup(group.email, xpathValue);
                        return; // Exit loop once a match is found
                    }
                }
            }
        }
    }

    setInterval(checkValue, 2000); // Run every 2 seconds
})();
