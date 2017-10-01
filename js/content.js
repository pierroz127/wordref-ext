function getSelectedText() {
    var text = "";
    if (window.getSelection) {
        text = window.getSelection().toString();
    } else if (document.selection && document.selection.type != "Control") {
        text = document.selection.createRange().text;
    }
    return text;
}

// Listen for messages from the popup
chrome.runtime.onMessage.addListener(function (msg, sender, response) {
    if ((msg.from === 'popup') && (msg.subject === 'translateSelection')) {
        console.log('message received from popup');
        response(getSelectedText());
    }
});