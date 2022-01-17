let logged = {}
chrome.webRequest.onBeforeRequest.addListener(
    (details) => {
        if (details.requestBody === undefined) {
            return;
        }
        if (details.url.indexOf('ui-analytics-reporting-runpage.ReportPage.runReport') > -1) {
            logged[details.tabId] = details;
        }
    },
    {
        urls: ['https://skywater.lightning.force.com/aura*']
    },
    [
        'requestBody'
    ],
);

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        sendResponse({body: logged[sender.tab.id] ? logged[sender.tab.id] : {error: true}})
    }
);
