// Constant variables
const memesUrl = "http://localhost:3000/memes";
const persistUrl = "http://localhost:3000/persist";
const form = document.getElementById("create-new-to-do");
const taskList = document.getElementById("tasks");
const darkModeToggle = document.getElementById("dark-mode-checkbox");
const dashboardContainer = document.querySelector(".dashboard-container");
const memeImage = document.getElementById("meme-image");
const randomMemeBtn = document.getElementById("random-meme-button");
const weatherForm = document.getElementById("weather-form");
const weatherDataContainer = document.getElementById("weather-data");
const weatherUrl = "http://api.weatherapi.com/v1" ;
const city = document.querySelector("#city");
const list = document.getElementById("tasks");


//Reads db.json to see should it start in dark mode or not
fetch(persistUrl)
  .then(response=>response.json())
  .then(data=>{if (data.darkmode.enabled) {
    dashboardContainer.classList.add("dark-mode")
    darkModeToggle.checked = true
  }})

// Dark Mode Toggle!
darkModeToggle.addEventListener("change", () => {
  let enabled
    if (darkModeToggle.checked) {
      dashboardContainer.classList.add("dark-mode");
      enabled = true
    } else {
      dashboardContainer.classList.remove("dark-mode");
      enabled = false
    }
    //Patch for dark mode persistence if toggled when page is refreshed
  fetch(persistUrl,{method: "PATCH", headers: {"Content-Type": "application/json"}, body: JSON.stringify({"darkmode": {"enabled": enabled}})})
  });

//Weather Widget
//Coding in the event listener for the weather form
//Create functions to fetch data from API
weatherForm.addEventListener("submit", (e) => {  
    e.preventDefault();
let query = encodeURI(e.target.city.value); 
fetchAndDisplayWeather(query)
});

function fetchAndDisplayWeather(query){
fetch(`http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${query}&aqi=no`)
.then(response => response.json())
.then(weather => {
  displayWeather(weather)
  displayWeatherIcon(weather.current.condition)
})
}


// Display weather data in the weather widget
function displayWeather(weather) {
  const temperature = weather.current.temp_f;
  const condition = weather.current.condition.text;

  const weatherOutput = `
    <h3>Weather in ${weather.location.name}</h3>
    <p>Temperature: ${temperature} °f</p>
    <p>Condition: ${condition}</p>
  `;

  weatherDataContainer.innerHTML = weatherOutput;
}

// Display the weather icon corresponding to the condition
function displayWeatherIcon(condition) {
  const iconContainer = document.getElementById("weather-icon");
  const weatherIconPath = encodeURI(condition.icon);

  if (weatherIconPath) {
    iconContainer.innerHTML = `<img src="${weatherIconPath}" alt="${condition.text}">`;
  } else {
    iconContainer.innerHTML = ""; // No icon available
  }
}

//All the following grabs the users location and automatically renders the weather
function initialGrabError(err) {
  console.warn(`ERROR(${err.code}): ${err.message}`);
}
function intialGrabSuccess(pos){
  fetchAndDisplayWeather(`${pos.coords.latitude},${pos.coords.longitude}`)
}
navigator.geolocation.getCurrentPosition(intialGrabSuccess, initialGrabError, {enableHighAccuracy: false, timeout: 5000, maximumAge: 0});

//To do form with delete button
form.addEventListener('submit', (event) => {
  event.preventDefault();
  const taskText = event.target["new-to-do"].value;
  if (taskText.trim() !== "") { // Check if the task is not empty or just spaces
    appendTask(taskText)
    saveTasksToLocalStorage(); // Save the task to local storage******************
    event.target.reset(); // Reset the form input
  }
});

function saveTasksToLocalStorage() {
  const tasks = Array.from(document.querySelectorAll(".task-text")).map(task => task.textContent);
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasksFromLocalStorage() {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.forEach(taskText => {
    appendTask(taskText)
  });
}

function removeTaskFromLocalStorage(taskText) {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || []; // Pulls info from localStorage
  const updatedTasks = tasks.filter(task => task !== taskText); // Filters out items wanted to be removed, puts new array into new variable
  localStorage.setItem("tasks", JSON.stringify(updatedTasks)); // Pushs new variable to localStorage
}

function appendTask(taskText) {
  const newLi = document.createElement("li");
  newLi.classList.add("task-item");
  newLi.innerHTML = `
    <span class="task-text">${taskText}</span>
    <span class="task-delete">X</span>
  `;
  
  // Add draggable attribute
  newLi.setAttribute('draggable', true);
  
  // Attach drag and drop event listeners
  newLi.addEventListener('dragstart', handleDragStart);
  newLi.addEventListener('dragover', handleDragOver);
  newLi.addEventListener('drop', handleDrop);
  newLi.addEventListener('dragend', handleDragEnd);
  
  list.appendChild(newLi);
}

// Define the drag and drop event handlers
function handleDragStart(event) {
  draggedItem = event.target;
  event.dataTransfer.effectAllowed = 'move';
  event.dataTransfer.setData('text/html', event.target.innerHTML);
}

function handleDragOver(event) {
  if (event.preventDefault) {
    event.preventDefault();
  }
  event.dataTransfer.dropEffect = 'move';
  return false;
}

function handleDrop(event) {
  if (event.stopPropagation) {
    event.stopPropagation();
  }

  if (draggedItem !== this) {
    draggedItem.innerHTML = this.innerHTML;
    this.innerHTML = event.dataTransfer.getData('text/html');
    saveTasksToLocalStorage()
  }

  return false;
}

function handleDragEnd() {
  draggedItem = null;
}

//Store tasks until manually deleted
window.addEventListener("load", loadTasksFromLocalStorage);
// Delete task from the list
taskList.addEventListener("click", (event) => {
  if (event.target.classList.contains("task-delete")) {
    const taskItem = event.target.parentElement;
    taskList.removeChild(taskItem);
    const taskText = taskItem.querySelector(".task-text").textContent;
    removeTaskFromLocalStorage(taskText);
  }
});

//Meme Widget 
// Fetch meme data and render images
let memeData = []; 

fetch(memesUrl)
  .then(response => response.json())
  .then(data => {
    memeData = data;
    renderAllImages(); // Render all meme images
    renderRandomImage(); // Render a random meme image initially
    randomMemeBtn.addEventListener("click", renderRandomImage); // Add click event listener
  })
  
//Render one random meme on page load
function renderRandomImage() {
    const randomIndex = Math.floor(Math.random() * memeData.length);
    const randomMeme = memeData[randomIndex];
    memeImage.src = randomMeme.path;
  }

function renderAllImages() {
  memeData.forEach(renderImage);
}
function renderImage(meme) {
    const img = document.createElement("img");
    img.src = meme.path;
    memeImage.appendChild(img);
  }

//Analog Clock
setInterval(()=>{
  currTime = new Date()
  hour = currTime.getHours()
  minute = currTime.getMinutes()
  second = currTime.getSeconds()
  hour_rotation = 30 * hour + minute / 2
  minute_rotation = 6 * minute
  second_rotation = 6 * second

  hour_hand.style.transform = `rotate(${hour_rotation}deg)`
  minute_hand.style.transform = `rotate(${minute_rotation}deg)`
  second_hand.style.transform = `rotate(${second_rotation}deg)`
}, 1000)