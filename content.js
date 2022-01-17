function startExport() {
    chrome.runtime.sendMessage({}, (response) => {
        if (response.error === true || !response.body || !response.body.requestBody) {
            alert('Something went wrong; please reload the page and try again');
            return;
        }
        fetch(response.body.url, {
            method: 'POST',
            body: new URLSearchParams(response.body.requestBody.formData),
        }).then(r => {
            return r.json();
        }).then(r => {
            let result = '';
            const data = r.actions[0].returnValue.factMap['T!T'].rows;
            data.forEach(row => {
                const rowResult = row.dataCells.map(column => {
                    if (column.value && column.value.currency) {
                        return `"${column.value.amount}"`;
                    } else {
                        return `"${column.label}"`;
                    }
                }).join(',');
                result = `${result}${rowResult}\n`;
            })
            console.log(result);
            download(result);
        });
    });
}

function download(data) {
    const href = `data:text/csv,${encodeURIComponent(data)}`
    let link = document.createElement('a');
    link.setAttribute('id', 'salesforce-export-download');
    link.style.display = 'none';
    link.setAttribute('href', href);
    link.setAttribute('download', 'data.csv');
    document.body.appendChild(link);
    document.getElementById('salesforce-export-download').click();
    document.getElementById('salesforce-export-download').remove();
}

function setButton() {
    if (document.querySelectorAll('div.action-bars').length < 1) {
        if (window._salesforce_export.timeout < 10) {
            window._salesforce_export.timeout++;
            setTimeout(setButton, 1000);
        }
        return;
    }
    document.querySelector('div.action-bars').insertAdjacentHTML('afterbegin', `
        <div class="slds-m-left--xx-small"><div class="slds-button-group actionBarButtonGroup" role="group"><div class="slds-tooltip-trigger" style="display: inline-block; line-height: 1;">
            <button id="salesforce-export" class="slds-button slds-button_icon-border action-bar-action-refreshReport reportAction report-action-refreshReport" type="button">
                💾
                <span class="slds-assistive-text">Download</span>
            </button>
        <span></span></div></div></div>
    `);
    document.getElementById('salesforce-export').addEventListener('click', startExport);
}

window._salesforce_export = {
    timeout: 0,
}
setButton()
