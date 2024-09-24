import express from "express";
import { calculateBmi } from "./bmiCalculator";
const app = express();

app.get("/hello", (_req, res) => {
  res.send("Hello Full Stack!");
});

app.get("/bmi", (req, res) => {
  const { height, weight } = req.query;
  if (!height || !weight || isNaN(Number(height)) || isNaN(Number(weight))) {
    return res.status(400).json({ error: "Malformatted parameters" });
  }

  const heightNum: number = Number(height);
  const weightNum: number = Number(weight);
  const bmi = calculateBmi(heightNum, weightNum);
  return res.json({
    "weight (kg)": weightNum,
    "height (cm)": heightNum,
    bmi: bmi
  });
});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
