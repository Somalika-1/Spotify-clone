let currentsong=new Audio();
let s;

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

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

const playmusic=(track,pause=false)=>{
    currentsong.src="/Spotify%20clone/songs/" + track

    if(!pause){
        currentsong.play()
        play.classList.remove("fa-play");
        play.classList.add("fa-pause");

    }

    document.querySelector(".songinfo").innerHTML=decodeURI(track)
    document.querySelector(".songtime").innerHTML="00:00 / 00:00"
}

async function main() {

    //get list of all the songs
    s=await getsongs()
    playmusic(s[0],true)

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

    //attach eventlistener to each song

    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e=>{

        e.addEventListener("click",ele=>{
        playmusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })
    })

    //attach event listener for prev play next
    play.addEventListener("click",()=>{
        if(currentsong.paused){
            currentsong.play()
            play.classList.remove("fa-play");
            play.classList.add("fa-pause");
        }
        else{
            currentsong.pause()
            play.classList.remove("fa-pause");
            play.classList.add("fa-play");
        }
    })

    //listener for timeupdate

    currentsong.addEventListener("timeupdate",()=>{
        document.querySelector(".songtime").innerHTML=`${secondsToMinutesSeconds(currentsong.currentTime)} / ${secondsToMinutesSeconds(currentsong.duration)}`
        document.querySelector(".circle").style.left=(currentsong.currentTime/currentsong.duration)*100 + "%"
    })

    //add an eventlistener to seekbar
    document.querySelector(".seekbar").addEventListener("click", (e) => {

        let percent=(e.offsetX/e.target.getBoundingClientRect().width)*100
        document.querySelector(".circle").style.left= percent + "%";
        currentsong.currentTime=(currentsong.duration*percent)/100
    })

    //add an event listener for hamburger
    document.querySelector(".hamburger").addEventListener("click",()=>{
        document.querySelector(".left").style.left="0"
    })

    //add an event listener for close button
    document.querySelector(".close").addEventListener("click",()=>{
        document.querySelector(".left").style.left="-130%"
    })    

    //add an event listener to prev and next
    prev.addEventListener("click",()=>{
        console.log("previous clicked")

        let index=s.indexOf(currentsong.src.split("/").slice(-1)[0])
        if (index > 0) {
            // Move to the previous song (index - 1)
            playmusic(s[index - 1]);
        } else {
            // If at the first song, loop to the last song
            playmusic(s[s.length - 1]);
        }
    })

    //add an event listener to prev and next
    next.addEventListener("click",()=>{
        console.log("Next clicked")

        let index=s.indexOf(currentsong.src.split("/").slice(-1)[0])
        if (index < s.length - 1) {
            // Move to the next song (index + 1)
            playmusic(s[index + 1]);
        } else {
            // If at the last song, loop back to the first song
            playmusic(s[0]);
        }
    })

    //add an event to volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
        console.log("vol changed to ",e.target.value,"/100")
        currentsong.volume=parseInt(e.target.value)/100
    })
}

main()
