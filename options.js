// zip -1 -x "*screens*" -x "*/\.*" x ".*"  -x "*.zip" -r addon.zip .



// Saves options to chrome.storage.sync.
function save_options() {

  chrome.storage.sync.set({ settings:
    {
      targethost:   document.getElementById('targethost').value,
      targetport:   document.getElementById('targetport').value,
      targetproto:  document.getElementById('targetproto').value,
      targetuser:   document.getElementById('targetuser').value,
      targetpasswd: document.getElementById('targetpasswd').value
    }
  }, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = ' Saved.';

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
  chrome.storage.sync.get({ settings: 
    {
      targethost: '127.0.0.1',
      targetport: '9666',
      targetproto: 'http',
      targetuser: "",
      targetpasswd: ""

    }
  }, function(storage) {
    console.log(storage.settings)
    document.getElementById('targethost').value = storage.settings.targethost;
    document.getElementById('targetport').value = parseInt(storage.settings.targetport);
    document.getElementById('targetproto').value = storage.settings.targetproto;
    document.getElementById('targetuser').value = storage.settings.targetuser;
    document.getElementById('targetpasswd').value = storage.settings.targetpasswd;
  });
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);