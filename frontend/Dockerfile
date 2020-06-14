# official node.js runtime for Docker
FROM node:12
# Create and set the directory for this container
WORKDIR /app/
# Install Application dependencies
RUN yarn install --no-optional
# Copy over the rest of the project
COPY . /app/

# Set the default port for the container
EXPOSE 3000

CMD yarn start