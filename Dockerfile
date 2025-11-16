# Use a base Node.js image
FROM node:14

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files to the working directory
COPY . .

# Expose the port that your Nest.js application is listening on
EXPOSE 3000

# Specify the command to start your Nest.js application
CMD ["npm", "run", "start:dev"]