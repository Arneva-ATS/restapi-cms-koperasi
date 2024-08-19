import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import apiRouter from './routes/apiRoutes';
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());

// Set Port Server
const PORT = process.env.PORT;
if (!PORT) {
  console.log(`No port value specified...`)
}

// Use the apiRouter with the base path /api
app.use('/v1/rki-cms', apiRouter);
app.get('/', (req, res) => {
    res.send('Welcome to the Arneva REST API!');
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Listen Port
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});