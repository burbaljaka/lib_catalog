# official node.js runtime for Docker
FROM node:latest
# Create and set the directory for this container
WORKDIR /app/
COPY . /app/
# Install Application dependencies
RUN npm install -g react-scripts
RUN npm install -g axios
RUN npm install -g bootstrap
RUN npm install
# Copy over the rest of the project


# Set the default port for the container
EXPOSE 3000

CMD npm start