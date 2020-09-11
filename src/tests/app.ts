import express, { Application } from 'express';
import { authenticate, use, initialize, Strategy } from 'passport';
import { EnvAuthStrategy, VerifyFunction } from '../lib';

const port = 8082;

const userIdEnvVariableName = 'USER';
const envVariables = [userIdEnvVariableName, 'LC_CTYPE', 'LANG'];

const app: Application = express();

const verifyFn: VerifyFunction = (verifyEnvVariables, done) => {
  console.log('have user data found', verifyEnvVariables);
  return !verifyEnvVariables[userIdEnvVariableName] ? done(null) : done(null, { id: verifyEnvVariables.USER });
};

const createStrategy = (): Strategy => new EnvAuthStrategy({ envVariables }, verifyFn);

use(createStrategy());

app.use(initialize());

app.get('/auth/env-auth', authenticate('env-auth', { session: false }), (req, res) => {
  res.send({ status: 'ok', user: req.user });
});

app.get('/', (req, res) => {
  res.send({ hello: 'world' });
});

app.get('/current-user', (req, res) => {
  res.send(req.user);
});

app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

app.get('/cookies', (req, res) => {
  res.send(req.cookies);
});

app.listen(port, () => {
  console.log(`Test app listening at http://localhost:${port}`);
});
