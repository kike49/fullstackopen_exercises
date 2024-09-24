import React, { useState, useEffect } from "react"
import axios from "axios"

const useField = (type) => {
  const [value, setValue] = useState("")
  const onChange = (event) => {
    setValue(event.target.value)
  }
  return {
    type,
    value,
    onChange
  }
}

const useCountry = (name) => {
  const [country, setCountry] = useState(null)

  useEffect(() => {
    const fetchCountry = async () => {
      if (name) {
        try {
          const response = await axios.get(
            `https://studies.cs.helsinki.fi/restcountries/api/name/${name}`
          )
          setCountry({ found: true, data: response.data })
        } catch (error) {
          setCountry({ found: false })
        }
      } else {
        setCountry(null)
      }
    }

    fetchCountry()
  }, [name])

  return country
}

const Country = ({ country }) => {
  if (!country) {
    return null
  }
  if (!country.found) {
    return <div className="container">Country not found...</div>
  }

  return (
    <div className="container">
      <h3>{country.data.name.common} </h3>
      <div className="container">Capital: {country.data.capital[0]} </div>
      <div className="container">Population: {country.data.population}</div>
      <img
        src={country.data.flags.png}
        height="100"
        alt={`flag of ${country.data.name.common}`}
      />
    </div>
  )
}

const App = () => {
  const nameInput = useField("text")
  const [name, setName] = useState("")
  const country = useCountry(name)
  const fetch = (e) => {
    e.preventDefault()
    setName(nameInput.value)
  }

  return (
    <div className="container">
      <form onSubmit={fetch}>
        <input {...nameInput} />
        <button>Find</button>
      </form>
      <Country country={country} />
    </div>
  )
}

export default App
