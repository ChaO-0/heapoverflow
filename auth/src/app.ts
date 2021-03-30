import express from 'express';
import 'express-async-errors';
import cookieSession from 'cookie-session';

import { NotFoundError, errorHandler, currentUser } from '@heapoverflow/common';
import { currentUserRouter } from './routes/current-user';
import { signinRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';
import { signupRouter } from './routes/signup';
import { banRouter } from './routes/ban';
import { unbanRouter } from './routes/unban';
import { updateUserRouter } from './routes/update';
import { indexRouter } from './routes/index';

const app = express();
app.set('trust proxy', true);
app.use(express.json());
app.use(
	cookieSession({
		signed: false,
		secure: process.env.NODE_ENV !== 'test',
	})
);

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

app.use(currentUser);
app.use(banRouter);
app.use(unbanRouter);
app.use(updateUserRouter);
app.use(indexRouter);

app.all('*', async (req, res) => {
	throw new NotFoundError();
});

app.use(errorHandler);

export { app };
