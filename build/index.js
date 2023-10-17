import { extractVideoId, isValidId } from "./utils.js";

var player;
var intervalId;
const playerContainer = document.getElementById("youtube-player-container");
const category_list = document.getElementById("category_list");
const new_category_name = document.getElementById("new_category_name");
const add_category_btn = document.getElementById("add_category_btn");
const homeBtn = document.getElementById("back-to-home");
const data = JSON.parse(localStorage.getItem("data")) || [];

add_category_btn.addEventListener("click", add_new_category);
homeBtn.addEventListener("click", destroyPlayer);
category_list.addEventListener("click", (e) => {
  // Edit / Delete /  Go / Continue
  const hasClass = (str) => e.target.classList.contains(str);
  const getAttribute = (str) => e.target.getAttribute(str);
  if (hasClass("edit")) {
    const index = getAttribute("data-index");
    const editedName = prompt("Edit Name:", data[index].category_name);
    if (editedName !== null) {
      data[index].category_name = editedName;
      saveData(data);
      renderData();
    }
  } else if (hasClass("delete")) {
    const index = getAttribute("data-index");
    data.splice(index, 1);
    saveData(data);
    renderData();
  } else if (hasClass("go-btn")) {
    const item_index = getAttribute("data-index");
    const yt_link = category_list.querySelector(
      `input[data-index="${item_index}"]`
    );
    if (yt_link.value) {
      initiatePlayer(item_index, yt_link.value);
    } else {
      alert("Enter youtube link or video id !");
    }
  } else if (hasClass("continue-btn")) {
    const item_index = getAttribute("data-index");
    const { yt_vid_id, seekTo } = data[item_index];
    if (yt_vid_id) {
      // console.log(videoId);
      loadPlayer(item_index, yt_vid_id, seekTo);
    } else {
      alert("No data found in localStorage.");
    }
  }
});

renderData();

function add_new_category() {
  addItem(new_category_name.value, "", 0);
  new_category_name.value = "";
}
function saveData(data) {
  localStorage.setItem("data", JSON.stringify(data));
}
function updateData(item_index, videoId, seekTo) {
  videoId && (data[item_index].yt_vid_id = videoId);
  seekTo && (data[item_index].seekTo = seekTo);
  saveData(data);
}
function addItem(category_name, yt_vid_id, seekTo) {
  const newItem = { category_name, yt_vid_id, seekTo };
  data.push(newItem);
  saveData(data);
  renderData();
}
function renderData() {
  category_list.innerHTML = "";
  data.forEach((item, index) => {
    const { category_name, yt_vid_id, seekTo } = item;
    const listItem = `
        <li class="p-2 text-gray-100 bg-gray-700 rounded-lg category-item"> 
          <div class="flex items-center justify-between text-base font-semibold tracking-wide">
            <span class="capitalize text-lg">${category_name} </span>
            <div>
              <button data-index="${index}" class="p-1 border border-gray-600 rounded-full edit">🖋</button>
              <button data-index="${index}" class="p-1 border border-gray-600 rounded-full delete">&#x1F5D1;</button>
            </div>
          </div>
          <div class="flex items-center justify-center mt-1">
            <input data-index="${index}"
              class="flex-grow p-1 mr-1 text-white bg-gray-600 border border-gray-500 rounded-lg sm:p-2 sm:mr-2 sm:text-lg focus:outline-none"
              placeholder="Enter any YouTube link or Video Id">
            <button data-index="${index}" class="go-btn flex-shrink p-1 mr-1 text-white bg-blue-700 rounded-lg sm:px-4 sm:py-2 sm:mr-2 sm:text-xl">
              Go
            </button>
            <button data-index="${index}" class="continue-btn p-1 text-white bg-green-700 rounded-lg sm:p-2 sm:text-xl">
              Continue
            </button>
          </div>
        </li>
    `;
    category_list.innerHTML += listItem;
  });
}

function initiatePlayer(item_index, youtubeLink) {
  const videoId = extractVideoId(youtubeLink);
  if (isValidId(videoId)) {
    // current_item_index:number, videoId:alphanummeric, SeekTo::Number:Seconds
    loadPlayer(item_index, videoId, 0);
  } else {
    alert("Invalid Youtube Link !");
  }
}

function destroyPlayer() {
  if (player) player.destroy();
  clearInterval(intervalId);
  playerContainer.classList.add("hidden");
  playerContainer.classList.add("invisible");
}

function loadPlayer(current_item_index, videoId, seekTo) {
  updateData(current_item_index, videoId, seekTo);

  destroyPlayer();

  playerContainer.classList.remove("hidden");
  playerContainer.classList.remove("invisible");

  player = new YT.Player("player", {
    height: "100%",
    width: "100%",
    playerVars: {
      playsinline: 1,
      rel: 0,
      autoplay: 0,
      fs: 1,
      enablejsapi: 1,
      expflag: "embeds_enable_muted_autoplay:true",
    },
    events: {
      onReady: onPlayerReady,
      onStateChange: onPlayerStateChange,
    },
  });
  function onPlayerReady(event) {
    player.loadVideoById(videoId, seekTo);
    // update storage data for restorePrevVid() when you visit next.
    intervalId = setInterval(
      () => updateData(current_item_index, videoId, player.getCurrentTime()),
      5000
    );
  }
  function onPlayerStateChange() {}
}
