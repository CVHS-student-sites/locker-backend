import { createUser, createLocker, createUserjoinLocker, getUser, getLocker, joinUsertoLocker } from "../controllers/user-locker.js";
import { ensureAuthenticated } from "./auth.js";

import express from 'express';

export const adminRouter = express.Router();


//get the users locker and data from student id
adminRouter.get('/lookup-user/:studentId', ensureAuthenticated, async (req, res) => {
  try {
    const studentId = req.params.studentId;

    const userData = await getUser(studentId);

    if (userData) {
      res.json(userData);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});
