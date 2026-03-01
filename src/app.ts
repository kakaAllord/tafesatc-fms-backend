import express, { Request, Response } from 'express';
import cors from "cors";



//Routes Imports
import familyRoutes from './routes/Family'
import courseRoutes from './routes/Course';
import authRoutes from './routes/auth';
import userRoutes from './routes/User';
import attendanceRoutes from './routes/Attendance';
import adminRoutes from './routes/Admin';
import verseRoutes from './routes/Verse';




const app = express();

app.use(express.json());
// enabling CORS
app.use(cors({
  origin: [
    "http://localhost:5122",
    "http://localhost:5124",
    "https://tafesatcfamily.vercel.app",
    "https://fmstafesatc.vercel.app"
  ],
  methods: ["GET","POST","PUT","DELETE", "PATCH"],
  credentials: true
}));



// testing the server
app.get("/ping", (req: Request, res: Response) => {
    res.send("pong");
});



attendanceRoutes(app);
// courseRoutes(app);

userRoutes(app);
familyRoutes(app);
courseRoutes(app);
authRoutes(app);
adminRoutes(app);
verseRoutes(app);

export default app;