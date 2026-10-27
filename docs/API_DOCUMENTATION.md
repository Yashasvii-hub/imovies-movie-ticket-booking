# 🎬 IMovies API Documentation

Welcome to the **IMovies — Movie Ticket Booking Made Simple** REST API reference. This document specifies all available endpoints, required headers, query parameters, request payloads, and standard JSON response envelopes.

---

## Base URLs
- **Local Development**: `http://localhost:5000/api`
- **Production Server**: Configurable via `FRONTEND_URL` & `PORT`

---

## Authentication & Authorization
IMovies uses **JSON Web Tokens (JWT)**.
To access protected endpoints, include the token in the `Authorization` HTTP header:
```http
Authorization: Bearer <your_jwt_token>
```

### User Roles
- `user`: Standard registered customer who can browse movies, lock seats, book tickets, and manage their personal bookings.
- `admin`: Cinema administrator with full CRUD access to movies, theaters, showtimes, user accounts, and platform analytics.

---

## Standard Response Format

All responses follow a predictable JSON envelope:
```json
{
  "success": true,
  "message": "Human-readable status summary (optional)",
  "data": { ... }
}
```

Error responses:
```json
{
  "success": false,
  "message": "Specific error explanation"
}
```

---

## 1. Authentication Endpoints (`/api/auth`)

### 1.1 Register New User
- **Method**: `POST`
- **Endpoint**: `/api/auth/register`
- **Access**: Public
- **Request Body**:
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "Password123!",
  "phone": "+91 9876543210"
}
```
- **Response `201 Created`**:
```json
{
  "success": true,
  "message": "Account registered successfully.",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "66a100000000000000000002",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "role": "user",
    "phone": "+91 9876543210"
  }
}
```

### 1.2 User Login
- **Method**: `POST`
- **Endpoint**: `/api/auth/login`
- **Access**: Public
- **Request Body**:
```json
{
  "email": "admin@imovies.com",
  "password": "AdminPass123!"
}
```
- **Response `200 OK`**:
```json
{
  "success": true,
  "message": "Logged in successfully.",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "66a100000000000000000001",
    "name": "Yashasvi Admin",
    "email": "admin@imovies.com",
    "role": "admin"
  }
}
```

### 1.3 Get Current User Profile
- **Method**: `GET`
- **Endpoint**: `/api/auth/me`
- **Access**: Private (Bearer Token)
- **Response `200 OK`**:
```json
{
  "success": true,
  "user": {
    "id": "66a100000000000000000002",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "role": "user",
    "phone": "+91 9876543210",
    "createdAt": "2026-10-27T14:30:00.000Z"
  }
}
```

---

## 2. Movies Endpoints (`/api/movies`)

### 2.1 Get All Active Movies
- **Method**: `GET`
- **Endpoint**: `/api/movies`
- **Access**: Public
- **Query Parameters**:
  - `search` *(optional)*: Search term for movie title, cast, or director
  - `genre` *(optional)*: Filter by genre (e.g. `Action`, `Sci-Fi`, `Drama`)
  - `language` *(optional)*: Filter by language (e.g. `English`, `Hindi`)
- **Response `200 OK`**:
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "66a200000000000000000001",
      "title": "Oppenheimer",
      "description": "The story of American scientist J. Robert Oppenheimer...",
      "genre": ["Biography", "Drama", "History"],
      "language": "English",
      "duration": 180,
      "rating": 8.9,
      "posterUrl": "https://images.unsplash.com/...",
      "director": "Christopher Nolan",
      "cast": ["Cillian Murphy", "Emily Blunt"],
      "isActive": true
    }
  ]
}
```

### 2.2 Get Single Movie Details
- **Method**: `GET`
- **Endpoint**: `/api/movies/:id`
- **Access**: Public
- **Response `200 OK`**: Single movie object with complete cast and trailer link.

### 2.3 Create New Movie
- **Method**: `POST`
- **Endpoint**: `/api/movies`
- **Access**: Private/Admin
- **Request Body**:
```json
{
  "title": "Gladiator II",
  "description": "Years after witnessing the death of Maximus...",
  "genre": ["Action", "Adventure", "Drama"],
  "language": "English",
  "duration": 148,
  "rating": 8.4,
  "posterUrl": "https://images.unsplash.com/...",
  "director": "Ridley Scott",
  "cast": ["Paul Mescal", "Pedro Pascal", "Denzel Washington"]
}
```
- **Response `201 Created`**

