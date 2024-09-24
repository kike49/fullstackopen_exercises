import { useEffect, useState } from "react";
import { Diagnosis, Entry } from "../types";
import patientService from "../services/patients";
import { Box } from "@mui/material";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import HealingIcon from "@mui/icons-material/Healing";
import VaccinesIcon from "@mui/icons-material/Vaccines";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import CloseIcon from "@mui/icons-material/Close";

interface EntryDetailsProps {
  entries: Entry[] | undefined;
}

const EntryDetails: React.FC<EntryDetailsProps> = ({ entries }) => {
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);

  useEffect(() => {
    const getDiagnosesData = async () => {
      const diagnosesData = await patientService.getDiagnoses();
      setDiagnoses(diagnosesData);
    };
    getDiagnosesData();
  }, []);

  if (!entries || entries.length === 0) {
    return <div>No entries registered for this patient.</div>;
  }

  return (
    <>
      {entries?.map((entry) => {
        switch (entry.type) {
          case "HealthCheck":
            return (
              <Box
                key={entry.id}
                sx={{
                  padding: 2,
                  border: "1px solid #ccc",
                  borderRadius: 1,
                  margin: 2
                }}
              >
                <p>
                  Type: Health check <HealingIcon />
                </p>
                <p>Date: {entry.date}</p>
                <p>Description: {entry.description}</p>
                <p>
                  Health rate:
                  {entry.healthCheckRating === 0 ? (
                    <CloseIcon />
                  ) : (
                    [...Array(entry.healthCheckRating)].map((_, index) => (
                      <FavoriteBorderIcon key={index} />
                    ))
                  )}
                </p>
                <p>Diagnosed by {entry.specialist}</p>
              </Box>
            );

          case "Hospital":
            return (
              <Box
                key={entry.id}
                sx={{
                  padding: 2,
                  border: "1px solid #ccc",
                  borderRadius: 1,
                  margin: 2
                }}
              >
                <p>
                  Type: Hospital <LocalHospitalIcon />
                </p>
                <p>Date: {entry.date}</p>
                <p>Description: {entry.description}</p>
                <ul>
                  {entry.diagnosisCodes?.map((code, index) => {
                    const diagnosis = diagnoses.find((d) => d.code === code);
                    return (
                      <li key={index}>
                        {code} - {diagnosis?.name}
                      </li>
                    );
                  })}
                </ul>
                <p>
                  Discharge: {entry.discharge.criteria} on{" "}
                  {entry.discharge.date}
                </p>
                <p>Diagnosed by {entry.specialist}</p>
              </Box>
            );

          case "OccupationalHealthcare":
            return (
              <Box
                key={entry.id}
                sx={{
                  padding: 2,
                  border: "1px solid #ccc",
                  borderRadius: 1,
                  margin: 2
                }}
              >
                <p>
                  Type: Occupational <VaccinesIcon />
                </p>
                <p>
                  Sick leave period: {entry.sickLeave?.startDate} to{" "}
                  {entry.sickLeave?.endDate}
                </p>
                <ul>
                  {entry.diagnosisCodes?.map((code, index) => {
                    const diagnosis = diagnoses.find((d) => d.code === code);
                    return (
                      <li key={index}>
                        {code} - {diagnosis?.name}
                      </li>
                    );
                  })}
                </ul>
                <p>Employer: {entry.employerName}</p>
                <p>Diagnosed by {entry.specialist}</p>
              </Box>
            );
          default:
            return (
              <Box
                sx={{
                  padding: 2,
                  border: "1px solid #ccc",
                  borderRadius: 1,
                  margin: 2
                }}
              >
                Then entry type {entry.type} does not match our template
              </Box>
            );
        }
      })}
    </>
  );
};

export default EntryDetails;
