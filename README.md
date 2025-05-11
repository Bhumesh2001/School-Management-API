# School Management API

This is a Node.js project for managing school data. The API allows you to add new schools and retrieve a list of schools sorted by proximity to a user-specified location. It uses Express.js for the server, MySQL for the database, and includes validation to ensure data integrity.

## Features

- **Add School**: Allows adding a new school with information such as name, address, latitude, and longitude.
- **List Schools**: Returns a list of schools sorted by proximity to a given latitude and longitude.
- **Proximity Calculation**: Uses the Haversine formula to calculate the distance between the user's location and schools in the database.

## Tech Stack

- **Node.js**: JavaScript runtime environment
- **Express.js**: Web framework for Node.js
- **MySQL**: Relational database management system
- **dotenv**: Loads environment variables from a `.env` file

## Requirements

- Node.js (>= 12.x)
- MySQL (>= 5.7)

## Setup

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/school-management-api.git
cd school-management-api
```

### 2. Install dependencies

Run the following command to install the necessary Node.js modules:

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory of the project and add the following values:

```plaintext
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=school_db
```

- **DB_HOST**: The MySQL server address (default is `localhost`).
- **DB_USER**: The MySQL username.
- **DB_PASSWORD**: The MySQL password for the user.
- **DB_NAME**: The database name (e.g., `school_db`).

### 4. Set up MySQL Database

Make sure MySQL is installed and running on your machine. If the database does not exist, the API will create it automatically.

You can also create the database manually using MySQL commands:

```sql
CREATE DATABASE IF NOT EXISTS school_db;
```

### 5. Start the Server

To start the server, run:

```bash
npm start || npm run dev
```

The server will start on port `3000` by default. You can change this by modifying the port in your `.env` file.

### 6. Test the APIs

You can test the APIs using **Postman** or any other API testing tool.

#### Add School API

- **Endpoint**: `/addSchool`
- **Method**: `POST`
- **Payload**:

```json
{
  "name": "Sample School",
  "address": "123 School St",
  "latitude": 40.712776,
  "longitude": -74.005974
}
```

- **Response**:

```json
{
  "message": "School added successfully",
  "id": 1
}
```

#### List Schools API

- **Endpoint**: `/listSchools`
- **Method**: `GET`
- **Parameters**:

```plaintext
latitude=40.712776&longitude=-74.005974
```

- **Response**:

```json
[
  {
    "id": 1,
    "name": "Sample School",
    "address": "123 School St",
    "latitude": 40.712776,
    "longitude": -74.005974,
    "distance": 0.0
  }
]
```

The list of schools will be sorted by proximity to the given latitude and longitude.

## Error Handling

- **400 Bad Request**: If required fields are missing or invalid.
- **500 Internal Server Error**: If there is a database or server error.

## Example Postman Collection

A Postman collection for testing both APIs is included in the `postman` folder. You can import this collection into Postman for easy testing of the APIs.

## Future Improvements

- Implement authentication for adding schools.
- Add pagination for the `listSchools` endpoint.
- Handle different units for distance (km, miles).
- Improve error handling and logging.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
