const songs=[

{
    title:"Paramore - Decode",
    src:"./music/decode-web.mp3",
    cover:"./imgs/decode.jpg"
},

{
    title:"My Chemical Romance - Helena",
    src:"./music/helena-web.mp3",
    cover:"./imgs/helena.jpg"
},
{
    title:"Paramore - Decoy",
    src:"./music/decoy-web.mp3",
    cover:"./imgs/decoy.PNG"
}

];

let current=0;

const audio=document.getElementById("audio");

const audioContext = new AudioContext();

const source = audioContext.createMediaElementSource(audio);

/* corta graves muy profundos */
const highPass = audioContext.createBiquadFilter();
highPass.type = "highpass";
highPass.frequency.value = 200;

/* corta agudos muy altos */
const lowPass = audioContext.createBiquadFilter();
lowPass.type = "lowpass";
lowPass.frequency.value = 3200;

/* compresión tipo radio/mini componente */
const compressor = audioContext.createDynamicsCompressor();

compressor.threshold.value = -18;
compressor.knee.value = 20;
compressor.ratio.value = 12;

/* un poco de ganancia */
const gain = audioContext.createGain();
gain.gain.value = 1.2;


/* conectar cadena */

source.connect(highPass);
highPass.connect(lowPass);
lowPass.connect(compressor);
compressor.connect(gain);
gain.connect(audioContext.destination);

const playBtn=document.getElementById("play");

const title=document.getElementById("song-title");

const cover=document.getElementById("cover");

const volume=document.getElementById("volume");

const progress=document.getElementById("progress");

function updatePlayButton() {
    playBtn.textContent = audio.paused ? "▶" : "⏸";
}

function loadSong(autoplay = false) {
    audio.src = songs[current].src;
    title.textContent = songs[current].title;
    cover.src = songs[current].cover;

    if (autoplay) {
        audio.play().then(updatePlayButton).catch(() => {});
    }
}


loadSong();

audio.volume = volume.value / 100;

playBtn.onclick = () => {
    if (audio.paused) {
        audio.play().then(updatePlayButton);
    } else {
        audio.pause();
        updatePlayButton();
    }
};


document.getElementById("next").onclick = () => {
    current = (current + 1) % songs.length;
    loadSong(true); // autoplay al cambiar canción
};

document.getElementById("prev").onclick = () => {
    current = (current - 1 + songs.length) % songs.length;
    loadSong(true);
};

volume.oninput=()=>{

    audio.volume=
    volume.value/100;
};

audio.addEventListener("timeupdate",()=>{

    progress.max=audio.duration;

    progress.value=
    audio.currentTime;
});

progress.oninput=()=>{

    audio.currentTime=
    progress.value;
};

document.addEventListener("click", async ()=>{

    if(audioContext.state==="suspended"){
        await audioContext.resume();
    }

},{once:true});


audio.addEventListener("play", updatePlayButton);
audio.addEventListener("pause", updatePlayButton);