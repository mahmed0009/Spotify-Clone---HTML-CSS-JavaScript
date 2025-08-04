let songs;
let currentSong = new Audio();
let currFolder;

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
async function getSong(folder) {
    currFolder = folder
    let a = await fetch(`/${folder}/`)
    let response = await a.text()

    let div = document.createElement("div")
    div.innerHTML = response

    let as = div.getElementsByTagName("a")

    songs = []

    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1])
        }
    }

    ///displaying song on the screen
    let songUL = document.querySelector(".songsList").getElementsByTagName("ul")[0]
    songUL.innerHTML = ""
    for (const song of songs) {

        songUL.innerHTML += `<li>
                                <div class="name">
                                    ${song.replaceAll("%20", " ")}
                                </div>
                                <div class="playButt">
                                    <img src="assets/playButton.svg" alt="playButtonIcon">
                                </div>
                            </li>`
    }


    Array.from(document.querySelector(".songsList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", () => {
            playMusic(e.firstElementChild.innerHTML.trim())
        })
    });

}
//this funcion plays the music............
const playMusic = (track, pause = false) => {
    currentSong.src = `/${currFolder}/` + track

    if (!pause) {
        currentSong.play();
        play.src = "assets/musicPlay.svg"
    }

    document.querySelector(".playBarSongName").innerHTML = decodeURI(track)

}

async function displayAlbums() {
    let a = await fetch(`Songs/`)
    let response = await a.text()
    let div = document.createElement("div")
    div.innerHTML = response
    let anchors = div.getElementsByTagName("a")
    let cardsContainer = document.querySelector(".cards")

    let array = Array.from(anchors)
    for (let index = 0; index < array.length; index++) {
        const e = array[index];

        if (e.href.includes("/Songs")) {
            let folder = e.href.split("/").slice(-2)[0]

            let a = await fetch(`Songs/${folder}/info.json`)
            let response = await a.json()

            cardsContainer.innerHTML += `<div data-folder="${folder}" class="card">
                    <img src="assets/playButton.svg" alt="playButtonIcon">
                    <div class="img">
                        <img src="Songs/${folder}/cover.jpeg" alt="songImg">
                    </div>
                    <div class="songName">
                        ${response.title}
                    </div>
                    <div class="description">
                        ${response.description}
                    </div>`
        }
    }

    ///Get the playlist whenever it is clicked.........
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async items => {
            songs = await getSong(`Songs/${items.currentTarget.dataset.folder}`)
            alert("Your songs have been loaded to the playlist. Check the side bar")
        })
    });
}


/// this is the main funcion.......
async function main() {
    await getSong(`Songs/shubh`)
    console.log(`Songs/shubh`)
    console.log(`${currFolder}`)

    playMusic(songs[0], true)


    //this function will display the albums........
    displayAlbums()

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
    document.querySelector(".seekBar").addEventListener("click", e => {

        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100

        document.querySelector(".circle").style.left = `${percent}%`
        currentSong.currentTime = (currentSong.duration * percent) / 100

    })

    ///open side bar (hamburger)
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-1%"
    })

    ///close side bar..........
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-100%"
    })


    ///previous button for previous song........
    previous.addEventListener("click",async () => {
        await getSong(`${currFolder}`)
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])

        if (index - 1 >= 0) {
            playMusic(songs[index - 1])
        }
    })

    ///next button for next song.......
    next.addEventListener("click",async () => {
        await getSong(`${currFolder}`)
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        
        if (index + 1 < songs.length) {
            console.log(songs[index + 1])
            playMusic(songs[index + 1])
        }
        console.log(currFolder)
    })

    ///adding event listerner to volume input......
    document.querySelector(".volume").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        volumePercent = e.target.value / 100
        currentSong.volume = volumePercent
    })


    ///volume mute button .........
    document.querySelector(".volume > img").addEventListener("click", e=>{
        console.log(e.target.src)
        let volume = document.querySelector(".volume").getElementsByTagName("input")[0]
        if(e.target.src.includes("assets/volume.svg") || volume.value > 0){
            e.target.src = "assets/mute.svg"
            volume.value = 0
            currentSong.volume = volume.value
        }else{
            e.target.src = "assets/volume.svg"
            volume.value = 100
            currentSong.volume = (volume.value) / 100
        }
    })

}

main()