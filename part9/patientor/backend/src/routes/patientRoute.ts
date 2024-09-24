import express, { NextFunction, Request, Response } from "express";
import patientService from "../services/patientService";
import { NewEntry, NewPatient, Patient, SensitivePatient } from "../types";
import { z } from "zod";
import { NewEntrySchema, NewPatientSchema } from "../utils";

const router = express.Router();

router.get("/", (_req: any, res: Response<SensitivePatient[]>) => {
  console.log("GET /api/patient hit");
  res.send(patientService.getSensitivePatient());
});

router.get("/:id", (req, res: Response<Patient>) => {
  console.log("GET /api/patient/id hit");
  const patient = patientService.getOnePatient(req.params.id);
  if (patient) {
    res.send(patient);
  } else {
    res.sendStatus(404);
  }
});

const NewPatientParser = (req: Request, _res: Response, next: NextFunction) => {
  try {
    NewPatientSchema.parse(req.body);
    next();
  } catch (error: unknown) {
    next(error);
  }
};

const NewEntryParser = (req: Request, _res: Response, next: NextFunction) => {
  try {
    NewEntrySchema.parse(req.body);
    next();
  } catch (error: unknown) {
    next(error);
  }
};

const errorMiddleware = (
  error: unknown,
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error instanceof z.ZodError) {
    res.status(400).send({ error: error.issues });
  } else {
    next(error);
  }
};

router.post(
  "/",
  NewPatientParser,
  (req: Request<unknown, unknown, NewPatient>, res: Response<Patient>) => {
    console.log("POST /api/patient/ hit");
    const addedPatient = patientService.addPatient(req.body);
    res.json(addedPatient);
  }
);

router.post(
  "/:id/entries",
  NewEntryParser,
  (
    req: Request<{ id: string }, unknown, NewEntry>,
    res: Response<Patient | undefined>
  ) => {
    console.log("POST /api/patient/id/entries hit");
    const { id } = req.params;
    const addedEntry = patientService.addEntry(req.body, id);
    if (addedEntry) {
      res.status(201).json(addedEntry);
    } else {
      console.error(`Patient with ID ${id} not found`);
      res.status(404)
    }
  }
);

router.use(errorMiddleware);

export default router;
