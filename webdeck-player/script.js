// Tu lista de canciones
const songs = [
    {
        title: "Formula 06 (Monte Carlo Radio Mix)",
        src: "../music/formula06-web.mp3",
        cover: "../imgs/choquef1.gif"
    },
    {
        title: "You're the sun [ 3ksyh Edition ] archive",
        src: "../music/y2klima-web.mp3",
        cover: "../imgs/lima.PNG"
    },
    {
        title: "Paramore - Decode",
        src: "../music/decode-web.mp3",
        cover: "../imgs/hayley2.gif"
    },
    {
        title: "My Chemical Romance - Helena",
        src: "../music/helena-web.mp3",
        cover: "../imgs/mcr.gif"
    },
    {
        title: "Paramore - Decoy",
        src: "../music/decoy-web.mp3",
        cover: "../imgs/paramoreriotcd.gif"
    },
    {
        title: "Evanescence - Bring Me To Life (Demo)",
        src: "../music/bringmetolife-web.mp3",
        cover: "../imgs/evanescence.gif"
    },
];

let current = 0;
let shuffleOn = false;

const audio = new Audio();
const songLabel = document.getElementById("songLabel");
const statusLabel = document.getElementById("statusLabel");
const seekBar = document.getElementById("seekBar");
const volumeBar = document.getElementById("volumeBar");
const playButton = document.getElementById("playButton");
const prevButton = document.getElementById("prevButton");
const nextButton = document.getElementById("nextButton");
const stopButton = document.getElementById("stopButton");
const shuffleButton = document.getElementById("shuffleButton");
const volumeButton = document.getElementById("volumeButton");

// Filtro estilo parlante antiguo
const audioCtx = new AudioContext();
const source = audioCtx.createMediaElementSource(audio);

const highPass = audioCtx.createBiquadFilter();
highPass.type = "highpass";
highPass.frequency.value = 300;

const lowPass = audioCtx.createBiquadFilter();
lowPass.type = "lowpass";
lowPass.frequency.value = 2800;

const compressor = audioCtx.createDynamicsCompressor();
compressor.threshold.value = -18;
compressor.knee.value = 20;
compressor.ratio.value = 12;

const gain = audioCtx.createGain();
gain.gain.value = 1.3;

source.connect(highPass);
highPass.connect(lowPass);
lowPass.connect(compressor);
compressor.connect(gain);
gain.connect(audioCtx.destination);

// Temas y logo (mantenemos lo que ya tenía el webdeck)
var myThemes = {
    "DEFAULT": 'default',
    "SILVER": 'silver',
    "VIOLET": "violet",
    "MINIMAL": "minimal",
    "RED GRUNGE": "red-grunge",
};

document.getElementById("playlistSelector").style.display = "none";
document.getElementById("themeSelector").style.display = "none";
var currentTheme = "VIOLET";

document.getElementById("player-theme").setAttribute("href", "./themes/" + myThemes[currentTheme] + "/webdeck-player.css");

var logo = document.getElementById("playerLogo");
logo.innerHTML = "<img src='./themes/" + myThemes[currentTheme] + "/logo.png' alt=''>";

volumeButton.innerHTML = "<img src='./themes/" + myThemes[currentTheme] + "/images/sound.png' alt=''>";
prevButton.innerHTML = "<img src='./themes/" + myThemes[currentTheme] + "/images/prev.png' alt=''>";
playButton.innerHTML = "<img src='./themes/" + myThemes[currentTheme] + "/images/play.png' alt=''>";
stopButton.innerHTML = "<img src='./themes/" + myThemes[currentTheme] + "/images/stop.png' alt=''>";
nextButton.innerHTML = "<img src='./themes/" + myThemes[currentTheme] + "/images/next.png' alt=''>";

var themeSelector = document.getElementById("themeSelector");
for (var key in myThemes) {
    var option = document.createElement('option');
    option.value = key;
    option.innerHTML = key;
    themeSelector.appendChild(option);
}
themeSelector.value = currentTheme;

themeSelector.addEventListener("change", function () {
    currentTheme = themeSelector.value;
    document.getElementById("player-theme").setAttribute("href", "./themes/" + myThemes[currentTheme] + "/webdeck-player.css");
    volumeButton.innerHTML = "<img src='./themes/" + myThemes[currentTheme] + "/images/sound.png' alt=''>";
    prevButton.innerHTML = "<img src='./themes/" + myThemes[currentTheme] + "/images/prev.png' alt=''>";
    playButton.innerHTML = "<img src='./themes/" + myThemes[currentTheme] + "/images/play.png' alt=''>";
    stopButton.innerHTML = "<img src='./themes/" + myThemes[currentTheme] + "/images/stop.png' alt=''>";
    nextButton.innerHTML = "<img src='./themes/" + myThemes[currentTheme] + "/images/next.png' alt=''>";
    logo.innerHTML = "<img src='./themes/" + myThemes[currentTheme] + "/logo.png' alt=''>";
});

