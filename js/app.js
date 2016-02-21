$(document).ready(function() {
    var JSONcaptions = $.getJSON('video/captions.txt').responseText; 
    console.log(JSONcaptions);
}); 