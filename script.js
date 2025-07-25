let currentSong = new Audio()

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);

    // Add leading zeros if needed
    const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
    const formattedSeconds = secs < 10 ? "0" + secs : secs;

    return `${formattedMinutes}:${formattedSeconds}`;
}


async function getSongs() {
    let a = await fetch("http://192.168.100.147:3000/Songs/")
    let respone = await a.text()
    console.log(respone)

    let div = document.createElement("div")
    div.innerHTML = respone;

    let as = div.getElementsByTagName("a")
    console.log(as)

    let songs = []

    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split("/Songs/")[1])
        }
    }
    return songs
}

const playMusic = (track, pause = true) => {
    let songname = ("/Songs/" + track).replaceAll(" ", "%20")
    currentSong.src = songname
    if(pause){
        Play.src = "musicPlay.svg"
        currentSong.play()
    }

    document.querySelector(".songInfo").innerHTML = decodeURI(track)

}


async function main() {

    // getting the list of all the songs
    let songs = await getSongs()
    playMusic(songs[0],false)

    let songUl = document.querySelector(".songsList").getElementsByTagName("ul")[0]

    for (const song of songs) {
        songUl.innerHTML += `<li>
                                <div class="text">
                                    ${song.replaceAll("%20", " ")}
                                </div>
                                <img src="playButton.svg" alt="">
                            </li>`
    }

    Array.from(document.querySelector(".songsList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            playMusic(e.querySelector(".text").innerHTML.trim())
        })
    });



    Play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play();
            Play.src = "musicPlay.svg"
        } else {
            currentSong.pause();
            Play.src = "musicPause.svg"
        }
    })




    // creating a funciotn that update the song time

    currentSong.addEventListener("timeupdate", () => {
        console.log(currentSong.currentTime,currentSong.duration)
        let progress = (currentSong.currentTime / currentSong.duration) * 100;
        console.log(progress + "percent")

        document.querySelector(".songTime").innerHTML = `${formatTime(currentSong.currentTime)} /
                                                            ${formatTime(currentSong.duration)}`
        document.querySelector(".circle").style.left = `${progress}%`
    })


    // by this we can move the seekbar
    document.querySelector(".seekBar").addEventListener("click",e=>{
        let percent = ((e.offsetX / e.target.getBoundingClientRect().width)*100)
        console.log(percent)
        document.querySelector(".circle").style.left = `${percent}%`

        currentSong.currentTime = (currentSong.duration * percent) / 100
    })
}

main()
