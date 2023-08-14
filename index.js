// To-do form with delete button
const memesUrl = "http://localhost:3000/memes"
const form = document.getElementById("create-new-to-do");
const taskList = document.getElementById("tasks");
const darkModeToggle = document.getElementById("dark-mode-checkbox");
const dashboardContainer = document.querySelector(".dashboard-container");
const memeImage = document.getElementById("meme-image")
const randomMemeBtn = document.getElementById("random-meme-button")
const apiKey = "af7f90aef268477a84d182200231108"
const weatherUrl = "https://www.weatherapi.com/"
const weatherForm = document.getElementById("weather-form")
const weatherDataContainer = document.getElementById("weather-data")

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

// Dark Mode Toggle!
darkModeToggle.addEventListener("change", () => {
  if (darkModeToggle.checked) {
    dashboardContainer.classList.add("dark-mode");
  } else {
    dashboardContainer.classList.remove("dark-mode");
  }
});

let memeData = [];

// Fetch meme data and render images
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

//Coding in the event listener for the weather form
//Create functions to fetch data from API
weatherForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const city = event.target["city"].value;

  if (city.trim() !== "") {
    fetchWeather(city);
  }
});

function fetchWeather(city) {
  const apiUrl = `${weatherUrl}?key=${apiKey}&q=${city}&aqi=no`;

  fetch(apiUrl)
    .then(response => response.json())
    .then(weather => {  
      displayWeather(weather);
    })
    .catch(error => {
      console.error("Error fetching weather data:", error);
      weatherDataContainer.innerHTML = "Error fetching weather data.";
    });
}
//display the weather 
function displayWeather(weatherData) {
  const temperature = weatherData.current.temp_c;
  const condition = weatherData.current.condition.text;

  const weatherOutput = `
    <h3>Weather in ${weatherData.location.name}</h3>
    <p>Temperature: ${temperature} &#8451;</p>
    <p>Condition: ${condition}</p>
  `;

  weatherDataContainer.innerHTML = weatherOutput;
}