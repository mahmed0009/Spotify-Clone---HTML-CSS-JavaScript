
async function getSongs() {
    let a = await fetch("http://192.168.100.147:3000/Songs/")
    let respone = await  a.text()
    console.log(respone)

    let div = document.createElement("div")
    div.innerHTML = respone;

    let as = div.getElementsByTagName("a")
    console.log(as)

    let songs = []

    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if(element.href.endsWith(".mp3")){
            songs.push(element.href.split("/Songs/")[1])
        }
    }
    return songs
}

async function main() {
    // getting the list of all the songs
    let songs =await getSongs()
    console.log(songs)

    let songUl = document.querySelector(".songsList").getElementsByTagName("ul")[0]

    for (const song of songs) {
        songUl.innerHTML += `<li>
                                <div class="text">
                                    ${song.replaceAll("-", " ")}
                                </div>
                                <img src="playButton.svg" alt="">
                            </li>`
    }

    // playing the first song
    var audio = new Audio(songs[0])
    // audio.play()
}

main()
