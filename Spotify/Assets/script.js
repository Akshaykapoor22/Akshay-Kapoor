let current = new Audio();//it will store the audio
console.log("Hello world");

//making a folder variable which will contain the current folder name
var folder = null

//function for playing a track . takes url as argument
function play(track) {
  current.src = track;
  current.play();
}

//function for converting secs into hrs mins and secs . returns the time
function time(take) {
  let mins = Math.floor(take / 60);
  let secs = Math.floor(take % 60);
  return mins + ":" + secs;
}

//this arr will contain all the songs url took from the fetch link 
var songarr = [];
async function main(folder) {
//took the whole directory from fetch from the url
  let a = await fetch(`http://192.168.143.115:5000/Spotify/Assets/songs/${folder}`);
  //parsed it in text
  let res = await a.text();
 
 //created a div which contains the text in res
  let element = document.createElement("div");
  element.innerHTML = res;
  //contains only the elements with anchor tags
  let cont = element.getElementsByTagName("a");

  for (let i = 0; i < cont.length; i++) {
    if (cont[i].href.endsWith(".mp3")) {
      //song name took from inner text
      let songName = cont[i].innerText;
      //song url took from href attribute
      let songUrl = cont[i].href;
      //pushed the url in songarr folder
      songarr.push(songUrl);
      //created the temp variable for every song present and added inner text of song name and stored url in dataset url 
      let temp = document.createElement("div");
      temp.innerText = songName;
      temp.style.border = "1px solid #12121275";
      temp.style.borderRadius = "0.75vw";
      temp.classList.add("song-item"); // Add a class for styling
      temp.dataset.url = songUrl; // Store the URL as a data attribute
      // Append the song item present in temp to the main container
      let main = document.getElementById("songs");
      main.append(temp);
    }
  }


  // Add event listeners for next button
  document.getElementById("next").addEventListener("click", () => {
    console.log("Next clicked");
//finding index of the song which is playing in the folder
    let index = songarr.indexOf(current.src);
    console.log("Current Song Index:", index);
    if (index !== -1 && index + 1 < songarr.length) {
      play(songarr[index + 1]);//playing song at next index if available
    }
  });

  // Add event listeners for previous button
  document.getElementById("previous").addEventListener("click", () => {
    console.log("Previous clicked");
    let index = songarr.indexOf(current.src);
    console.log("Current Song Index:", index);
    if (index !== -1 && index > 0) {
      play(songarr[index - 1]);//play the previous song if possible
    } else if (index === 0) {
      play(songarr[songarr.length - 1]); // Play the last song if at the first song
    }
  });

  // Add event listener to play music when song name is clicked
  document.getElementById("songs").addEventListener("click", (event) => {
    if (event.target.classList.contains("song-item")) {
      let songUrl = event.target.dataset.url;//storing the url of song from dataset url as stored in temp
      play(songUrl);
    }
  });
//add event listener for pausing and playing songs based on current situation and changing the image present
  let pp = document.getElementById("pause");
  pp.addEventListener("click", () => {
    if (current.paused) {
      current.play();
      pp.src = "https://cdn.hugeicons.com/icons/pause-stroke-rounded.svg";
    } else {
      current.pause();
      pp.src = "https://cdn.hugeicons.com/icons/play-stroke-rounded.svg";
    }
  });
//updating the duration
  current.addEventListener("loadedmetadata", () => {
    const dur = document.getElementsByClassName("showtime")[0];
    let duration = time(current.duration);
    dur.innerText = duration;
    console.log(current.volume)
  });
//updating the current time 
  current.addEventListener("timeupdate", () => {
    const awaz = document.getElementById("CT");
    let show = time(current.currentTime);
    awaz.innerText = show;
    //changing the position of circle based on the current time % wrt duration
    document.querySelector("#circle").style.left = (current.currentTime / current.duration) * 100 + "%";
  }); 
  
//add event listener for changing the current time of the song based on the offset of seekbar at which point is clicked
  document.querySelector("#seekbar").addEventListener("click", (e) => {
    let currentduration = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector("#circle").style.left = currentduration + "%";
    current.currentTime = (current.duration * currentduration) / 100;
  });
}

