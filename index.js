// Constant variables
const memesUrl = "http://localhost:3000/memes"
const presistUrl = "http://localhost:3000/presist"
const form = document.getElementById("create-new-to-do");
const taskList = document.getElementById("tasks");
const darkModeToggle = document.getElementById("dark-mode-checkbox");
const dashboardContainer = document.querySelector(".dashboard-container");
const memeImage = document.getElementById("meme-image")
const randomMemeBtn = document.getElementById("random-meme-button")
const weatherForm = document.getElementById("weather-form")
const weatherDataContainer = document.getElementById("weather-data")
const weatherUrl = "http://api.weatherapi.com/v1" 
const city = document.querySelector("#city")

fetch(presistUrl)
  .then(response=>response.json())
  .then(data=>console.log(data))

// Dark Mode Toggle!
darkModeToggle.addEventListener("change", () => {
    if (darkModeToggle.checked) {
      dashboardContainer.classList.add("dark-mode");
    } else {
      dashboardContainer.classList.remove("dark-mode");
    }
  });

//Weather Widget
//Coding in the event listener for the weather form
//Create functions to fetch data from API
weatherForm.addEventListener("submit", (e) => {  
    e.preventDefault();
let query = encodeURI(e.target.city.value); 
fetch(`http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${query}&aqi=no`)
.then(response => response.json())
.then(weather => {
  displayWeather(weather)
  displayWeatherIcon(weather.current.condition)
})
});


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

//To do form with delete button
form.addEventListener('submit', (event) => {
  event.preventDefault();
  const taskText = event.target["new-to-do"].value;
  if (taskText.trim() !== "") { // Check if the task is not empty or just spaces
    const list = document.getElementById("tasks");
    const newLi = document.createElement("li");
    newLi.classList.add("task-item"); // Apply the task-item class
    newLi.innerHTML = `
      <span class="task-text">${taskText}</span>
      <span class="task-delete">X</span>
    `;
    list.appendChild(newLi);
    event.target.reset(); // Reset the form input
  }
});

// Delete task from the list
taskList.addEventListener("click", (event) => {
  if (event.target.classList.contains("task-delete")) {
    const taskItem = event.target.parentElement;
    taskList.removeChild(taskItem);
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