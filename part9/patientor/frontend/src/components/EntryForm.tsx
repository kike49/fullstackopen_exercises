import React, { useState, useEffect } from "react";
import { EntryFormValues, Diagnosis } from "../types";
import patientService from "../services/patients";
import { 
  TextField, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  Button, 
  Box,
  Chip,
  OutlinedInput
} from '@mui/material';

interface Props {
  patientId: string;
  onEntryAdded: () => void;
}

const EntryForm: React.FC<Props> = ({ patientId, onEntryAdded }) => {
  const [entryType, setEntryType] = useState<
    "HealthCheck" | "Hospital" | "OccupationalHealthcare"
  >("HealthCheck");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [specialist, setSpecialist] = useState("");
  const [diagnosisCodes, setDiagnosisCodes] = useState<string[]>([]);
  const [healthCheckRating, setHealthCheckRating] = useState<number>(0);
  const [dischargeDate, setDischargeDate] = useState("");
  const [dischargeCriteria, setDischargeCriteria] = useState("");
  const [employerName, setEmployerName] = useState("");
  const [sickLeaveStart, setSickLeaveStart] = useState("");
  const [sickLeaveEnd, setSickLeaveEnd] = useState("");
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);

  useEffect(() => {
    const fetchDiagnoses = async () => {
      try {
        const fetchedDiagnoses = await patientService.getDiagnoses();
        setDiagnoses(fetchedDiagnoses);
      } catch (error) {
        console.error("Error fetching diagnoses:", error);
      }
    };
    fetchDiagnoses();
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const baseEntry = {
      description,
      date,
      specialist,
      diagnosisCodes
    };

    let entryData: EntryFormValues;

    switch (entryType) {
      case "HealthCheck":
        entryData = {
          ...baseEntry,
          type: "HealthCheck",
          healthCheckRating
        };
        break;
      case "Hospital":
        entryData = {
          ...baseEntry,
          type: "Hospital",
          discharge: {
            date: dischargeDate,
            criteria: dischargeCriteria
          }
        };
        break;
      case "OccupationalHealthcare":
        entryData = {
          ...baseEntry,
          type: "OccupationalHealthcare",
          employerName,
          sickLeave:
            sickLeaveStart && sickLeaveEnd
              ? {
                  startDate: sickLeaveStart,
                  endDate: sickLeaveEnd
                }
              : undefined
        };
        break;
    }

    try {
      const newEntry = await patientService.createEntry(entryData, patientId);
      console.log("New entry created:", newEntry);
      resetForm();
      onEntryAdded();
    } catch (error) {
      console.error("Error creating entry:", error);
    }
  };

  const resetForm = () => {
    setEntryType("HealthCheck");
    setDescription("");
    setDate("");
    setSpecialist("");
    setDiagnosisCodes([]);
    setHealthCheckRating(0);
    setDischargeDate("");
    setDischargeCriteria("");
    setEmployerName("");
    setSickLeaveStart("");
    setSickLeaveEnd("");
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ '& .MuiTextField-root': { m: 1, width: '25ch' } }}>
      <FormControl fullWidth sx={{ m: 1 }}>
        <InputLabel id="entry-type-label">Entry Type</InputLabel>
        <Select
          labelId="entry-type-label"
          value={entryType}
          onChange={(e) => setEntryType(e.target.value as typeof entryType)}
          label="Entry Type"
        >
          <MenuItem value="HealthCheck">Health Check</MenuItem>
          <MenuItem value="Hospital">Hospital</MenuItem>
          <MenuItem value="OccupationalHealthcare">Occupational Healthcare</MenuItem>
        </Select>
      </FormControl>

      <TextField
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />

      <TextField
        label="Date"
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        InputLabelProps={{ shrink: true }}
        required
      />

      <TextField
        label="Specialist"
        value={specialist}
        onChange={(e) => setSpecialist(e.target.value)}
        required
      />

      <FormControl fullWidth sx={{ m: 1 }}>
        <InputLabel id="diagnosis-codes-label">Diagnosis Codes</InputLabel>
        <Select
          labelId="diagnosis-codes-label"
          multiple
          value={diagnosisCodes}
          onChange={(e) => setDiagnosisCodes(e.target.value as string[])}
          input={<OutlinedInput id="select-multiple-chip" label="Diagnosis Codes" />}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {(selected as string[]).map((value) => (
                <Chip key={value} label={value} />
              ))}
            </Box>
          )}
        >
          {diagnoses.map(diagnosis => (
            <MenuItem key={diagnosis.code} value={diagnosis.code}>
              {diagnosis.code} - {diagnosis.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {entryType === 'HealthCheck' && (
        <TextField
          label="Health Check Rating"
          type="number"
          InputProps={{ inputProps: { min: 0, max: 3 } }}
          value={healthCheckRating}
          onChange={(e) => setHealthCheckRating(Number(e.target.value))}
          required
        />
      )}

      {entryType === 'Hospital' && (
        <>
          <TextField
            label="Discharge Date"
            type="date"
            value={dischargeDate}
            onChange={(e) => setDischargeDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            required
          />
          <TextField
            label="Discharge Criteria"
            value={dischargeCriteria}
            onChange={(e) => setDischargeCriteria(e.target.value)}
            required
          />
        </>
      )}

      {entryType === 'OccupationalHealthcare' && (
        <>
          <TextField
            label="Employer Name"
            value={employerName}
            onChange={(e) => setEmployerName(e.target.value)}
            required
          />
          <TextField
            label="Sick Leave Start Date"
            type="date"
            value={sickLeaveStart}
            onChange={(e) => setSickLeaveStart(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Sick Leave End Date"
            type="date"
            value={sickLeaveEnd}
            onChange={(e) => setSickLeaveEnd(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </>
      )}

      <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
        Add Entry
      </Button>
    </Box>
  );
};

export default EntryForm;