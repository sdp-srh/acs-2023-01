# Cloud Application - ACS 2023 
This repository will contain the microservice including a UI for Google Cloud Platform

## Folders/Projects
### soccer 
contains the express soccer app
several endpoints with different http methods
includes the access to google firestore
contains a vue dashboard app based on vue paper dashboard


### soccer functions
contains Google Cloud Functions for reading data from an external web services
saves the data to firestore

### testsrv
contains some test services
translation service with an html page, that uses google translate
google-trends service that uses big query to read the last trends from google
contains a basic vue app


## Installation
Prerequisites: node.js is installed
Clone the repository in an empty folder (e.g. with GitHubDesktop)

Open a command prompt: cmd

navigate into the folder

run: npm install

run: node index.js

Open the test.http or app.http file

try some of the http commands
