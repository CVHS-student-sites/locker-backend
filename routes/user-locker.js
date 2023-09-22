import { createUser, createLocker, createUserjoinLocker, getUser, getLocker, joinUsertoLocker } from "../controllers/user-locker.js";

import express from 'express';

export const userlockerRouter = express.Router();


//get the users locker
userlockerRouter.get('/lookup-user/:studentId', async (req, res) => {
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


//get the users locker
userlockerRouter.get('/lookup-locker/:lockerNumber', async (req, res) => {
  try {
    const lockerNumber = req.params.lockerNumber;

    const lockerData = await getLocker(lockerNumber);

    if (lockerData) {
      res.json(lockerData);
    } else {
      res.status(404).json({ error: 'Locker not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});