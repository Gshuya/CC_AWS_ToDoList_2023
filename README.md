# AWS To-Do List Cloud Computing Project
This repository contains the source code and documentation for an AWS-based To-Do List application, leveraging cloud computing capabilities. The project aims to showcase the implementation of a scalable and reliable to-do list system using various AWS services.

# Introduction
Task management is an essential method for increasing productivity and reducing stress levels for individuals, enabling them to achieve their goals. Therefore, the goal of my project is to develop a scalable web application called "To-do List" that provides users with a convenient tool to organize their tasks. The web application will offer the following basic functionalities:
User registration,Task uploading,Task filtering, Task deletion.

# Architecture
The application is built using a serverless architecture pattern, utilizing several AWS services. The core components of the architecture include:
1. Front-End
   - **Amazon S3** : The S3 bucket serves as an object storage service for hosting websites developed using HTML, CSS, and JavaScript.
2. Back-End
   - **Amazon API Gateway**: To handle the routing.
   - **AWS Lambda**:  Each Lambda function built using **Node.js** is responsible for a specific functionality of the web application. 
3. Storage
   - **Amazon DynamoDB**

# Test 
Due to the serverless nature of the application, testing the scalability or performance of the lightweight front-end is meaningless. Therefore, my focus was on testing the back-End. For this purpose, I utilized **Artillery** (https://www.artillery.io/docs) and **AWS Cloudwatch**.
