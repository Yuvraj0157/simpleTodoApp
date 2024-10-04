# TodoApp

### Home
![image](https://github.com/Yuvraj0157/simpleTodoApp/assets/82658229/145b7d75-98cb-43c6-a0fd-7834f219f254)

### Login
![image](https://github.com/Yuvraj0157/simpleTodoApp/assets/82658229/e34c8de7-ef84-48e1-b8cc-cdfc0ded57c9)

### Forgot Password
![image](https://github.com/Yuvraj0157/simpleTodoApp/assets/82658229/b3557722-886b-437f-8069-51a54726dc2b)

### Reset Email
![image](https://github.com/Yuvraj0157/simpleTodoApp/assets/82658229/60324b16-4257-43b1-a5de-ac349d2025b3)

### Register
![image](https://github.com/Yuvraj0157/simpleTodoApp/assets/82658229/c088be75-22c5-473a-86b9-765675066eed)

### Todo App
![image](https://github.com/Yuvraj0157/simpleTodoApp/assets/82658229/247d0035-f768-4fcb-a7c0-8c5cf4ba48a9)


## Prerequisites
Make sure you have the following tools installed:

### Node.js
### MySQL
### Git

## Quick Start/Contributing
```
# Fork the Repository
Fork the repository by clicking the "Fork" button at the top right of the GitHub page.

# Clone
git clone https://github.com/Yuvraj0157/simpleTodoApp.git

# Install
npm i

# Create a database named todos_db on your local MySQL server. Make sure to use the same credentials(Host, User, Password, Port) in the .env file

# Set .env file with these variables
PORT = 
DBHOST = 
DBUSER = 
DBPASSWORD = YOUR_PSSWD
DBNAME = todos_db

JWT_SECRET = random_jwt_secret
JWT_EXPIRY = 7d

JWT_RESET_PASSWORD = random_jwt_secret
EXPIRY_RESET_PASSWORD = 15m

SESSION_SECRET = random_secret

# Start
npm start

# Create a New Branch:
Create a new branch for your changes. It’s good practice to name your branch descriptively:
git checkout -b my-feature-branch

# Make Changes:
Implement your changes.
Test thoroughly to ensure everything works as expected.

# Commit Changes:
After making the necessary changes, commit them with a clear and descriptive message:
git commit -m "Add feature XYZ"

# Push Changes to GitHub:
Push your changes to your forked repository:
git push origin my-feature-branch

# Create a Pull Request:
Go to the original repository.
Click on the "Pull Requests" tab, and then click on "New Pull Request".
Select your branch and create a pull request.
Provide a clear description of the changes you have made and reference the corresponding issue (if applicable).

```

## Tech Stack
Frontend: HTML, CSS, JS, EJS

Backend: Nodejs, Expressjs

Database: MySQL/Sequelize


## Features
#### 👤 SignUp, SignIn, and Logout User with token-based authentication

#### 🔑 Reset User Password through Email

#### 🔤 User Input Validation and Feedback

#### ➕ Add : Enter a todo and press enter or click the **Add**. New todos are added to **Todo List**.

#### ✔️ Toggle : Click the ☐ <small>or</small> ☑ on the left of each todo to set it to complete or incomplete. Completed todos will be moved to **Done**.

#### ❌ Delete : Click the **Delete** on the right of each todo to delete it.
