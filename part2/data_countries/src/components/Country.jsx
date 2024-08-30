const Country = ({ name, capital, area, languages, flags }) => {
  return (
    <div>
      <h1>{name}</h1>
      <p>Capital: {capital}</p>
      <p>Area: {area} km²</p>
      <h4>Language(s):</h4>
      <ul>
        {Object.values(languages).map((lang, index) => (
          <li key={index}>{lang}</li>
        ))}
      </ul>
      <img src={flags.png} alt={flags.alt || `Flag of ${name}`} width="100" />
    </div>
  )
}

export default Country