function loadSong() {
    audio.src = songs[current].src;
    songLabel.innerHTML = "<marquee><b>" + songs[current].title + "</b></marquee>";

    // Mostrar cover en lugar del video de youtube
    document.getElementById("player-display").innerHTML = 
        `<img src="${songs[current].cover}" style="width:100%; height:100%; object-fit:cover;">`;
}

function updatePlayButton() {
    if (audio.paused) {
        playButton.innerHTML = "<img src='./themes/" + myThemes[currentTheme] + "/images/play.png' alt=''>";
    } else {
        playButton.innerHTML = "<img src='./themes/" + myThemes[currentTheme] + "/images/pause.png' alt=''>";
    }
}

// Actualizar barra de progreso y estado
setInterval(() => {
    if (!isNaN(audio.duration)) {
        seekBar.max = audio.duration;
        seekBar.value = audio.currentTime;

        const cur = formatTime(audio.currentTime);
        const dur = formatTime(audio.duration);
        const state = audio.paused ? "PAUSED" : "PLAYING";
        statusLabel.innerHTML = `${state} ${current + 1}/${songs.length} ${cur}/${dur}`;

        if (audio.paused) {
            statusLabel.setAttribute('class', 'blink');
        } else {
            statusLabel.removeAttribute('class');
        }
    }
}, 100);

function formatTime(input) {
    var minutes = Math.trunc(input / 60);
    var seconds = Math.trunc(input - minutes * 60);
    return minutes + ":" + (seconds < 10 ? "0" + seconds : seconds);
}

playButton.addEventListener("click", () => {
    if (audioCtx.state === "suspended") audioCtx.resume();
    if (audio.paused) {
        audio.play();
    } else {
        audio.pause();
    }
    updatePlayButton();
});

stopButton.addEventListener("click", () => {
    audio.pause();
    audio.currentTime = 0;
    updatePlayButton();
});

nextButton.addEventListener("click", () => {
    if (shuffleOn) {
        current = Math.floor(Math.random() * songs.length);
    } else {
        current = (current + 1) % songs.length;
    }
    loadSong();
    audio.play();
    updatePlayButton();
});

prevButton.addEventListener("click", () => {
    current = (current - 1 + songs.length) % songs.length;
    loadSong();
    audio.play();
    updatePlayButton();
});

audio.addEventListener("ended", () => {
    if (shuffleOn) {
        current = Math.floor(Math.random() * songs.length);
    } else {
        current = (current + 1) % songs.length;
    }
    loadSong();
    audio.play();
    updatePlayButton();
});

seekBar.addEventListener("input", () => {
    audio.currentTime = seekBar.value;
});

volumeBar.addEventListener("input", () => {
    audio.volume = volumeBar.value / 100;
    volumeButton.innerHTML = volumeBar.value == 0
        ? "<img src='./themes/" + myThemes[currentTheme] + "/images/mute.png' alt=''>"
        : "<img src='./themes/" + myThemes[currentTheme] + "/images/sound.png' alt=''>";
});

let savedVolume = 50;
volumeButton.addEventListener("click", () => {
    if (audio.volume != 0) {
        savedVolume = volumeBar.value;
        audio.volume = 0;
        volumeBar.value = 0;
        volumeButton.innerHTML = "<img src='./themes/" + myThemes[currentTheme] + "/images/mute.png' alt=''>";
    } else {
        audio.volume = savedVolume / 100;
        volumeBar.value = savedVolume;
        volumeButton.innerHTML = "<img src='./themes/" + myThemes[currentTheme] + "/images/sound.png' alt=''>";
    }
});

shuffleButton.addEventListener("click", () => {
    shuffleOn = !shuffleOn;
    shuffleButton.setAttribute('state', shuffleOn ? 'on' : 'off');
});

// También eliminá el selector de playlist del HTML ya que no se usa más,
document.getElementById("playlistSelector").style.display = "none";

// Iniciar
audio.volume = volumeBar.value / 100;
loadSong();

window.addEventListener("load", () => {
    loadSong();
    audio.play();
    updatePlayButton();
});