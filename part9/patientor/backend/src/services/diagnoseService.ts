import diagnosesData from "../../data/diagnoses";
import { Diagnose } from "../types";

const diagnoses: Diagnose[] = diagnosesData;

const getDiagnose = (): Diagnose[] => {
  return diagnoses;
};

const addDiagnose = () => {
  return null;
};

export default {
  getDiagnose,
  addDiagnose
};
