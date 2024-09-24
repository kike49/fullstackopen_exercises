// For validation in patientRoutes.ts

import { z } from "zod";
import { Gender, Diagnose } from "./types";

const BaseEntrySchema = z.object({
  id: z.string(),
  description: z.string(),
  date: z.string().date(),
  specialist: z.string(),
  diagnosisCodes: z.array(z.string()).optional()
});

const HealthCheckEntrySchema = BaseEntrySchema.extend({
  type: z.literal("HealthCheck"),
  healthCheckRating: z.nativeEnum({
    Healthy: 0,
    LowRisk: 1,
    HighRisk: 2,
    CriticalRisk: 3
  })
});

const HospitalEntrySchema = BaseEntrySchema.extend({
  type: z.literal("Hospital"),
  discharge: z.object({
    date: z.string().date(),
    criteria: z.string()
  })
});

const OccupationalHealthcareEntrySchema = BaseEntrySchema.extend({
  type: z.literal("OccupationalHealthcare"),
  employerName: z.string(),
  sickLeave: z
    .object({
      startDate: z.string().date().optional(),
      endDate: z.string().date().optional()
    })
    .optional()
});

const EntrySchema = z.union([
  HealthCheckEntrySchema,
  HospitalEntrySchema,
  OccupationalHealthcareEntrySchema
]);

const NewHealthCheckEntrySchema = HealthCheckEntrySchema.omit({ id: true });
const NewHospitalEntrySchema = HospitalEntrySchema.omit({ id: true });
const NewOccupationalHealthcareEntrySchema =
  OccupationalHealthcareEntrySchema.omit({ id: true });

export const NewEntrySchema = z.union([
  NewHealthCheckEntrySchema,
  NewHospitalEntrySchema,
  NewOccupationalHealthcareEntrySchema
]);

export const NewPatientSchema = z.object({
  name: z.string(),
  dateOfBirth: z.string().date(),
  ssn: z.string(),
  gender: z.nativeEnum(Gender),
  occupation: z.string(),
  entries: z.array(EntrySchema).optional().default([])
});

export const parseDiagnosisCodes = (object: unknown): Array<Diagnose["code"]> => {
  if (!object || typeof object !== "object" || !("diagnosisCodes" in object)) {
    return [] as Array<Diagnose["code"]>;
  }
  return object.diagnosisCodes as Array<Diagnose["code"]>;
};
