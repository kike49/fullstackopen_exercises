import { useEffect, useState } from "react";
import { createDiary, getAllDiaries } from "./diaryService";
import { DiaryEntry, NewDiaryEntry, Visibility, Weather } from "./type";

function App() {
  const [diaries, setDiaries] = useState<DiaryEntry[]>([]);
  const [date, setDate] = useState("");
  const [visibility, setVisibility] = useState<Visibility | "">("");
  const [weather, setWeather] = useState<Weather | "">("");
  const [comment, setComment] = useState("");
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    getAllDiaries().then((data) => setDiaries(data));
  }, []);

  const diaryCreation = (event: React.SyntheticEvent) => {
    event.preventDefault();
    setErrorMessage("")
    const newDiary: NewDiaryEntry = {
      date: date,
      weather: weather as Weather,
      visibility: visibility as Visibility,
      comment: comment
    };
    try {
      createDiary(newDiary).then((data) => {
        setDiaries(diaries.concat(data));
        setDate("");
        setVisibility("");
        setWeather("");
        setComment("");
      })
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      }
    }
  };

  return (
    <div>
      <h2>Log an entry</h2>
      {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
      <form onSubmit={diaryCreation}>
        <label htmlFor="date">Date:</label>
        <input
          type="date"
          id="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <fieldset>
          <legend>Weather:</legend>
          <div>
            <input
              type="radio"
              id="sunny"
              name="weather"
              value="sunny"
              onChange={(e) => setWeather(e.target.value as Weather)}
              checked={weather === "sunny"}
            />
            <label htmlFor="sunny">Sunny</label>
            <input
              type="radio"
              id="rainy"
              name="weather"
              value="rainy"
              onChange={(e) => setWeather(e.target.value as Weather)}
              checked={weather === "rainy"}
            />
            <label htmlFor="rainy">Rainy</label>
            <input
              type="radio"
              id="cloudy"
              name="weather"
              value="cloudy"
              onChange={(e) => setWeather(e.target.value as Weather)}
              checked={weather === "cloudy"}
            />
            <label htmlFor="cloudy">Cloudy</label>
            <input
              type="radio"
              id="stormy"
              name="weather"
              value="stormy"
              onChange={(e) => setWeather(e.target.value as Weather)}
              checked={weather === "stormy"}
            />
            <label htmlFor="stormy">Stormy</label>
            <input
              type="radio"
              id="windy"
              name="weather"
              value="windy"
              onChange={(e) => setWeather(e.target.value as Weather)}
              checked={weather === "windy"}
            />
            <label htmlFor="windy">Windy</label>
          </div>
        </fieldset>
        <fieldset>
          <legend>Visibility:</legend>
          <div>
            <input
              type="radio"
              id="good"
              name="visibility"
              value="good"
              onChange={(e) => setVisibility(e.target.value as Visibility)}
              checked={visibility === "good"}
            />
            <label htmlFor="good">Good</label>
            <input
              type="radio"
              id="great"
              name="visibility"
              value="great"
              onChange={(e) => setVisibility(e.target.value as Visibility)}
              checked={visibility === "great"}
            />
            <label htmlFor="great">Great</label>
            <input
              type="radio"
              id="ok"
              name="visibility"
              value="ok"
              onChange={(e) => setVisibility(e.target.value as Visibility)}
              checked={visibility === "ok"}
            />
            <label htmlFor="ok">Ok</label>
            <input
              type="radio"
              id="poor"
              name="visibility"
              value="poor"
              onChange={(e) => setVisibility(e.target.value as Visibility)}
              checked={visibility === "poor"}
            />
            <label htmlFor="poor">Poor</label>
          </div>
        </fieldset>
        <label htmlFor="comment">Comments:</label>
        <input
          type="text"
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <br />
        <br />
        <button type="submit">Add entry</button>
      </form>

      <h2>Diary entries</h2>
      {diaries.map((d) => (
        <div id={String(d.id)}>
          <b>{d.date}</b>
          <p>Visibility: {d.visibility}</p>
          <p>Weather: {d.weather}</p>
          <hr />
        </div>
      ))}
    </div>
  );
}

export default App;
