import { useState } from "react"

const Button = (props) => <button onClick={props.onClick}>{props.text}</button>

const Title = (props) => <h1>{props.title}</h1>

const Statistics = ({ good, neutral, bad, total, points }) => {
  if (total > 0) {
    return (
      <table>
        <tbody>
          <StatisticLine text="Good" value={good} />
          <StatisticLine text="Neutral" value={neutral} />
          <StatisticLine text="Bad" value={bad} />
          <StatisticLine text="Total" value={total} />
          <StatisticLine text="Average score" value={points / total} />
          <StatisticLine text="Positive feedback" value={(good / total) * 100} symbol={"%"}/>
        </tbody>
      </table>
    )
  } else {
    return (
      <>
        <p>No feedback given</p>
      </>
    )
  }
}

const StatisticLine = ({ text, value, symbol }) => (
    <tr>
      <td>{text}:</td>
      <td>{value} {symbol}</td>
    </tr>
)

function App() {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const [total, setTotal] = useState(0)
  const [points, setPoints] = useState(0)

  const handleFeedback = (type) => {
    if (type === "good") {
      setGood(good + 1)
      setPoints(points + 1)
    }
    if (type === "neutral") setNeutral(neutral + 1)
    if (type === "bad") {
      setBad(bad + 1)
      setPoints(points - 1)
    }
    setTotal(total + 1)
  }

  return (
    <div>
      <Title title="Give feedback here" />
      <Button onClick={() => handleFeedback("good")} text="Good" />
      <Button onClick={() => handleFeedback("neutral")} text="Neutral" />
      <Button onClick={() => handleFeedback("bad")} text="Bad" />
      <Title title="Statistics" />
      <Statistics
        good={good}
        neutral={neutral}
        bad={bad}
        total={total}
        points={points}
      />
    </div>
  )
}

export default App
