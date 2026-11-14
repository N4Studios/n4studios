
// ==========================================
// CONFIGURATION
// ==========================================

var spreadsheetId = "1sZeyaXnwqasXfjGwMd-zR2c3Oc04eYPf2KqUhfCD1T0";
var sheetId = "1802995533";

var KEY_COLUMN = "Key (n4-studios.com/c/?KEY)";
var VALUE_COLUMN = "Value (Text to Copy)";

// ==========================================
// URL KEY
// ==========================================

// Example: n4-studios.com/c/?Test

const cvalue = decodeURIComponent(
    window.location.search.substring(1)
);

// ==========================================
// VARIABLES
// ==========================================

var spreadsheetData = [];
var TEXT_TO_COPY = "";

const status = document.getElementById("status");
const copyTextElement = document.getElementById("copyText");
const copyButton = document.getElementById("copyButton");

// ==========================================
// CLIPBOARD FUNCTION
// ==========================================

async function copyText() {

    if (!TEXT_TO_COPY) {
        status.textContent = "Nothing to copy.";
        return false;
    }

    try {

        if (!navigator.clipboard || !window.isSecureContext) {
            throw new Error("Clipboard API unavailable");
        }

        await navigator.clipboard.writeText(TEXT_TO_COPY);

        status.textContent = "Copied to clipboard!";

        return true;

    } catch (error) {

        status.textContent =
            "Automatic copying was blocked. Select the button to copy.";

        return false;
    }
}

// ==========================================
// COPY BUTTON
// ==========================================

copyButton.addEventListener("click", copyText);

// ==========================================
// GOOGLE SHEETS CONNECTION
// ==========================================

var url =
    `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?tqx=out:json&gid=${sheetId}&headers=1`;

fetch(url)

    .then(response => {

        if (!response.ok) {
            throw new Error("HTTP Error: " + response.status);
        }

        return response.text();

    })

    .then(data => {

        // Extract JSON from Google's response

        var jsonStart = data.indexOf("{");
        var jsonEnd = data.lastIndexOf("}");

        var json = JSON.parse(
            data.substring(jsonStart, jsonEnd + 1)
        );

        if (json.status !== "ok") {
            throw new Error("Google Sheets returned an error");
        }

        // ==========================================
        // GET COLUMN HEADERS
        // ==========================================

        var headers = json.table.cols.map(col => col.label);

        // ==========================================
        // CONVERT ROWS INTO OBJECTS
        // ==========================================

        spreadsheetData = json.table.rows.map(row => {

            var obj = {};

            headers.forEach((header, index) => {

                obj[header] =
                    row.c[index]?.f ??
                    row.c[index]?.v ??
                    "";

            });

            return obj;

        });

        console.log("Spreadsheet loaded!");
        console.table(spreadsheetData);

        // ==========================================
        // FIND MATCHING KEY
        // ==========================================

        var match = spreadsheetData.find(row =>
            String(row[KEY_COLUMN]).trim().toLowerCase() ===
            cvalue.trim().toLowerCase()
        );

        // ==========================================
        // VALID KEY
        // ==========================================

        if (match) {

            TEXT_TO_COPY = String(match[VALUE_COLUMN] ?? "");

            copyTextElement.textContent = TEXT_TO_COPY;

            console.log("Valid key:", cvalue);
            console.log("Copy value:", TEXT_TO_COPY);

            // Automatically attempt to copy

            copyText();

        }

        // ==========================================
        // INVALID KEY
        // ==========================================

        else {

            TEXT_TO_COPY = "";

            copyTextElement.textContent = "Invalid or unknown key.";

            status.textContent = "Invalid key.";

            console.warn("Invalid key:", cvalue);

        }

    })

    // ==========================================
    // ERROR HANDLING
    // ==========================================

    .catch(error => {

        console.error("Spreadsheet error:", error);

        TEXT_TO_COPY = "";

        copyTextElement.textContent =
            "Unable to load spreadsheet data.";

        status.textContent =
            "Spreadsheet connection failed.";

    });
