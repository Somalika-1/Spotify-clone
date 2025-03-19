console.log("Let's write javascript")

async function getsongs() {
    let a = await fetch("http://127.0.0.1:5500/Spotify%20clone/songs/")
    let response = await a.text();

    let div = document.createElement("div")
    div.innerHTML = response
    let as = div.getElementsByTagName("a")

    let songs = [];
    for (let i = 0; i < as.length; i++) {
        const ele = as[i]
        if (ele.href.endsWith(".mp3"))
            songs.push(ele.href.split("/songs/")[1]);
    }
    return songs
}

async function main() {
    //get list of all the songs
    let s=await getsongs()

    //show all the songs in the playlist
    let songUL=document.querySelector(".songList").getElementsByTagName("ul")[0]

    for(const song of s){
        songUL.innerHTML=songUL.innerHTML + ` <li>
                            <i class="fa-solid fa-music flex"></i>
                            <div class="info">
                                <div>${song.replaceAll("%20"," ")}</div>
                                <div>Somalika</div>
                            </div>

                            <div class="playnow">
                                <span>Play Now</span>
                                <i class="fa-regular fa-circle-play"></i>
                            </div></li>`
    }

}

main()
