# First stage - create the base layer
FROM no de:16.0.0-alpine as base

# Set the non-root user
USER node

# Create and set the working directory and set non-root user as owner
RUN mkdir /home/node/app && chown -R node:node /home/node/app
WORKDIR /home/node/app

# Second stage - build environment and apply permissions
FROM base as builder

# Copy the required source and configuration to set up the build
COPY --chown=node:node      \
    package.json            \
    tsconfig.json           \
    ./
COPY --chown=node:node src ./src

# Execute the NPM install
RUN npm install && npm cache clean --force --loglevel=error

# Third stage - setup and run environment
FROM base

EXPOSE 3000

# Set the port the web server will listen on
ARG PORT=8080
ENV PORT $PORT

# Set the node environment, either development or production
# Defaults to production, compose overrides this to development on build and run
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

# Only copy the config, built artifacts and node_modules from the first stage to reduce the container size
COPY --chown=node:node ./config ./config
COPY --from=builder /home/node/app/build ./build
COPY --from=builder /home/node/app/node_modules ./node_modules

# Expose the port as set
EXPOSE $PORT

# Do not encapsulate in NPM commands in order to receive / handle process signals
CMD [ "node", "./build/index.js" ]