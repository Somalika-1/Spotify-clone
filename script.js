let currentsong=new Audio();
let s;
let currFolder;

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

async function getsongs(folder) {
    currFolder=folder;

    let a = await fetch(`http://127.0.0.1:5500/Spotify%20clone/${folder}/`)
    let response = await a.text();

    let div = document.createElement("div")
    div.innerHTML = response
    let as = div.getElementsByTagName("a")

    s = [];
    for (let i = 0; i < as.length; i++) {
        const ele = as[i]
        if (ele.href.endsWith(".mp3"))
            s.push(ele.href.split(`/${folder}/`)[1]);
    }
   
}

const playmusic=(track,pause=false)=>{
    currentsong.src = `/Spotify%20clone/${currFolder}/` + track

    if(!pause){
        currentsong.play()
        play.classList.remove("fa-play");
        play.classList.add("fa-pause");

    }

    document.querySelector(".songinfo").innerHTML=decodeURI(track)
    document.querySelector(".songtime").innerHTML="00:00 / 00:00"
}

const updatePlaylist=()=>{
        //show all the songs in the playlist
    let songUL=document.querySelector(".songList").getElementsByTagName("ul")[0]
    songUL.innerHTML=""

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

}

const displayAlbums=async ()=>{
    let a = await fetch(`http://127.0.0.1:5500/Spotify%20clone/songs/`)
    let response = await a.text();

    let div = document.createElement("div")
    div.innerHTML = response

    let anchors=div.getElementsByTagName("a")
    let folders=[]
    Array.from(anchors).forEach(e=>{
        if(e.href.includes("/songs")){
            console.log(e.href.split("/").slice(-1))
        }
    })
    
}

async function main() {

    //get list of all the songs
    await getsongs("songs/ncs")
    playmusic(s[0],true)

    displayAlbums()

    updatePlaylist();

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
        currentsong.volume=parseInt(e.target.value)/100
    })

    //Load the playlist whenever card is clicked
    document.querySelectorAll(".card").forEach(e=>{
        e.addEventListener("click",async item=>{
            const folder = item.currentTarget.dataset.folder;
        
            await getsongs(`songs/${folder}`);
        
            updatePlaylist();
    
        })
    })
}

main()
