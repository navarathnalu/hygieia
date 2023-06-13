FROM node:14

# Create app directory and permissions
WORKDIR /usr/src/app

#Copy dependencies files
COPY package*.json ./

#Install dependencies
RUN npm install

# Bundle app source
COPY . .

#Expose port
EXPOSE 2000

#Run the application
ENTRYPOINT [ "node", "server.js" ]