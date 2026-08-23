# SkillPath – Personalized Learning Roadmap Generator

## Project Overview

SkillPath is a personalized learning roadmap generator designed to help students plan and organize their learning journey.
The user can select a learning goal, current skill level, study time, and purpose. Based on these selections, the system generates a structured learning roadmap with relevant topics.
Users can view their roadmaps, mark topics as completed, track their learning progress, and delete roadmaps when they are no longer needed.

## Problem Statement

Students often know which skill they want to learn but do not know what topics they should learn first or what they should learn next.
SkillPath solves this problem by generating a structured learning roadmap based on the user's selected goal and level.

## Main Features

- User Registration
- User Login
- Personalized Learning Roadmap Generation
- Goal-Based and Level-Based Topics
- Dashboard for User Roadmaps
- Progress Tracking
- Topic Completion
- View Roadmap
- Delete Roadmap
- MongoDB Database Storage
- REST API Communication
- Responsive User Interface

## Technologies Used

### Frontend
- HTML
- CSS
- JavaScript

### Backend
- Node.js
- Express.js

### Database
- MongoDB
- Mongoose

### Other
- Fetch API
- REST APIs
- Visual Studio Code
- GitHub

## How the Project Works

1. The user opens the SkillPath application.
2. The user registers or logs into an account.
3. The user selects a learning goal.
4. The user selects their current level.
5. The user provides study time and purpose.
6. JavaScript sends the information to the backend using a Fetch API request.
7. Express.js processes the request.
8. The backend generates suitable roadmap topics according to the selected goal and level.
9. The roadmap is stored in MongoDB.
10. The roadmap is displayed on the user's dashboard.
11. The user can mark topics as completed to track progress.
12. The user can delete a roadmap when needed.

## Database

MongoDB is used to store user and roadmap data.
A roadmap contains information such as:

- User ID
- Goal
- Level
- Study Time
- Purpose
- Topics
- Topic Completion Status

MongoDB automatically provides a unique `_id` for each roadmap document.

## Progress Tracking

Each roadmap contains topics with a completion status.
When the user checks a topic, its completion status is updated and the progress percentage is recalculated.
This allows users to easily track how much of their learning roadmap has been completed.

## How to Run the Project

1.Open the skill study roadmap generator folder in VS Code.
2.Open the terminal.
3.Install the required packages: npm install 
4.Start the server: node server.js
5.Open the skill study roadmap website in a browser: http://localhost:3000