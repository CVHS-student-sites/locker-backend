# cvhs-locker-backend

What to do for dev setup:
1. clone repo
2. run ```npm i``` to install the node modules
3. open sequelize.js in the config folder and make sure dev db is uncommented and comment out prod db
4. cd into tools and run sync-db.js this will create the local database
5. in the same tools folder run test.js to create a testing user on the loal dev db
6. cd into the root of the project and run ```node app.js``` to start the backend server



nodemon --watch "**/*.js" --ext "js" app.js