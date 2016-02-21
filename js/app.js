$(document).ready(function() {
    $.getJSON('video/captions.txt', function(data) {         
        console.log(data);
        console.log("hey!");
        $('#text').html(data);
    });
}); 