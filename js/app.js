




function parseCaptionText(text) {
    var captions = [];
    $.each(text.split("\n"), function(index, value) {
        if ((value.length === 1) && !(isNaN(value)) {
            console.log(value);
        }
    })
}


$.get('video/captions.vtt', function(data) {
   parseCaptionText(data);
});


// $(document).ready(function() {
//     // var response = $.getJSON('video/captions.txt'); 
//     // var JSONcaptions = response.responseText;
//     // // console.log(response, JSONcaptions);
//     // parseCaptionText(caption_text);
// }); 