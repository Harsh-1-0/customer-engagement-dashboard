# Customer Engagement Dashboard

## Project Structure

This project consists of two main sections:

1. **Front-end**
2. **Back-end**

---

## Backend Setup

1. Open a new terminal.
2. Navigate to the backend directory:
   ```sh
   cd backend
   ```
3. Create a `.env` file in the backend directory and add the MongoDB connection string:
   ```sh
   DATABASE_URL=<Mongo Connection String>
   ```
4. Install dependencies:
   ```sh
   npm install
   ```
5. Start the backend server:
   ```sh
   npm start
   ```

---

## Frontend Setup

1. Open a new terminal.
2. Navigate to the frontend directory:
   ```sh
   cd frontend
   ```
3. Install dependencies:
   ```sh
   npm install
   ```
4. Start the development server:
   ```sh
   npm run dev
   ```
5. Open your browser and go to:
   ```
   http://localhost:5173
   ```
   Here, you can see the website running.

---

## Additional Notes

- Ensure that both backend and frontend servers are running simultaneously.
- If you encounter any issues, check the `.env` file and verify that the MongoDB connection string is correct.
- Modify the `.env` file based on your development or production environment needs.
