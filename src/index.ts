import "reflect-metadata"
import express, { Request, Response } from 'express';
import cors from 'cors'

import { routerApi } from './routes';
import { logError, errorHandler, boomErrorHandler} from './middleware/error.handler';
import { appDataSource } from "./database/database";
import { config } from "./config/config";

appDataSource.initialize()
  .then(() => console.log("Conexion exitosa"))
  .catch((err) => console.log("Error de conexion ", err))

const app = express();
const port = config.port;

app.use(express.json())
app.use(cors())

app.get('/', (req:Request, res: Response) => {
  res.send('Hola mi server express');
});

routerApi(app)

app.use(logError)
app.use(boomErrorHandler)
app.use(errorHandler)

app.listen(port, () => {});
