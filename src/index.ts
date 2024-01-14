import "reflect-metadata"
import express, { Request, Response } from 'express';
import cors from 'cors'

import { routerApi } from './routes';
import { logError, errorHandler, boomErrorHandler} from './middleware/error.handler';
import { appDataSource } from "./database/database";
import { config } from "./config/config";

(async () => {
  try {
    await appDataSource.initialize();
    console.log("Conexión exitosa!");
  } catch (error) {
    console.log("Error en la conexión:", error);
  }
})();

const app = express();
const port = config.port;

app.use(express.json())
app.use(cors())

app.get('/', (req:Request, res: Response) => {
  res.send('API REST Fast Tour');
});

routerApi(app)
app.use(logError)
app.use(boomErrorHandler)
app.use(errorHandler)

app.listen(port, () => {});
