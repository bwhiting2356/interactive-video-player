function parseCaptionText(text) {
    console.log(text.split());
}


$.get('video/captions.txt', function(data) {
   parseCaptionText(data);
});


// $(document).ready(function() {
//     // var response = $.getJSON('video/captions.txt'); 
//     // var JSONcaptions = response.responseText;
//     // // console.log(response, JSONcaptions);
//     // parseCaptionText(caption_text);
// }); 