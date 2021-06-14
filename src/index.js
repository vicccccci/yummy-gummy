function formatDate(datetime) {
  let apinow = new Date(datetime)
  let date = apinow.getDate()
  let hours = apinow.getHours()
  let minutes = apinow.getMinutes()
  if (hours < 10) {
    hours = `0${hours}`
  }
  if (minutes < 10) {
    minutes = `0${minutes}`
  }

  let days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  let day = days[apinow.getDay()]

  let months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ]
  let month = months[apinow.getMonth()]

  return `${month} ${date}, ${day}, ${hours}:${minutes}`
}

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000)
  let day = date.getDay()
  let days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

  return days[day]
}


function displayForecast(response) {
  let forecast = response.data.daily

  let forecastElement = document.querySelector('#forecast')

  let forecastHTML = `<div class="row">`
  forecast.forEach(function (forecastDay, index) {
    if (index < 6) {
      forecastHTML =
        forecastHTML +
        `
        <div class="col-2">
        <div class="weather-forecast-date">${formatDay(
                  forecastDay.dt,
                )}</div>
        <img
          src="http://openweathermap.org/img/wn/${
            forecastDay.weather[0].icon
            }@2x.png"
                 
            alt=""
            width="40"
            />
    <div class="weather-forecast-temperatures">
        <span class="weather-forecast-temperature-max"> ${Math.round(
          forecastDay.temp.max,
          )}°
          </span>
          <span class="weather-forecast-temperature-min"> ${Math.round(
          forecastDay.temp.min,
          )}°
          </span>
    </div>
    </div>
              `
    }
  })

  forecastHTML = forecastHTML + `</div>`
  forecastElement.innerHTML = forecastHTML
}

async function getForecast() {
  let apiUrl = 'https://api.neurocode.ai/v1/weather'
  const { city } = await axios
    .get('https://api.neurocode.ai/v1/location')
    .then(({ data }) => data)

  return axios.get(apiUrl).then((resp) => displayTemperature(city, resp))
}

async function displayTemperature(city, response) {
  let temperatureElement = document.querySelector('#temperature')
  let cityElement = document.querySelector('#city')
  let descriptionElement = document.querySelector('#description')
  let humidityElement = document.querySelector('#humidity')
  let windElement = document.querySelector('#wind')
  let dateElement = document.querySelector('#date')
  let iconElement = document.querySelector('#icon')

  celsiusTemperature = response.data.current.temp


  cityElement.innerHTML = city
  descriptionElement.innerHTML = response.data.current.weather[0].description
  temperatureElement.innerHTML = Math.round(response.data.current.temp)
  humidityElement.innerHTML = response.data.current.humidity
  windElement.innerHTML = Math.round(response.data.current.wind_speed)

  dateElement.innerHTML = formatDate(response.data.current.dt * 1000)
  iconElement.setAttribute(
    'src',
    `http://openweathermap.org/img/wn/${response.data.current.weather[0].icon}@2x.png`,
  )
  iconElement.setAttribute('alt', response.data.current.weather[0].description)

  displayForecast(response)
}

function search(city) {

  let apiUrl = `https://api.neurocode.ai/v1/weather?city=${city}`
  axios.get(apiUrl).then((resp) => displayTemperature(city, resp))
}

function handleSubmit(event) {
  event.preventDefault()
  let cityInputElement = document.querySelector('#city-input')

  // when we submit the form
  search(cityInputElement.value)
}

function displayFahrenheitTemperature(event) {
  event.preventDefault()
  let temperatureElement = document.querySelector('#temperature')

  
  celsiusLink.classList.remove('active')
  fahrenheitLink.classList.add('active')
  let fahrenheiTemperature = (celsiusTemperature * 9) / 5 + 32
  temperatureElement.innerHTML = Math.round(fahrenheiTemperature)
}

function displayCelsiusTemperature(event) {
  event.preventDefault()
  celsiusLink.classList.add('active')
  fahrenheitLink.classList.remove('active')
  let temperatureElement = document.querySelector('#temperature')
  temperatureElement.innerHTML = Math.round(celsiusTemperature)
}
let celsiusTemperature = null

let form = document.querySelector('#search-form')
form.addEventListener('submit', handleSubmit)

let fahrenheitLink = document.querySelector('#fahrenheit-link')
fahrenheitLink.addEventListener('click', displayFahrenheitTemperature)

let celsiusLink = document.querySelector('#celsius-link')
celsiusLink.addEventListener('click', displayCelsiusTemperature)
getForecast()