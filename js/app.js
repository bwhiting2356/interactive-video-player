var caption_html = "\
<p class='caption'>\
{caption}\
</p>\
"


function parseCaptionText(text) {
    var captions = [];
    var raw_data = text.split("\n");
    $.each(raw_data, function(i, value) {
        if ((value.length === 1) && (!isNaN(value))) {
            var caption_object = {
                index: value,
                timecode: raw_data[i + 1],
                caption_text: "",
            };
            var next = i + 2;
            while (raw_data[next] !== "") {
                caption_object.caption_text += raw_data[next] + " ";
                next++;
                console.log(caption_object.caption_text);
            }
            captions.push(caption_object);
        }
    });
    var div_text = "";
    $.each(captions, function(i, value) {
        div_text += caption_html.replace("{caption}", value.caption_text);
    });
    $('#text').html(div_text);
    console.log(div_text);
    console.log(captions);
}


$.get('video/captions.vtt', function(data) {
   parseCaptionText(data);
});

$('video').mediaelementplayer({
    success: function(player, node) {
        $('#' + node.id + '-mode').html('mode: ' + player.pluginType);
    },
    startLanguage: 'en',
    translationSelector: true
});


// $(document).ready(function() {
//     // var response = $.getJSON('video/captions.txt'); 
//     // var JSONcaptions = response.responseText;
//     // // console.log(response, JSONcaptions);
//     // parseCaptionText(caption_text);
// }); 