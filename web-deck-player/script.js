/**
 * Web Deck Player v1.0 - script file
 * 
 * Welcome to the script file! 
 * 
 * CONTENTS:
 * 1. Playlists Array
 * 2. Initial Playlist
 * 3. Themes
 * 4. Current Theme
*/


/**
 * [1. PLAYLISTS ]
 * Here are the Youtube Playlists that will be available to play. To add a new one,
 * first make sure that your playlist is set to 'Hidden' or 'Public' in Youtube.
 * Then, look for the URL (for example: https://www.youtube.com/playlist?list=PLZyqOyXxaVETqpHhT_c5GPmAPzhJpJ5K7)
 * and copy only the part after 'list=' (for example: PLZyqOyXxaVETqpHhT_c5GPmAPzhJpJ5K7).
 * Finally, write a name for your playlist and paste the code you copied in the list below.
*/
var myPlaylists = {
    "MY COOL PLAYLIST": 'PLZyqOyXxaVETqpHhT_c5GPmAPzhJpJ5K7',
    //"ANOTHER PLAYLIST": 'PLZyqOyXxaVETqpHhT_c5GPmAPzhJpJ5K7',
};


/**
 * [2. INITIAL PLAYLIST ]
 * The first playlist that the player will load on startup. You may change it by
 * writing the name of the new playlist below.
*/
var currentPlaylist = myPlaylists["MY COOL PLAYLIST"];


/**
 * [3. THEMES]
 * Themes are a great way to customize the look of your player! Refer to the instructions 
 * to know how can you create new themes. Then, you may add them to the list below using 
 * the format ( "THEME NAME": 'theme-folder-name' ).
*/
var myThemes = {
    "DEFAULT": 'default',
    //"ANOTHER THEME": 'another-theme',
};


/**
 * [4. CURRENT THEME]
 * Set the theme of your player writing its name below.
 */
var currentTheme = myThemes["DEFAULT"];


// ===== END OF CONFIGURATION =====




var tag = document.createElement('script'); 

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var player;
var songLabel = document.getElementById("songLabel");
var statusLabel = document.getElementById("statusLabel");
var statusLabelInterval;

var savedVolume = 50;
var volumeButton = document.getElementById("volumeButton");
volumeButton.innerHTML = "<img src='./themes/" + currentTheme + "/images/sound.png' alt=''>";
var volumeBar = document.getElementById("volumeBar");
var isSlidingVolumeBar = false;
var videoButton = document.getElementById("videoButton");
var isVideoShowing = true;

var logo = document.getElementById("playerLogo");
logo.innerHTML = "<img src='./themes/" + currentTheme + "/logo.png' alt=''>";

var seekBar = document.getElementById("seekBar");
var isSlidingSeekBar = false;
var prevButton = document.getElementById("prevButton");
var playButton = document.getElementById("playButton");
var stopButton = document.getElementById("stopButton");
var nextButton = document.getElementById("nextButton");
var shuffleButton = document.getElementById("shuffleButton");
var shufflePlaylist = false;
var infoButton = document.getElementById("infoButton");
prevButton.innerHTML = "<img src='./themes/" + currentTheme + "/images/prev.png' alt=''>";
playButton.innerHTML = "<img src='./themes/" + currentTheme + "/images/play.png' alt=''>";
stopButton.innerHTML = "<img src='./themes/" + currentTheme + "/images/stop.png' alt=''>";
nextButton.innerHTML = "<img src='./themes/" + currentTheme + "/images/next.png' alt=''>";
infoButton.innerHTML = "<img src='./themes/" + currentTheme + "/images/info.png' alt=''>";

var playlistSelector = document.getElementById("playlistSelector");
for(var key in myPlaylists){
    var option = document.createElement('option');
    option.value = key;
    option.innerHTML = key;
    playlistSelector.appendChild(option);
}




function onYouTubeIframeAPIReady() {
    player = new YT.Player('youtube-player', {
    height: '100%',
    width: '100%',
    playerVars: {
        'controls': 0,
        'autoplay': 0,
        'playsinline': 1,
        'loop': 1
    },
    events: {
        'onReady': onPlayerReady,
        'onStateChange': onPlayerStateChange
    }
    });
}

function updateSongLabel() {
    if(player.getVideoData() && player.getVideoData().title != undefined){
        if(player.getVideoData().title == ""){
            songLabel.innerHTML = "READY";
        }
        else{
            songLabel.innerHTML = "<marquee>" + player.getVideoData().title + " - " + player.getVideoData().author + "</marquee>";
        }
    }else{
        songLabel.innerHTML = "Loading...";
    }
}

