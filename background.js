tellContentScriptToReload = (tab) => {
    var { tabId } = tab;

    chrome.scripting.executeScript({
        target: { tabId },
        files: ["scanner.js"]
    })
        .then(() => {
            console.log("injected a function")
        });

}

chrome.webRequest.onCompleted.addListener(
    tellContentScriptToReload,
    { urls: ["https://blur.io/*"] }
)