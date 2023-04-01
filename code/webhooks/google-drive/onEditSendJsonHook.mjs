/**
 * To create a Google Apps Script that sends the entire row as a JSON object when a cell is edited in Google Sheets, follow these steps:
 *
 * 1. Open your Google Sheet.
 * 2. Click on "Extensions" > "Apps Script" to open the Google Apps Script editor.
 * 2. Remove any existing code and paste the following code into the "Code.gs" file:
 * 4. Replace https://your-webhook-url-or-api-endpoint-here with the URL of your webhook or API endpoint where you want to send the JSON object.
 * 5. Click on "Save" to save the script.
 * 6. To authorize and set up the trigger, click on the clock icon (Triggers) in the left sidebar.
 * 7. Click on "+ Add Trigger" in the bottom right corner.
 * 8. Set the following options for the trigger:
 *     * Choose which function to run: google-drive
 *     * Select event source: From spreadsheet
 *     * Select event type: On edit
 *     * Click on "Save" to create the trigger.
 * 9. Now, whenever you edit a cell in your Google Sheet, the google-drive function will be triggered, and the entire row containing the edited cell will be sent as a JSON object to the specified webhook or API endpoint.
 */

function onEdit(e) {
    // Get the active sheet.
    var sheet = e.source.getActiveSheet();

    // Get the edited range.
    var range = e.range;

    // Get the row number and column number of the edited cell.
    var rowNum = range.getRow();
    var colNum = range.getColumn();

    // Get the entire row data as an array.
    var rowData = sheet.getRange(rowNum, 1, 1, sheet.getLastColumn()).getValues()[0];

    // Convert the row data to a JSON object.
    var jsonObject = rowArrayToJson(rowData, sheet);

    // Send the JSON object to the desired endpoint.
    sendJsonData(jsonObject);
}

function rowArrayToJson(rowData, sheet) {
    var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    var jsonObject = {};

    for (var i = 0; i < headers.length; i++) {
        jsonObject[headers[i]] = rowData[i];
    }

    return jsonObject;
}

function sendJsonData(jsonObject) {
    var url = "https://webhook.site/47101fb1-93ac-4fdb-bf97-8a314baf03b9";
    var options = {
        "method": "post",
        "contentType": "application/json",
        "payload": JSON.stringify(jsonObject)
    };

    try {
        UrlFetchApp.fetch(url, options);
    } catch (error) {
        console.error("Error sending JSON data:", error);
    }
}
