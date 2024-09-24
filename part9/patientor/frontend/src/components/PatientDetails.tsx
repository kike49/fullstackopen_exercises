import React, { useEffect, useState } from "react";
import { Patient } from "../types";
import patientService from "../services/patients";
import { useParams } from "react-router-dom";
import { Typography, Box, Icon } from "@mui/material";
import FemaleIcon from "@mui/icons-material/Female";
import MaleIcon from "@mui/icons-material/Male";
import PsychologyAltIcon from "@mui/icons-material/PsychologyAlt";
import EntryDetails from "./EntryDetails";
import EntryForm from "./EntryForm";

const PatientDetails: React.FC = () => {
  const [patient, setPatient] = useState<Patient | undefined>(undefined);
  const { id } = useParams<{ id: string }>();

  const fetchPatient = async () => {
    if (id) {
      const patientToShow = await patientService.getOne(id);
      setPatient(patientToShow);
    }
  };

  useEffect(() => {
    fetchPatient();
  }, [id]);

  const handleEntryAdded = () => {
    fetchPatient();
  };

  if (!patient) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box mt={3}>
      <Typography variant="h4" gutterBottom>
        {patient.name}
        <Icon component={
          patient.gender === "male" ? MaleIcon :
          patient.gender === "female" ? FemaleIcon :
          PsychologyAltIcon
        } />
      </Typography>
      <Typography>SSN: {patient.ssn}</Typography>
      <Typography>Occupation: {patient.occupation}</Typography>
      <Typography>Date of Birth: {patient.dateOfBirth}</Typography>
      <Typography>ID: {patient.id}</Typography>
      
      <Box mt={4}>
        <Typography variant="h5" gutterBottom>Add Entry</Typography>
        <EntryForm patientId={patient.id} onEntryAdded={handleEntryAdded} />
      </Box>
      
      <Box mt={4}>
        <Typography variant="h5" gutterBottom>Entries</Typography>
        <EntryDetails entries={patient.entries} />
      </Box>
    </Box>
  );
};

export default PatientDetails;