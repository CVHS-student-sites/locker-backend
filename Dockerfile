# Use an official Node.js runtime as a parent image
FROM node:18

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Expose the port that your app will run on (change as needed)
EXPOSE 3000

# Define the command to start your Node.js application
CMD ["npm", "run", "sync-prod"]

CMD ["npm", "run", "start-prod"]
