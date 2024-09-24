import express from "express";
import { exerciseCalculator } from "./exerciseCalculator";
const app = express();

app.use(express.json());

app.get("/hello", (_req, res) => {
  res.send("Hello Full Stack!");
});

app.post("/exercises", (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { target, daily_exercises }: { target: string; daily_exercises: string[] } =
    req.body;
  if (target === undefined || daily_exercises === undefined) {
    return res.status(400).json({ error: "Parameters missing" });
  }
  if (
    isNaN(Number(target)) ||
    !Array.isArray(daily_exercises) ||
    daily_exercises.some((value: string) => isNaN(Number(value)))
  ) {
    return res.status(400).json({ error: "Malformatted parameters" });
  }
  const targetNum: number = Number(target);
  const exerciseHoursNum: number[] = daily_exercises.map((value: string) =>
    Number(value)
  );

  const exerciseReport = exerciseCalculator(targetNum, exerciseHoursNum);
  return res.json({
    exerciseReport
  });
});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
