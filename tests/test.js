// import {createUser, validateUser, getId, getUser, getUserfromId} from '../controllers/admin.js'
// let user = await createUser('birdpump','test')
// // let user = await getUser('test');
// // let user = await validateUser('birdpump', 'test')
// console.log(user);


import {sequelize} from "../config/sequelize.js";
import {User} from "../models/user.js";
import {Locker} from "../models/locker.js"; // Import your Locker model

// // Create a new user
// const newUser = await User.create({
//   studentId: 415641,
//   name: "bob Doe",
//   email: "johshtn@example.com",
//   // Add any other user attributes as needed
// });

// // Create a new locker
// const newLocker = await Locker.create({
//   lockerNumber: "73-14!",
//   location: "7000",
//   // Add any other locker attributes as needed
// });

// // Assign the user to the locker
// await newUser.setLocker(newLocker);

// console.log("User and Locker have been created and associated.");


// import { User } from "./user.js"; // Import the User model
// import { Locker } from "./locker.js"; // Import the Locker model

// // Create a new user
// User.create({
//   studentId: 415631,
//   name: "John Doe",
//   email: "john@example.com",
//   // Add any other user attributes as needed
// })
//   .then((newUser) => {
//     // Retrieve an existing locker by its ID (replace lockerId with the actual ID)
//     const lockerId = 1; // Replace with the actual locker ID
//     return Locker.findByPk(lockerId)
//       .then((existingLocker) => {
//         if (!existingLocker) {
//           throw new Error("Locker not found.");
//         }

//         // Associate the user with the existing locker
//         return newUser.setLocker(existingLocker)
//           .then(() => {
//             console.log("User has been created and added to the existing locker.");
//           });
//       });
//   })
//   .catch((error) => {
//     console.error("Error:", error);
//   });


// Assuming you have the user's ID in the variable userId
const userId = 415631; // Replace with the actual user ID you want to query

// Query the user by ID and include the associated locker


// // Assuming you have the locker number in the variable lockerNumber
// const lockerNumber = "123A"; // Replace with the actual locker number you want to query

// // Query the locker by locker number and include the associated users
// Locker.findOne({
//   where: {
//     lockerNumber: lockerNumber,
//   },
//   include: {
//     model: User, // Include the User model
//   },
// })
//   .then((locker) => {
//     if (locker) {
//       // Access the locker's users through the association
//       const lockerUsers = locker.Users;
//       console.log("Locker's users:", lockerUsers);
//     } else {
//       console.log("Locker not found.");
//     }
//   })
//   .catch((error) => {
//     console.error("Error:", error);
//   });
