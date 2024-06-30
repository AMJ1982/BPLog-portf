# BPLog
![](/front/public/logo192.png)

### Description

BPLog is a service for saving and compiling statistics of blood pressure readings. The user can browse their history of entries in a list view, modify and remove entries, or display monthly data as a line chart. These lists and charts can also be converted into PDF documents.


### Technologies

This project is created as a full stack development exercise. It's built on a Node.js server with RESTful API connecting to a MongoDB database. The server conforms to MVC architechture providing endpoints for the client via controllers, using models for structuring the data objects stored to the database, and serving a build version of the front-end as static content.

The ReactJS-based front-end utilizes Redux library for state management, and communicates with the server using Axios client. No frameworks such as Bootstrap are used; the responsive UI is manually styled and controlled in a basic CSS-file. Being a progressive web app, BPLog acts like a platform-specific application, allowing it to be installed for example on Android and Windows devices, just like native applications. A WorkBox service worker is also running in the background managing asset caching for offline content.

The server side of this project resides in the root directory of the repository, whereas the client side is located in the 'front' folder. When the 'build:ui' script defined in package.json file of the back-end is run, a production build of the front-end is created and copied to the 'build' folder in the back-ends root directory.

Finally a Docker image of the stack with production dependencies only is created, and run as a Docker container in fly.io.


![NPM](https://img.shields.io/badge/NPM-%23CB3837.svg?style=for-the-badge&logo=npm&logoColor=white)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Redux](https://img.shields.io/badge/redux-%23593d88.svg?style=for-the-badge&logo=redux&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
