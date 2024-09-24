import express from "express";
import cors from "cors";
import diagnoseRouter from "./routes/diagnoseRoute";
import patientRouter from "./routes/patientRoute";
const app = express();
app.use(express.json());

app.use(cors({ origin: "http://localhost:5173" }));

const PORT = 3001;

// app.get("/api/ping", (_req, res) => {
//   console.log("Ping endpoint hit");
//   res.send("pong");
// });

app.use("/api/diagnoses", diagnoseRouter);

app.use("/api/patients", patientRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
