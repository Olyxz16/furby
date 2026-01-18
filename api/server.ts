import express from 'express';
import cookieParser from 'cookie-parser';
import { agendaRouter } from '@/agenda/agenda.controller';
import { authRouter } from '@/auth/auth.controller';
import { checkAuthenticatedUser } from './middlewares/session.middleware';

export const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/agendas", checkAuthenticatedUser, agendaRouter);

app.use("/auth/magic-link", checkAuthenticatedUser);
app.use("/auth/logout", checkAuthenticatedUser);
app.use("/auth", authRouter);