//Folder Work
var currentfoldername 
var folderurl=[]
var foldername=[]
async function main2(){
  let b = await fetch(`http://192.168.143.115:5000/Spotify/Assets/songs/`);
let response = await b.text()
let div = document.createElement("div")
div.innerHTML = response
let content = div.getElementsByTagName("a")
for(let i =0;i<content.length;i++){
    //console.log(content[i].href.split("/").slice(5,6))
    //console.log(content[i].href.split("/").slice(6,7))
 if(content[i].href.split("/").slice(5,6)=="songs"){
  foldername.push(content[i].href.split("/").slice(6,7))
  folderurl.push(content[i].href)
  
  let temporary = document.createElement("div")
  let personalimage = document.createElement("div")
  let image = document.createElement("img")
  let folderName = document.createElement("div")
  let playbutton = document.createElement("div")
  let playbuttonimg = document.createElement("img")
  
  playbuttonimg.setAttribute("src","https://cdn.hugeicons.com/icons/play-stroke-rounded.svg")
  playbutton.classList.add("persbutton")
  playbutton.appendChild(playbuttonimg)
  folderName.innerText = content[i].href.split("/").slice(6,7)
  folderName.classList.add("artist")
  image.setAttribute("src" , "https://cdn.hugeicons.com/icons/folder-01-stroke-rounded.svg")
  personalimage.classList.add("persimg")
  personalimage.appendChild(image)
  temporary.appendChild(personalimage)
  temporary.appendChild(folderName)
temporary.appendChild(playbutton)
temporary.classList.add("perscard")
document.getElementsByClassName("cardss")[0].appendChild(temporary)

}
}
//add event listener for folder name 
document.getElementsByClassName("cardss")[0].addEventListener("click",async (e) => {
  
   // Clear the songarr array
   songarr = [];
   // Remove previously displayed song elements from the DOM
   document.getElementById("songs").innerHTML = "";
  
  // Convert the collection to an array
  let perscardsArray = Array.from(document.getElementsByClassName("perscard"));
  // Get the index of the clicked element within the array
  let index = perscardsArray.indexOf(e.target.closest(".perscard"));
  if (index !== -1) {
    // Get the folder name from the foldername array using the index
    currentfoldername = foldername[index];
   

//fetching and doing the same thing done above here 
let a = await fetch(`http://192.168.143.115:5000/Spotify/Assets/songs/${currentfoldername}`);
let res = await a.text();
let element = document.createElement("div");
element.innerHTML = res;
let cont = element.getElementsByTagName("a");

for (let i = 0; i < cont.length; i++) {
  if (cont[i].href.endsWith(".mp3")) {
    let songName = cont[i].innerText;
    let songUrl = cont[i].href;
    songarr.push(songUrl);
    let temp = document.createElement("div");
    temp.innerText = songName;
    temp.style.border = "1px solid #12121275";
    temp.style.borderRadius = "0.75vw";
    temp.classList.add("song-item"); // Add a class for styling
    temp.dataset.url = songUrl; // Store the URL as a data attribute
    // Append the song item present in temp to the main container
    let main = document.getElementById("songs");
    main.append(temp);
  }
}
}
});


  }


//event listener for showing all folders
document.getElementById("show1").addEventListener("click",()=>{
  if(document.getElementsByClassName("cardss")[0].style.overflow="hidden"){
    document.getElementsByClassName("cardss")[0].style.height="auto"
  }
})

//event listener for opening the hamburger menu
document.querySelector("#right").addEventListener("click", () => {
  document.querySelector("#mainbox1").style.left = "0";
});

//event listener for crossing the hamburger menu
document.querySelector("#cross").addEventListener("click", () => {
  document.querySelector("#mainbox1").style.left = "-100vw";
});
//event listener for opening the range of volume with the help of range
document.getElementsByClassName("volicon")[0].addEventListener("click",()=>{
  document.getElementById("zyada").style.opacity="1"
  }

)

//event listener for volume range{
document.querySelector("#zyada").addEventListener("change" , (e)=>{
  console.log(e.target.value)
current.volume=(e.target.value)/100
})

main(folder);
main2()