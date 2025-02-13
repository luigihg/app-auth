# My Auth App

This is a full-stack authentication application built with Next.js (frontend) and Express.js (backend). It allows users to register, login, and access a protected dashboard.

## Features

  * User registration with email, password, and name.
  * Secure password hashing using bcrypt.
  * Login with email and password.
  * JWT (JSON Web Token) authentication for protected routes.
  * Protected user profile/dashboard accessible only after login.

## Technologies Used

  * **Frontend:** Next.js 13 (App Router)
  * **Backend:** Express.js
  * **Database:** PostgreSQL
  * **Styling:** Tailwind CSS
  * **Authentication:** JWT (jsonwebtoken)
  * **Other:** bcrypt, express-validator, pg (PostgreSQL client)

## Prerequisites

Before running the application, ensure you have the following installed:

  * **Node.js and npm (or yarn):**  You can download them from [https://nodejs.org/](https://www.google.com/url?sa=E&source=gmail&q=https://nodejs.org/).
  * **PostgreSQL:** You can install it locally or use a Docker container.
  * **create table** in the folder sql you can run sql for create table users

## Local Setup

1.  **Clone the repository:**

    ```bash
    git clone <YOUR_REPOSITORY_URL>
    ```

2.  **Install dependencies:**

      * **Backend:**
        ```bash
        cd server  
        npm install
        ```
      * **Frontend:**
        ```bash
        cd frontend
        npm install
        ```

3.  **Set up environment variables:**

      * Create a `.env` file in the `server` directory and add the following, replacing the values with your PostgreSQL credentials:
        ```
        POSTGRES_USER=your_postgres_user
        POSTGRES_PASSWORD=your_postgres_password
        POSTGRES_DB=your_postgres_db_name
        POSTGRES_HOST=localhost  
        POSTGRES_PORT=5432
        ```

4.  **Start the backend server:**

    ```bash
    cd server
    npm start 
    ```

    This will start the Express.js server on `http://localhost:3001`.

5.  **Start the frontend development server:**

    ```bash
    cd frontend
    npm run dev
    ```

    This will start the Next.js development server on `http://localhost:3000`.

## Docker Setup (Recommended)

1.  **Make sure you have Docker and Docker Compose installed.**

2.  **Navigate to the project root directory** in your terminal.

3.  **Build and run the Docker containers:**

    ```bash
    docker-compose up -d 
    ```

    This will build the images and start the containers for both the frontend (Next.js) and backend (Express.js), as well as a PostgreSQL database.

4.  **Access the application:**
    Open your browser and go to `http://localhost:3000`.

## Usage

1.  **Register:** Create a new account using the registration form (`/registro`).
2.  **Login:** Log in with your registered email and password (`/login`).
3.  **Access Dashboard:** Once logged in, you'll be redirected to the dashboard (`/dashboard`), which is a protected route accessible only with a valid JWT.

## Additional Notes

  * The backend server runs on port 3001 (or the port specified in your Docker Compose file).
  * The frontend development server runs on port 3000.
  * The application uses a PostgreSQL database. Make sure it's running and accessible to the backend.
  * You can modify the environment variables in the `.env` file to match your configuration.
  * To stop the Docker containers, use `docker-compose down`.

## Contributing

Contributions are welcome\! Feel free to open an issue or submit a pull request.

## License

This project is licensed under the MIT License.