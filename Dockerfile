# Specify the base image
FROM node:14-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Install the app's dependencies
RUN npm install

# Copy the rest of the app's source code to the container
COPY . .

# Expose the port that the app will listen on
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
