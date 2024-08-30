const Weather = ({ capital, temperature, icon, wind }) => {
  return (
    <div>
      <h3>Weather in {capital}</h3>
      <p>Temperature: {temperature}º Celcius</p>
      <img src={`https://openweathermap.org/img/wn/${icon}@2x.png`} />
      <p>Wind speed: {wind} m/s</p>
    </div>
  )
}

export default Weather
