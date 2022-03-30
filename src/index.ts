import 'dotenv/config';
import express, { Application, Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import { graphQLServer } from './graphql';
import { getNewTokens } from './rest/me';

const app: Application = express();
const port = process.env.PORT || 5000;

// cookie parser
app.use(cookieParser());

app.use('/rest', (req: Request, res: Response) => {
  res.status(200).send({ data: 'Hello World!' });
});

app.use('/me', getNewTokens);

// Bind GraphQL Yoga to `/graphql` endpoint
// Here it takes the request and response objects and handles them internally
app.use('/graphql', graphQLServer.requestListener);

// Start server
// eslint-disable-next-line no-console
app.listen(port, () => console.log(`Server is listening on port ${port}!`));
