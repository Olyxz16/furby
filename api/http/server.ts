import express from 'express';
import cookieParser from 'cookie-parser';
import { agendaRouter } from 'agenda/agenda.controller';
import { authRouter } from 'auth/auth.controller';
import { config } from 'config/config';
const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/agendas", agendaRouter);
app.use("/auth", authRouter);

app.listen(config.PORT);
