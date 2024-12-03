# Digital Book API

This is a simple algorithm for a digital book API using MongoDB (NoSQL) and Express.js. The API allows users to register, login, and manage books and chapters for a digital book platform.

## Features

- **User Management:**
  - Register a new user
  - Login to the platform
  - Update user details
  - Logout from the platform

- **Book Management:**
  - Create a new book
  - List all books
  - View a specific book by ID
  - Update book details
  - Delete a book

- **Chapter Management:**
  - Create a new chapter for a book
  - List all chapters for a specific book
  - Update chapter details
  - Delete a chapter

## Tech Stack

- **Backend Framework:** Express.js
- **Database:** MongoDB (NoSQL)
- **Authentication:** JWT (JSON Web Token) and session-based tokens
- **Password Encryption:** bcrypt.js

## Setup and Installation

### Prerequisites

- **Node.js** (Version 14.x or later)
- **MongoDB** (Local or Remote, MongoDB Atlas recommended)

### Steps

1. Clone the repository:
    ```bash
    git clone https://github.com/dduuddeekk/simple-digital-book-api.git
    cd simple-digital-book-api
    ```

2. Install the dependencies:
    ```bash
    npm i bcrypt body-parser dotenv express jsonwebtoken mongoose
    npm i --save-dev nodemon
    ```

3. Create a `.env` file in the root of the project and define the following environment variables:
    ```
    PORT=5000
    MONGO_URL=your_mongodb_connection_url
    SECRET_KEY=your_secret_key_for_jwt
    ```

4. Start the server:
    ```bash
    npm start
    ```

    The server will be running on the specified port (default: `5000`).

## API Endpoints

### User Endpoints (`/api/user`)

- **POST /register**
  - Register a new user.
  - **Request Body:**
    ```json
    {
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com",
      "password": "securepassword"
    }
    ```

- **POST /login**
  - Login and receive a JWT token.
  - **Request Body:**
    ```json
    {
      "email": "john.doe@example.com",
      "password": "securepassword"
    }
    ```

- **PUT /update**
  - Update the user's information.
  - **Authorization:** Bearer token required.
  - **Request Body:**
    ```json
    {
      "firstName": "John",
      "lastName": "Smith"
    }
    ```

- **DELETE /logout**
  - Logout and invalidate the session token.
  - **Authorization:** Bearer token required.

### Book Endpoints (`/api/book`)

- **GET /** (List Books)
  - Get a list of all books.
  
- **POST /create**
  - Create a new book.
  - **Request Body:**
    ```json
    {
      "title": "Book Title",
      "author": "Author Name",
      "description": "Book description",
      "cover": "book_cover_url"
    }
    ```

- **GET /:id**
  - Get details of a specific book by ID.

- **POST /author**
  - Get all books authored by the logged-in user.
  - **Authorization:** Bearer token required.

- **DELETE /delete/:id**
  - Delete a book by ID.
  - **Authorization:** Bearer token required.

- **PUT /update/:id**
  - Update book details by ID.
  - **Authorization:** Bearer token required.
  - **Request Body:**
    ```json
    {
      "title": "Updated Book Title"
    }
    ```

### Chapter Endpoints (`/api/chapter`)

- **POST /create**
  - Create a new chapter for a book.
  - **Request Body:**
    ```json
    {
      "book": "book_id",
      "order": 1,
      "title": "Chapter 1",
      "content": "Chapter content here",
      "cover": "chapter_cover_url"
    }
    ```

- **GET /book=:id**
  - Get all chapters for a specific book by book ID.

- **PUT /update/:id**
  - Update chapter details by chapter ID.
  - **Authorization:** Bearer token required.

- **DELETE /delete/:id**
  - Delete a chapter by chapter ID.
  - **Authorization:** Bearer token required.

## Database Schema

- **User:**
  - `firstName`: string
  - `lastName`: string
  - `email`: string (unique)
  - `passwordHash`: string
  - `username`: string (generated)
  - `role`: string (`user`, `admin`)
  - `status`: string (`active`, `banned`)
  - `createdAt`: date
  - `updatedAt`: date

- **Book:**
  - `title`: string
  - `author`: string (user ID)
  - `description`: string
  - `cover`: string (URL)
  - `createdAt`: date
  - `updatedAt`: date

- **Chapter:**
  - `book`: ObjectId (referencing Book)
  - `order`: number
  - `title`: string
  - `content`: string
  - `cover`: string (URL)
  - `status`: string (`active`, `inactive`)
  - `createdAt`: date
  - `updatedAt`: date

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgements

- **Express.js** for building the web server.
- **MongoDB** for NoSQL database management.
- **bcrypt.js** for password hashing.
- **jsonwebtoken** for user authentication.
