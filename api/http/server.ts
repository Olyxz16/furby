import express from 'express';
import cookieParser from 'cookie-parser';
import { router } from 'agenda/agenda.controller';
const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/agendas", router);
