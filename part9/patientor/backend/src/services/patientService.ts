import patientData from "../../data/patients-full";
import { Patient, SensitivePatient, NewPatient, NewEntry, Entry } from "../types";
import { v1 as uuid } from "uuid";

const patients: Patient[] = patientData;

const getPatient = (): Patient[] => {
  return patients;
};

const getSensitivePatient = (): SensitivePatient[] => {
  return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation
  }));
};

const getOnePatient = (id: string): Patient | undefined => {
  const patientFound = patients.find((p) => p.id === id);
  return patientFound;
};

const addPatient = (entry: NewPatient): Patient => {
  const newId = uuid();
  const newPatient = {
    id: newId,
    ...entry,
    entries: []
  };
  patients.push(newPatient);
  return newPatient;
};

const addEntry = (entry: NewEntry, id: string): Patient | undefined => {
  const newId = uuid();
  const newEntryToAdd: Entry = {
    id: newId,
    ...entry
  } as Entry;
  const patientFound = patients.find((p) => p.id === id);
  patientFound?.entries?.push(newEntryToAdd);
  return patientFound;
};

export default {
  getPatient,
  addPatient,
  getSensitivePatient,
  getOnePatient,
  addEntry
};
