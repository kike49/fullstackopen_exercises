import express from 'express';
import cors from "cors"
const app = express();
import diaryRoutes from './routes/diariesRoutes';
app.use(express.json());

const PORT = 3000;

app.use(cors({
  origin: 'http://localhost:5173'
}));

app.get('/ping', (_req, res) => {
  console.log('someone pinged here');
  res.send('pong');
});

app.use('/api/diaries', diaryRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}, try to access: http://localhost:${PORT}/api/diaries`);
});