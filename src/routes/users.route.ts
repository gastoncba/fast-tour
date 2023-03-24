import express, { Request , Response} from 'express'

import { UsersService } from '../services/usersservice';

export const router = express.Router()
const usersService = new UsersService();

router.get('/', async (req:Request, res: Response) => {
  try {
    const user = await usersService.find()
    res.json(user)
  } catch (error) {
    console.log(error)
  }

});
