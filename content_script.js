chrome.runtime.sendMessage({type: 'rested.page_action.enable'})



runRequest = function(payload, callback) {
  payload = $.extend(payload, {type: 'rested.request.run'})

  chrome.runtime.sendMessage(payload, callback)
}

sendResponseToPage = function(response) {
  window.postMessage({type: 'request.execution.completed', response: response}, "*")
}



//window.postMessage("trigger_test_msg", "*")

// window.dispatchEvent(new CustomEvent("trigger_test_msg"))
window.addEventListener("trigger_test_msg", function(event) {
  console.log("content script triggered")

  if(event.source != window)
    return;

  if(!event.data.type)
    return;

  if(event.data.type == 'rested.local_requests_possible.query') {
    window.postMessage({type: 'rested.local_requests_possible.response', response: true}, '*')
  } else if(event.data.type == "request.execution.start") {
    runRequest(event.data.request, sendResponseToPage)
  }
}, false);

console.log("content script loaded")