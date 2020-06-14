# official node.js runtime for Docker
FROM node:12
# Create and set the directory for this container
WORKDIR /app/
# Install Application dependencies
RUN npm install --no-optional
RUN npm install --save react react-dom react-scripts
# Copy over the rest of the project
COPY . /app/

# Set the default port for the container
EXPOSE 3000

CMD npm start