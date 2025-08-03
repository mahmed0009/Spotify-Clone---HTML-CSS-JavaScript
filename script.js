let currentSong = new Audio()

//this funciton convert the second to minutes.....
function formatTime(seconds) {
    // Ensure seconds is an integer
    seconds = parseInt(seconds, 10);

    // Calculate minutes and remaining seconds
    let minutes = Math.floor(seconds / 60);
    let remainingSeconds = seconds % 60;

    // Add leading zeros if needed
    let formattedMinutes = minutes.toString().padStart(2, '0');
    let formattedSeconds = remainingSeconds.toString().padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}


/// this will get the songs the from the folder.......
async function getSong() {
    let a = await fetch("/Songs/")
    let response = await a.text()

    let div = document.createElement("div")
    div.innerHTML = response

    let as = div.getElementsByTagName("a")

    let songs = []

    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split("/Songs/")[1])
        }
    }
    return songs
}
//this funcion plays the music............
const playMusic = (track, pause = false) => {
    currentSong.src = "/Songs/" + track

    if (!pause) {
        currentSong.play();
        play.src = "assets/musicPlay.svg"
    }

    document.querySelector(".playBarSongName").innerHTML = decodeURI(track)

}
/// this is the main funcion.......
async function main() {
    let songs = await getSong()

    playMusic(songs[0], true)

    ///displaying song on the screen
    for (const song of songs) {
        let songUL = document.querySelector(".songsList").getElementsByTagName("ul")[0]

        songUL.innerHTML += `<li>
                                <div class="name">
                                    ${song.replace("%20", " ")}
                                </div>
                                <div class="playButt">
                                    <img src="assets/playButton.svg" alt="playButtonIcon">
                                </div>
                            </li>`
    }

    ///playing audio......

    Array.from(document.querySelector(".songsList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", () => {
            playMusic(e.firstElementChild.innerHTML.trim())
        })
    });



    ///seekbar buttons......
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            play.src = "assets/musicPlay.svg"
        }
        else {
            currentSong.pause()
            play.src = "assets/musicPause.svg"
        }
    })

    //update the time in the play bar.........
    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".duration").innerHTML = `${formatTime(currentSong.currentTime)} / ${formatTime(currentSong.duration)}`

        let percent = (currentSong.currentTime / currentSong.duration) * 100

        document.querySelector(".circle").style.left = `${percent}%`

    })

    //moveable seekbar circle........
    document.querySelector(".seekBar").addEventListener("click", e=>{

        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100

        document.querySelector(".circle").style.left = `${percent}%`
        currentSong.currentTime = (currentSong.duration * percent) / 100

    })

    ///open side bar (hamburger)
    document.querySelector(".hamburger").addEventListener("click", ()=>{
        document.querySelector(".left").style.left = "-3%"
    })

    ///close side bar
    document.querySelector(".close").addEventListener("click", ()=>{
        document.querySelector(".left").style.left = "-100%"
    })
}

main()