function updateStatusLabel() {
    let statusLabelText = "";
    let listText = " " + (player.getPlaylistIndex() + 1) + "/" + player.getPlaylist().length;
    let timeText = "0:00/0:00";

    seekBar.setAttribute("max", player.getDuration());
    if(!isSlidingSeekBar){
        seekBar.value = player.getCurrentTime();
    }
    if(!isSlidingVolumeBar){
        volumeBar.value = player.getVolume();
    }

    
    switch (player.getPlayerState()) {
    case -1: 
        statusLabelText = "Stopped";
        break;
    case 0:
        statusLabelText = "Ended";
        break;
    case 1: 
        statusLabelText = "Playing";
        break;
    case 2: 
        statusLabelText = "Paused";
        break;
    case 3:
        statusLabelText = "Loading... ";
        break;
    case 5:
        statusLabelText = "Video Cued";
        break;
    }
    timeText = formatTime(player.getCurrentTime()) + "/" + formatTime(player.getDuration());
    statusLabel.innerHTML = statusLabelText + listText + " " + timeText;

    if(player.getPlayerState() == 2 /* Paused */){
        statusLabel.setAttribute('class', 'blink');
    }
    else{
        statusLabel.removeAttribute('class');
    }
}

function formatTime(input) {
    var minutes = Math.trunc(input / 60);
    var seconds = Math.trunc(input - minutes * 60);
    if(seconds < 10) {
    return minutes + ":0" + seconds;
    }
    else {
    return minutes + ":" + seconds;
    }
}




volumeButton.addEventListener("click", function(){
    if(volumeBar.value != 0){
        savedVolume = volumeBar.value;
        player.setVolume(0);
        volumeBar.value = 0;
        volumeButton.innerHTML = "<img src='./themes/" + currentTheme + "/images/mute.png' alt=''>";
    }
    else{
        player.setVolume(savedVolume);
        volumeBar.value = savedVolume;
        volumeButton.innerHTML = "<img src='./themes/" + currentTheme + "/images/sound.png' alt=''>";
    }
    
});

volumeBar.addEventListener("input", function(){
    isSlidingVolumeBar = true;
    player.setVolume(this.value);
    if(volumeBar.value == 0){
        volumeButton.innerHTML = "<img src='./themes/" + currentTheme + "/images/mute.png' alt=''>";
    }
    else{
        volumeButton.innerHTML = "<img src='./themes/" + currentTheme + "/images/sound.png' alt=''>";
    }
});
volumeBar.addEventListener("mouseup", function(){
    isSlidingVolumeBar = false;
});

videoButton.addEventListener("click", function(){
    if(isVideoShowing){
        document.getElementById("youtube-player").hidden = true;
        isVideoShowing = false;
        videoButton.setAttribute('state', 'off');
    }
    else{
        document.getElementById("youtube-player").hidden = false;
        isVideoShowing = true;
        videoButton.setAttribute('state', 'on');
    }
});




seekBar.addEventListener("input", function(){
    isSlidingSeekBar = true;
    player.seekTo(this.value);
});
seekBar.addEventListener("mouseup", function(){
    isSlidingSeekBar = false;
});


playButton.addEventListener("click", function() {
    if(player.getPlayerState() == 1) {
        player.pauseVideo();
    }
    else {
        player.playVideo();
    }
});

stopButton.addEventListener("click", function() {
    if(player.getPlayerState() == 1 || player.getPlayerState() == 2) {
        player.stopVideo();
    }
});

nextButton.addEventListener("click", function() {
    player.nextVideo();
});

prevButton.addEventListener("click", function() {
    player.previousVideo();
});

shuffleButton.addEventListener("click", function() {
    if(shufflePlaylist == false){
        shufflePlaylist = true;
        shuffleButton.setAttribute('state', 'on');
    }
    else{
        shufflePlaylist = false;
        shuffleButton.setAttribute('state', 'off');
    }
    player.setShuffle(shufflePlaylist);
});

infoButton.addEventListener("click", function() {
    alert("player created for silentsuburbia.neocities.org\n(c) CC-BY");
});

playlistSelector.addEventListener("change", function() {
    currentPlaylist = myPlaylists[playlistSelector.value];
    player.stopVideo();
    player.loadPlaylist({ list: currentPlaylist });
});





function onPlayerReady(event) {
    player.loadPlaylist({ list: currentPlaylist });
    player.setVolume(50);
    player.setLoop(true);
}

function onPlayerStateChange(event) {
    //Change play/pause button icons
    if(player.getPlayerState() == 1 /* Playing */) {
        playButton.innerHTML = "<img src='./themes/" + currentTheme + "/images/pause.png' alt=''>";
    }
    else {
        playButton.innerHTML = "<img src='./themes/" + currentTheme + "/images/play.png' alt=''>";
    }
    

    //Load next video
    if (event.data == YT.PlayerState.ENDED) {
        player.nextVideo();
    }
    updateSongLabel();
    clearInterval(statusLabelInterval);
    statusLabelInterval = setInterval(updateStatusLabel, 100);
}