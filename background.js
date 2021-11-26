/**
 * default host value
 */
var host = "http://127.0.0.1:9666";
var pause = false;
var basicAuthHeader = false;
var proto = "http";

/**
 * filter settings url
 */
 var filter = {
    urls: [
        "*://127.0.0.1/*",
        "*://localhost/*"        
    ],
    types: ["main_frame", "sub_frame", "script", "object", "xmlhttprequest"]
}


/**
 * load settings from chrome
 */
chrome.storage.sync.get({ settings: 
{
    targethost: "127.0.0.1",
    targetport: "9666",
    targetproto: "http",
    pause: false,
    targetuser: "",
    targetpasswd: ""
} 
}, function(storage) {
    host = storage.settings.targetproto + "://" + storage.settings.targethost + ":" + storage.settings.targetport;
    pause = storage.settings.pause;
    filter.urls.push("*://" + storage.settings.targethost + "/*");
    proto = storage.settings.targetproto

    //build auth header
    if (storage.settings.targetuser.length && storage.settings.targetpasswd.length > 0 ){
        basicAuthHeader = {
            name: "Authorization",
            value: "Basic " + btoa( storage.settings.targetuser + ":" +  storage.settings.targetpasswd )        
        }
    }

    if (!pause)install_listener();
});


/**
 * Check URL for port 9666 and replace host
 * otherwise return original url
 * @param {*} details 
 */
function checkurl(details){
    if ( details.url.match(/^[\S]*:9666\//)  && !pause) {
        return { redirectUrl: host + details.url.match(/^([\S]*:9666)([\S]*)/)[2] };
    }
}


/**
 * Add Basic Auth Header if request is made via https
 * @param {*} details 
 */
 function checkHeader(details){
    
    //if proto==https and authentication is set
    //add basic auth
    if (proto=="https" && basicAuthHeader) {
        const headers = details.requestHeaders;
        headers.push(basicAuthHeader);
        return {
            requestHeaders: headers
        }
    }
}




/**
 * install onBeforeRequestListener after settings are loaded
 */
function install_listener(){
    chrome.webRequest.onBeforeRequest.addListener( checkurl, filter, ["blocking"]);
    chrome.webRequest.onBeforeSendHeaders.addListener( checkHeader, filter, [ "blocking", "requestHeaders"]);
}

/**
 * if paused remove onBeforeRequestListener
 */
 function remove_listener(){
    chrome.webRequest.onBeforeRequest.removeListener( checkurl );
    chrome.webRequest.onBeforeSendHeaders.removeListener( checkHeader );
}


/**
 * save pause state
 * @param {boolean} pause must be set to true or false 
 */
// Saves options to chrome.storage.sync.
function save_options(pause, callback) {
  chrome.storage.sync.set({
    pause: pause
  }, function() {
    // Update icon status
    callback();
  });
}


/**
 * set extension icon to pause state
 */
function disableBrowserAction(){
    chrome.browserAction.setIcon({path:"images/icon_status_pause.png"});
    remove_listener();
}
/**
 * set extension icon to normal state
 */
function enableBrowserAction(){
    chrome.browserAction.setIcon({path:"images/icon_status.png"});
    install_listener();
}

/**
 * on click handler for extension icon
 * switch state, store and update icon
 */
function updateState( ){
    
        if(pause == false){
            pause = true;
            save_options(pause,function(){
                disableBrowserAction();
            });
        }else{
            pause = false;
            save_options(pause,function(){
                enableBrowserAction();
            });   
        }
}

/**
 * register extension icon on click handler
 */
chrome.browserAction.onClicked.addListener(updateState);