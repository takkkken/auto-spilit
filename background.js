chrome.browserAction.onClicked.addListener(tab => {
    chrome.tabs.sendMessage(tab.id, { action: 'fire'});
});


chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {

        //get
        if (request.status == "save_options"){
            window.localStorage.setItem("options",JSON.stringify(request));

        }else if (request.status == "load_options"){
            sendResponse({val: window.localStorage.getItem("options")});

        }


    }
);