---

## 3. Showtimes & Seat Locking (`/api/showtimes`)

### 3.1 Get Showtimes
- **Method**: `GET`
- **Endpoint**: `/api/showtimes`
- **Access**: Public
- **Query Parameters**:
  - `movieId`: ID of the movie
  - `date`: Date in format `YYYY-MM-DD`
  - `theaterId`: ID of the cinema hall
- **Response `200 OK`**: Array of available showtimes with theater and screen details.

### 3.2 Lock Seats (Anti-Collision Lock)
- **Method**: `POST`
- **Endpoint**: `/api/showtimes/:id/lock-seats`
- **Access**: Private (User Token)
- **Description**: Locks selected seats for 8 minutes to prevent other users from booking them during payment.
- **Request Body**:
```json
{
  "seats": ["C3", "C4"]
}
```
- **Response `200 OK`**:
```json
{
  "success": true,
  "message": "Seats held successfully for checkout.",
  "lockedSeats": ["C3", "C4"]
}
```
- **Error `409 Conflict`**: If seats are already locked by another user.
- **Error `400 Bad Request`**: If seats are already booked permanently.

---

## 4. Bookings & Payment (`/api/bookings`)

### 4.1 Create Booking & Simulated Payment
- **Method**: `POST`
- **Endpoint**: `/api/bookings`
- **Access**: Private (User Token)
- **Request Body**:
```json
{
  "showtimeId": "66a400000000000000000001",
  "seats": [
    { "seatNumber": "D1", "tier": "Premium", "price": 350 },
    { "seatNumber": "D2", "tier": "Premium", "price": 350 }
  ],
  "paymentMethod": "upi"
}
```
- **Response `201 Created`**:
```json
{
  "success": true,
  "message": "Tickets booked successfully!",
  "data": {
    "bookingReference": "IM-K7X9Q4L2",
    "movieTitle": "Oppenheimer",
    "theaterName": "IMovies Cineplex Grand Central",
    "screenName": "Screen 1 (IMAX Laser)",
    "showDate": "2026-10-27",
    "showTime": "06:15 PM",
    "seats": [
      { "seatNumber": "D1", "tier": "Premium", "price": 350 },
      { "seatNumber": "D2", "tier": "Premium", "price": 350 }
    ],
    "subtotal": 700,
    "convenienceFee": 35,
    "tax": 35,
    "totalAmount": 770,
    "paymentDetails": {
      "method": "upi",
      "transactionId": "TXN-8F9G2H1J",
      "status": "success",
      "paidAt": "2026-10-27T14:45:00.000Z"
    },
    "bookingStatus": "confirmed",
    "qrCodeData": "IMOVIES|IM-K7X9Q4L2|Oppenheimer|SEATS:D1,D2|TOTAL:770"
  }
}
```

### 4.2 Get User Booking History
- **Method**: `GET`
- **Endpoint**: `/api/bookings/my-bookings`
- **Access**: Private (User Token)
- **Response `200 OK`**: List of all bookings made by the current user sorted from newest to oldest.

### 4.3 Cancel Booking
- **Method**: `PUT`
- **Endpoint**: `/api/bookings/:id/cancel`
- **Access**: Private (Booking Owner or Admin)
- **Response `200 OK`**: Marks status as `cancelled` and frees the seats back to available.

---

## 5. Admin Management (`/api/admin`)

### 5.1 Get Platform KPIs & Overview Stats
- **Method**: `GET`
- **Endpoint**: `/api/admin/stats`
- **Access**: Private/Admin
- **Response `200 OK`**:
```json
{
  "success": true,
  "data": {
    "totalRevenue": 46200,
    "totalBookings": 62,
    "totalTicketsSold": 138,
    "totalMovies": 5,
    "totalUsers": 24,
    "totalShowtimes": 40,
    "dbMode": "mongodb",
    "recentBookings": [ ... ]
  }
}
```

### 5.2 Get All System Bookings
- **Method**: `GET`
- **Endpoint**: `/api/admin/bookings`
- **Access**: Private/Admin
- **Response `200 OK`**: Comprehensive list of all bookings with customer details.
