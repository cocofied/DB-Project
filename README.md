README

# Catering Service Application

This project is a full-stack web application for managing catering services. It includes customer and company functionality, with features like booking, reviews, and company management.

## Table of Contents
1. Project Overview)
2. Features
3. Technology Stack
4. Setup Instruction
5. Usage
6. Deployment
7. Contributors

## Project Overview
This application allows customers to:
- Sign up and log in.
- Book catering services.
- Leave reviews for services.

Catering companies can:
- Manage their profiles.
- View and manage bookings.

The database is hosted on AWS RDS, and the application is deployed on Render.

## Features
- User authentication with JWT.
- CRUD operations for bookings and reviews.
- Dynamic data loading via AJAX.

## Technology Stack
- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Node.js, Express.js
- **Database:** MySQL (AWS RDS)
- **Hosting:** Render

## Setup Instructions
1. **Clone the Repository:**
   ```bash
2.	Install Dependencies:
npm install
3.	Set Up Environment Variables: Create a .env file in the root directory with the following:
DB_HOST=your-db-host
DB_USER=your-db-user
DB_PASSWORD=your-db-password
DB_NAME=your-db-name
JWT_SECRET=your-secret
4.	Run the Server:
nodemon server.js 
node server.js
5.	Access the Application: Open http://localhost:3000 in your browser.
Usage
•	Navigate to homepage.html to choose customer or company functionalities.
•	Use customer.html for booking and reviewing services.
•	Begin the navigating
Deployment
•	Backend: Hosted on Render.
•	Database: AWS RDS MySQL.
•	Frontend: Deployed alongside the backend on Render.
### # AWSDBUPDATE ### holds the file download from AWS for the DB we are using, it is just so Dr.Z can view it if necessary
