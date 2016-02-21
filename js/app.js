$(document).ready(function() {
    $.getJSON('video/captions.txt', function(data) {         
        console.log(data);
        
        $('#text').html(data);
    });
    console.log("hey!");
}); 