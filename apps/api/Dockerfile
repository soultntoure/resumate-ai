# Use an official Node.js runtime as a parent image
FROM node:18-alpine

# Set the working directory to /app
WORKDIR /app

# Copy package.json and yarn.lock (if using Yarn)
COPY package.json yarn.lock* ./ # Copy current package.json and yarn.lock

# Install app dependencies
# Make sure to install from the monorepo root if running `yarn install` from there
# For simplicity, assuming the api's package.json is sufficient for its dependencies
RUN yarn install --frozen-lockfile --production

# Copy the rest of the application code
COPY . .

# Build the NestJS application
RUN yarn build

# Expose the port the app runs on
EXPOSE 3001

# Run the application
CMD ["yarn", "start:prod"]
