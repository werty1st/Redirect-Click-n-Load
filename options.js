// Saves options to chrome.storage.sync.
function save_options() {
  var targethost = document.getElementById('targethost').value;
  chrome.storage.sync.set({
    targethost: targethost
  }, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Saved.';

    //reload background script
    chrome.extension.getBackgroundPage().window.location.reload();
    
    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  // Use default value color = 'red' and likesColor = true.
  chrome.storage.sync.get({
    targethost: '127.0.0.1'
  }, function(items) {
    document.getElementById('targethost').value = items.targethost;
  });
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);