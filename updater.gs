/** @OnlyCurrentDoc */

function UpdateAll() {
	UpdateSheet(50285,"JIRA-TestMap-7.4");
	UpdateSheet(50286, "JIRA-Verified-BUGS-7.4");
	UpdateSheet(51111, "JIRA-Closed-BUGS-7.4");
	UpdateSheet(51115, "JIRA-BUGS-Caught-By-Automation");
}

function UpdateSheet(filterID, sheetName) {
	var jirauser = "your.name";


	var ui = SpreadsheetApp.getUi();
	var jiraauth = ui.prompt("Please enter your Jira password");


	var parameters = {
		method: "GET",
		accept: "application/json",
		headers: {
			"Authorization": "Basic " + Utilities.base64Encode(
							 jirauser + ":" + jiraauth)
		}
	};


	var counter_jira_url = "http://issues.liferay.com/rest/api/2/search?jql=filter=" +
						   filterID + "&maxResults=0";
	var response = JSON.parse(
		UrlFetchApp.fetch(counter_jira_url, parameters).getContentText());
	//var data = JSON.parse(response.getContentText());
	var resultCount = response["total"];

	var final_jira_url = "http://issues.liferay.com/rest/api/2/search?jql=filter=" +
						 filterID +
						 "&fields=id,key,summary,type,status,labels,components,customfield_12523&maxResults=" +
						 resultCount;
	var text = UrlFetchApp.fetch(final_jira_url, parameters).getContentText();

	var ss = SpreadsheetApp.getActiveSpreadsheet();
	var mainSheet = ss.getSheetByName(sheetName); // Sheet name used here

	mainSheet.getRange('A:O').clear();

	var data = JSON.parse(text);

	var dataSet = data.issues;

	var rows = [],
		data;
	for (i = 0; i < dataSet.length; i++) {
		data = dataSet[i];
		subdata = dataSet[0];
		// Write labels human readable
		labels = "";
		data.fields.labels.forEach(function (item) {
			labels += item + ",";
		});

		// Write Components human readable
		components = "";
		data.fields.components.forEach(function (item) {
		});

    rows.push([
				"=HYPERLINK\(\"https\:\/\/issues.liferay.com\/browse\/" +
				data.key + "\", \"" + data.key + "\"\)", data.fields.summary,
				data.fields.type, data.fields.status["statusCategory"]["name"],
				labels, data.fields.components[0]["name"],
				data.fields.customfield_12523 ? data.fields.customfield_12523["value"] : ""]); //your JSON entities here
			mainSheet.getRange(2, 2, rows.length, 7).setValues(rows);

	}
	//mainSheet.getRange(2, 1, rows.length, 6).setValues( row = ["Key","Title","Status","Labels","Components"]);

}