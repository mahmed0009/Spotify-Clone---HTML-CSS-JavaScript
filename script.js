async function getSong() {
    let a = await fetch("/Songs/")
    let response = await a.text()

    let div = document.createElement("div")
    div.innerHTML = response

    let as = div.getElementsByTagName("a")
    
    let songs = []

    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if(element.href.endsWith(".mp3")){
            songs.push(element.href.split("/Songs/")[1])
        }
    }
    return songs
} 

async function main(){
    let songs = await getSong()
    console.log(songs)

    for (const song of songs) {
        let songUL = document.querySelector(".songsList").getElementsByTagName("ul")[0]

        songUL.innerHTML += `<li>
                                ${song.replace("%20"," ")}
                            </li>`
    }
}

main()