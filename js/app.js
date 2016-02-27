var caption_html = "<p class='caption' id='{index}''>{caption}</p>";
var video = document.getElementById("video");

function parseTimeCode(string) {
    var both_times = string.split(" --> ");
    var st_hhmmss = both_times[0].split(":").map(parseFloat);
    var total_start_seconds = st_hhmmss[2] + (st_hhmmss[1] * 60) + (st_hhmmss[0] * 3600);
    var end_hhmmss = both_times[1].split(":").map(parseFloat);
    var total_end_seconds = end_hhmmss[2] + (end_hhmmss[1] * 60) + (end_hhmmss[0] * 3600);
    return {start_time: total_start_seconds, end_time: total_end_seconds};
}

function jumpToCaption(e){
    var this_caption = find_caption_at_index(e.target.id);
    video.currentTime = this_caption.times.start_time + 0.01;
}

var captions = [];
function parseCaptionText(text) {
    var raw_data = text.split("\n");
    $.each(raw_data, function(i, value) {
        if ((!isNaN(value)) && (value.length >= 1)) {
            parseTimeCode(raw_data[i + 1]);
            var caption_object = {
                index: value,
                times: parseTimeCode(raw_data[i + 1]),
                caption_text: "" };
            var next = i + 2;
            while ((typeof raw_data[next] !== 'undefined') && (raw_data[next] !== "")) {
                caption_object.caption_text += raw_data[next] + " ";
                next++;
            }
            captions.push(caption_object);
        }
    });
    var div_text = "";
    $.each(captions, function(i, value) {
        var new_caption = caption_html;
        new_caption = new_caption.replace("{caption}", value.caption_text);
        new_caption = new_caption.replace("{index}", value.index);
        div_text += new_caption;
    });
    $('#text').html(div_text);
    var all_captions = document.getElementsByClassName('caption');
    for (var i = 0; i < all_captions.length; i++) {
        all_captions[i].onclick = jumpToCaption;
    }
}

function find_caption_at_index(index) {
    for (var i = 0; i < captions.length; i++) {
        if (captions[i].index === index) {
            return captions[i];
        }
    }
} 

Number.prototype.toMMSS = function () {
    var sec_num = Math.round(this); 
    var hours   = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);
    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    var time    = minutes+':'+seconds;
    return time;
};

function display_duration() {
    var duration = document.getElementById("duration");
    var formatted_duration = video.duration.toMMSS();
    duration.innerHTML = "/ {duration}".replace("{duration}", formatted_duration);
}

function find_current_caption(currentTime) {
    for (var i = 0; i < captions.length; i++) {
        if ((currentTime >= captions[i].times.start_time) && 
            (currentTime < captions[i].times.end_time)) {
            return captions[i].index;
        }
    }
}

function update_current_time() {
    var current_time = document.getElementById("current-time");
    var formatted_time = video.currentTime.toMMSS();
    current_time.innerHTML = formatted_time;
    $('.caption').removeClass('current-caption');
    var current_index = find_current_caption(video.currentTime);
    $('#' + current_index).addClass('current-caption');
    var play_percentage = document.getElementById("play-percentage");
    var time_percentage = video.currentTime / video.duration;    
    play_percentage.style.width = "calc((100% - 15px) * " + time_percentage + ")";
}

function update_buffer(e) {
    var percent = null;
    if (video && video.buffered && video.buffered.length > 0 && video.buffered.end && video.duration) {
        percent = video.buffered.end(0) / video.duration;
    } 
    else if (video && video.bytesTotal !== undefined && video.bytesTotal > 0 && video.bufferedBytes !== undefined) {
        percent = video.bufferedBytes / video.bytesTotal;
    }
    if (percent !== null) {
        percent = Math.min(1, Math.max(0, percent));
        var buffer_div = document.getElementById('buffer-percentage');
        buffer_div.style.width = "calc((100% - 15px) * " + percent + ")";
    }
}

function updatePlayState(e) {
    // var video = document.getElementById("video");
    if (video.paused === true) {
        video.play();
        e.target.className = "";
        e.target.className = "pause";
    } else {
        video.pause();
        e.target.className = "";
        e.target.className = "play";
    }
}

function updateMuteState(e) {
    if (video.muted === false) {
        video.muted = true;
        e.target.className = "";
        e.target.className = "volume-off";

    } else {
        video.muted = false;
        e.target.className = "";
        e.target.className = "volume-on";
    }
}

function toggleFullScreen() {
    var video_wrapper = document.getElementById("video-wrapper");
    if (window.innerHeight === screen.height) {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if(document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if(document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        }

    } else {
        if (video_wrapper.requestFullscreen) {
            video_wrapper.requestFullscreen();
        } else if (video_wrapper.mozRequestFullScreen) {
            video_wrapper.mozRequestFullScreen();
        } else if (video_wrapper.webkitRequestFullscreen) {
            video_wrapper.webkitRequestFullscreen();
        } 
    }
}

function toggleCaptions(e) {
    var ccButton = document.getElementById("cc");
    if (video.textTracks[0].mode === 'showing') {
        video.textTracks[0].mode = 'disabled';
        ccButton.classList.remove('cc-on');
    } else {
        video.textTracks[0].mode = 'showing';
        ccButton.classList.add('cc-on');
    }
}

window.onload = function() {

    $.get('video/captions.vtt', function(data) {
        parseCaptionText(data);
    });

    video.addEventListener('loadedmetadata', function() {
        display_duration();
        update_current_time();
    });

    video.addEventListener('progress', update_buffer);

    var buttons = document.getElementById("buttons");
    buttons.style.display = "none";
    var video_wrapper = document.getElementById("video-wrapper");
    video_wrapper.onmouseover = function() {
        buttons.style.display = "block";
    };
    video_wrapper.onmouseleave = function() {
        buttons.style.display = "none";
    };

    var playButton = document.getElementById("play-pause");
    playButton.onclick = updatePlayState;

    var muteButton = document.getElementById("mute");
    muteButton.onclick = updateMuteState;

    var fullScreenButton = document.getElementById("full-screen");
    fullScreenButton.onclick = toggleFullScreen;

    var seekBar = document.getElementById("seek-bar");
    seekBar.addEventListener("click", function() {
        var time = video.duration * (seekBar.value / 100);
        video.currentTime = time;
        update_current_time();
    });

    var ccButton = document.getElementById("cc");
    ccButton.onclick = toggleCaptions;

    video.textTracks[0].mode = 'disabled';
    video.textTracks[0].id = 'caption-style';

    video.addEventListener("timeupdate", function() {
        update_current_time();
    });

    update_current_time();
    display_duration();
    update_buffer();
};