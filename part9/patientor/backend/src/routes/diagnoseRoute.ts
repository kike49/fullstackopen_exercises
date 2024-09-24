import express, { Response } from "express";
import diagnoseService from "../services/diagnoseService";
import { Diagnose } from "../types";

const router = express.Router();

router.get("/", (_req: any, res: Response<Diagnose[]>) => {
  console.log("GET /api/diagnoses hit");
  res.send(diagnoseService.getDiagnose());
});

router.post("/", (_req: any, res: { send: (arg0: string) => void }) => {
  console.log("POST /api/diagnoses hit");
  res.send("Saving a diagnose!");
});

export default router;
