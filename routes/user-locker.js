import { createUser, createLocker, createUserjoinLocker, getUser, getLocker, joinUsertoLocker } from "../controllers/user-locker.js";

import express from 'express';

export const userlockerRouter = express.Router();


userlockerRouter.get('/lookuplocker/:studentId', async (req, res) => {
    try {
      // Get the locker number from the request parameters
      const studentId = req.params.studentId;
  
      // Assuming you have some database or data source to look up locker information
      // Replace the following with your actual data retrieval logic
      const lockerData = await getUser(studentId);
  
      // Send the locker data as JSON response
      if (lockerData) {
        // Send the locker data as JSON response if it exists
        res.json(lockerData);
      } else {
        // Send an error status code (e.g., 404 Not Found) and an error message as JSON response
        res.status(404).json({ error: 'User not found' });
      }
    } catch (error) {
      // Handle any errors that occur during the data retrieval or processing
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  