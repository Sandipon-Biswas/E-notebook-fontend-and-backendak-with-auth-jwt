import 'dotenv/config'
import express from 'express';

import cors from 'cors';
import connectToMongo from './database/db.js';

import auth from './routes/auth.js';
import notes from './routes/notes.js';


connectToMongo();

const app =express();
const port = 5000;
//* middleware
app.use(express.json())
app.use(cors())
//* Available routes
app.use('/api/auth', auth );
app.use('/api/notes', notes );

app.get('/', (req, res) => {
  res.send('Hello');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  console.log("JWT_SECRET:", process.env.JWT_SECRET); //// test if working
});