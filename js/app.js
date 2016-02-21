$(document).ready(function() {
    var response = $.getJSON('video/captions.txt'); 
    var JSONcaptions = response.responseText;
    console.log(response, JSONcaptions);
}); 