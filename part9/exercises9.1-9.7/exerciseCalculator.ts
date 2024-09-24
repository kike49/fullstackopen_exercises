interface ExerciseReport {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number;
}

interface exerciseCalculatorInput {
  target: number;
  exerciseHoursArray: number[];
}

const parseArgsExerciseCalculator = (
  args: string[]
): exerciseCalculatorInput => {
  if (args.length < 3) throw new Error("Not enough arguments");
  if (args.length > 10) throw new Error("Too many arguments");

  if (!isNaN(Number(args[2]))) {
    const exerciseHoursInput: string[] = args.slice(3);
    const exerciseHoursInputNumber: number[] = [];
    for (const n of exerciseHoursInput) {
      exerciseHoursInputNumber.push(Number(n));
    }
    return {
      target: Number(args[2]),
      exerciseHoursArray: exerciseHoursInputNumber
    };
  } else {
    throw new Error("Provided values were not numbers");
  }
};

export const exerciseCalculator = (
  target: number,
  exerciseHours: number[]
): ExerciseReport => {
  const trainingDays: number = exerciseHours.filter((h) => h !== 0).length;
  const totalHours: number = exerciseHours.reduce((acc, cur) => acc + cur, 0);
  const dailyHours: number = totalHours / exerciseHours.length ;
  let achieved: boolean = false;
  if (dailyHours >= target) {
    achieved = true;
  }
  let score: number = 0;
  let scoreMessage: string = "";
  if (dailyHours < target) {
    score = 1;
    scoreMessage = "Need to do better next time";
  } else if (dailyHours >= 0.5 && dailyHours < 2) {
    score = 2;
    scoreMessage = "Not bad, but can improve";
  } else if (dailyHours >= target) {
    score = 3;
    scoreMessage = "Excellent work";
  }
  return {
    periodLength: exerciseHours.length,
    trainingDays: trainingDays,
    success: achieved,
    rating: score,
    ratingDescription: scoreMessage,
    target: target,
    average: dailyHours
  };
};

if (require.main === module) {
  try {
    const { target, exerciseHoursArray } = parseArgsExerciseCalculator(
      process.argv
    );
    console.log(exerciseCalculator(target, exerciseHoursArray));
  } catch (error: unknown) {
    let errorMessage = "An error occurred...";
    if (error instanceof Error) {
      errorMessage += " Error: " + error.message;
    }
    console.log(errorMessage);
  }
}
