# cvhs-locker-backend

### Todo
- validate async operation

### What to do for dev setup:
1. clone repo
2. run ```npm i``` to install the node modules
3. run ```npm run sync-dev``` to create and sync the local dev db
4. run ```npm run start-dev``` to start the backend with the dev db



### What to do for production setup:
1. clone repo
2. run ```npm i``` to install the node modules
3. verify env var is set for mysql password
4. run ```npm run sync-prod``` to syc the production db
5. run ```npm run start-prod``` to start the backend for production


set enviorment variables: ```export USERNAME= && export PASSWORD=```

```nodemon --watch "**/*.js" --ext "js" app.js```

sudo docker run -d --name watchtower -v /var/run/docker.sock:/var/run/docker.sock containrrr/watchtower -i 60 locker-backend


build docker: ```docker build -t cvhs-locker-backend .```

run: ```docker run --name locker-backend -d -p 3000:3000 cvhs-locker-backend```
