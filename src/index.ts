import express, { Application, Request, Response } from 'express';
import { graphQLServer } from './graphql';

const app: Application = express();
const port = 5000;

app.use('/rest', (req: Request, res: Response) => {
  res.status(200).send({ data: 'Hello World!' });
});

// Bind GraphQL Yoga to `/graphql` endpoint
// Here it takes the request and response objects and handles them internally
app.use('/graphql', graphQLServer.requestListener);

// Start server
// eslint-disable-next-line no-console
app.listen(port, () => console.log(`Server is listening on port ${port}!`));
