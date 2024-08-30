import { useState, useEffect } from "react"
import axios from 'axios'
import Search from "./components/Search"
import Country from "./components/Country"
import Weather from "./components/Weather"

function App() {
  const [newSearch, setSearch] = useState("")
  const [countries, setCountries] = useState([])
  const [selectedCountry, setSelectedCountry] = useState(null)
  const [weather, setWeather] = useState(null)

  // To get all the countries data
  useEffect(() => {
    console.log('Starting fetching data...')
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => {
        console.log('Data fetched')
        setCountries(response.data)
      })
      .catch(error => console.error('Error fetching data: ', error))
  }, [])

  const countriesToShow = newSearch
    ? countries.filter((country) =>
        country.name.common.toLowerCase().includes(newSearch.toLowerCase())
      )
    : countries

  // To get the data of the weather when the search is precise for one country
  useEffect(() => {
    if (countriesToShow.length === 1) {
      handleWeather(countriesToShow[0])
    }
  }, [countriesToShow])
    
  const handleSearch = (event) => {
    setSearch(event.target.value) // this sets the value of newSearch to the input value of the component Search
    setSelectedCountry(null) // hides the country info when the search parameter is gone
  }

  const handleShowCountry = (name) => {
    const encodedName = encodeURIComponent(name) // to avoid spaces in urls
    axios
      .get(`https://studies.cs.helsinki.fi/restcountries/api/name/${encodedName}`)
      .then(response => {
        const countryToShow = response.data
        setSelectedCountry(countryToShow)
        handleWeather(countryToShow)
      })
      .catch(error => console.error('Error fetching country data: ', error))
  }

  const handleWeather = (country) => {
    const apiKey = import.meta.env.VITE_WEATHER_API_KEY
    const [lat, lon] = country.capitalInfo.latlng
    axios
      .get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`)
      .then(response => {
        setWeather(response.data)
      })
      .catch(error => console.error('Error fetching weather data: ', error))
  }

  return (
    <div>
      <Search search={newSearch} handler={handleSearch} />
      {
        (countriesToShow.length === countries.length) ? (
          <p>Type to find countries</p>
        ) : (countriesToShow.length > 10) ? (
          <p>Too many matches ({countriesToShow.length}), specify more characters</p>
        ) : (countriesToShow.length === 0) ? (
          <p>No results, try another search</p>
        ) : (countriesToShow.length === 1) ? (
          <>
            <Country name={countriesToShow[0].name.common} capital={countriesToShow[0].capital} area={countriesToShow[0].area} languages={countriesToShow[0].languages} flags={countriesToShow[0].flags}/>
            {weather && (
              <Weather
                capital={countriesToShow[0].capital}
                temperature={weather.main.temp}
                icon={weather.weather[0].icon}
                wind={weather.wind.speed}
              />
            )}
          </>
        ) : (
          countriesToShow.map((country, index) => (
            <div key={index}>
              {country.name.common} <button onClick={() => handleShowCountry(country.name.common)}>Show</button>
            </div>
          ))
        )}
        {selectedCountry && weather && (
          <>
            <Country
            name={selectedCountry.name.common}
            capital={selectedCountry.capital}
            area={selectedCountry.area}
            languages={Object.values(selectedCountry.languages)}
            flags={selectedCountry.flags}
            />
            <Weather capital={selectedCountry.capital} temperature={weather.main.temp} icon={weather.weather[0].icon} wind={weather.wind.speed} />
          </>
        )}
    </div>
  )
}

export default App
