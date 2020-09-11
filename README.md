# passport-env

Passportjs authentication strategy based on OS/pod/container enviroment variables.

As example on macosx you always has ${USER} set to current user name.

## How to use

```typescript
import { EnvAuthStrategy, VerifyFunction } from '@nazarkulyk/passport-env';

const userIdEnvVariableName = 'USER';
const envVariables = [userIdEnvVariableName];

const verifyFn: VerifyFunction = (verifyHeaders, done) => {
    const id = verifyHeaders[userIdEnvVariableName];
  return !id ? done(null) : done(null, { id });
};

const createStrategy = (): Strategy => new EnvAuthStrategy({ envVariables }, verifyFn);
```

Than i your Express Routes:

```typescript
app.get('/auth/env-auth', authenticate('env-auth', { session: false }), (req, res) => {
  res.send({ authenticated: true, user: req.user });
});
```
