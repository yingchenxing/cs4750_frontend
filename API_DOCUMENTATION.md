# Student Housing Platform API Documentation

## Base URL

```
https://cs4750.onrender.com/api
http://localhost:8080/api (testing locally)
```

## Authentication

Currently, the API uses basic authentication with password hashing using BCrypt. JWT token authentication is planned but not yet implemented.

## API Endpoints

### Authentication

#### Register User

```http
POST /api/auth/signup
```

Request body:

```json
{
  "username": "string",
  "email": "string",
  "password": "string",
  "phoneNumber": "string (optional)"
}
```

Response (200 OK):

```json
{
  "email": "string"
}
```

Error Response (400 Bad Request):

```json
"Email already exists"
```

Note: The login endpoint is currently under development and not yet available.

#### Login

```http
POST /api/auth/login
```

Request body:

```json
{
  "email": "string",
  "password": "string"
}
```

Response:

{
"userId": Long,
"username": "String",
"email": "String",
"phoneNumber": String,
"passwordHash": "String",
"profilePicture": string
}

#### Get User Information

```http
GET /api/auth/user/{userId}
```

Parameters:

- `userId` (path parameter): The ID of the user to fetch

Response (200 OK):

```json
{
  "userId": "number",
  "username": "string",
  "email": "string",
  "phoneNumber": "string",
  "profilePicture": "string"
}
```

Error Responses:

404 Not Found:

```json
{
  "error": "Not Found",
  "message": "User not found"
}
```

500 Internal Server Error:

```json
{
  "error": "Internal Server Error",
  "message": "Failed to get user information"
}
```

### Listings

#### Get All Listings

```http
GET /api/listings
```

Response:

```json
[
  {
    "listingId": "number",
    "userId": "number",
    "title": "string",
    "description": "string",
    "propertyType": "string",
    "location": "string",
    "rentPrice": "number",
    "leaseDuration": "number",
    "availTimeStart": "string",
    "availTimeEnd": "string",
    "image": "string",
    "isSublease": "boolean",
    "subleaseReason": "string (only if isSublease is true)",
    "user": {
      "userId": "number",
      "username": "string",
      "email": "string",
      "phoneNumber": "string",
      "profilePicture": "string"
    }
  }
]
```

#### Get Listing by ID

```http
GET /api/listings/{listingId}
```

Response:

```json
{
  "listingId": "number",
  "userId": "number",
  "title": "string",
  "description": "string",
  "propertyType": "string",
  "location": "string",
  "rentPrice": "number",
  "leaseDuration": "number",
  "availTimeStart": "string",
  "availTimeEnd": "string",
  "image": "string",
  "isSublease": "boolean",
  "subleaseReason": "string (only if isSublease is true)",
  "user": {
    "userId": "number",
    "username": "string",
    "email": "string",
    "phoneNumber": "string",
    "profilePicture": "string"
  }
}
```

Error Response (404 Not Found):

```json
{
  "error": "Not Found",
  "message": "Listing not found"
}
```

#### Create Listing

```http
POST /api/listings/create
```

Request body:

```json
{
  "userId": "number",
  "title": "string",
  "description": "string",
  "location": "string",
  "propertyType": "string",
  "rentPrice": "number",
  "leaseDuration": "number",
  "availTimeStart": "string",
  "availTimeEnd": "string",
  "image": "string",
  "isSublease": "boolean",
  "subleaseReason": "string (required if isSublease is true)"
}
```

Response:

```json
{
  "listingId": "number",
  "userId": "number",
  "title": "string",
  "description": "string",
  "propertyType": "string",
  "location": "string",
  "rentPrice": "number",
  "leaseDuration": "number",
  "availTimeStart": "string",
  "availTimeEnd": "string",
  "image": "string"
}
```

#### Save Listing

```http
POST /api/listings/{listingId}/save
```

Request body:

```json
{
  "userId": "number"
}
```

Response (200 OK):

```json
{
  "savedId": "number",
  "savedAt": "string (ISO-8601 datetime)"
}
```

Error Response (500 Internal Server Error):

```json
{
  "error": "Internal Server Error",
  "message": "Failed to save listing"
}
```

### Roommates

#### Get Roommate Matches

```http
GET /roommates/matches
```

Query parameters:

- `page` (optional): Page number for pagination
- `limit` (optional): Number of items per page
- `university` (optional): Filter by university
- `preferences` (optional): Filter by preferences

Response:

```json
{
  "matches": [
    {
      "id": "string",
      "firstName": "string",
      "lastName": "string",
      "university": "string",
      "preferences": {
        "smoking": "boolean",
        "pets": "boolean",
        "sleepSchedule": "string",
        "cleanliness": "string"
      },
      "bio": "string",
      "profileImage": "string"
    }
  ],
  "total": "number",
  "page": "number",
  "limit": "number"
}
```

#### Update User Preferences

```http
PUT /users/preferences
```

Request body:

```json
{
  "smoking": "boolean",
  "pets": "boolean",
  "sleepSchedule": "string",
  "cleanliness": "string",
  "additionalNotes": "string"
}
```

### Messages

#### Get User Conversations

```http
GET /api/messages/conversations/:userId
```

Returns all conversations for a specific user. If no conversations are found, returns an empty array.

Response:

```json
[
  {
    "partnerId": "number",
    "partnerName": "string",
    "partnerProfilePicture": "string",
    "lastMessage": {
      "content": "string",
      "sentAt": "string (ISO-8601 datetime)",
      "isFromUser": "boolean"
    }
  }
]
```

Error Response (500 Internal Server Error):

```json
{
  "error": "Internal Server Error",
  "message": "Failed to fetch conversations"
}
```

#### Get Conversation Messages

```http
GET /api/messages/conversation/:userId/:partnerId
```

Returns all messages between two users. If no messages are found, returns an empty array.

Response:

```json
[
  {
    "messageId": "number",
    "content": "string",
    "sentAt": "string (ISO-8601 datetime)",
    "sender": {
      "userId": "number",
      "username": "string",
      "profilePicture": "string"
    }
  }
]
```

Error Response (500 Internal Server Error):

```json
{
  "error": "Internal Server Error",
  "message": "Failed to fetch messages"
}
```

#### Send Message

```http
POST /api/messages/send
```

Request body:

```json
{
  "senderId": "number",
  "receiverId": "number",
  "content": "string"
}
```

Response (201 Created):

```json
{
  "messageId": "number",
  "content": "string",
  "sentAt": "string (ISO-8601 datetime)",
  "sender": {
    "userId": "number",
    "username": "string",
    "profilePicture": "string"
  }
}
```

Error Response (500 Internal Server Error):

```json
{
  "error": "Internal Server Error",
  "message": "Failed to send message"
}
```

### User Preferences

#### Create User Preferences

```http
POST /api/preferences
```

Request body:

```json
{
  "userId": "number",
  "gender": "string",
  "cleanlinessLevel": "string",
  "age": "number",
  "pets": "boolean",
  "smokingHabits": "boolean",
  "bio": "string"
}
```

Response (201 Created):

```json
{
  "userId": "number",
  "gender": "string",
  "cleanlinessLevel": "string",
  "age": "number",
  "pets": "boolean",
  "smokingHabits": "boolean",
  "bio": "string"
}
```

Error Response (400 Bad Request):

```json
{
  "error": "Bad Request",
  "message": "Profile already exists for this user. Use PUT to update."
}
```

#### Get User Preferences

```http
GET /api/preferences/{userId}
```

Response:

```json
{
  "userId": "number",
  "gender": "string",
  "cleanlinessLevel": "string",
  "age": "number",
  "pets": "boolean",
  "smokingHabits": "boolean",
  "bio": "string"
}
```

Error Response (404 Not Found):

```json
{
  "error": "Not Found",
  "message": "Roommate profile not found"
}
```

#### Update User Preferences

```http
PUT /api/preferences/{userId}
```

Request body:

```json
{
  "gender": "string",
  "cleanlinessLevel": "string",
  "age": "number",
  "pets": "boolean",
  "smokingHabits": "boolean",
  "bio": "string"
}
```

Response:

```json
{
  "userId": "number",
  "gender": "string",
  "cleanlinessLevel": "string",
  "age": "number",
  "pets": "boolean",
  "smokingHabits": "boolean",
  "bio": "string"
}
```

Error Response (404 Not Found):

```json
{
  "error": "Not Found",
  "message": "Profile not found. Use POST to create a new profile."
}
```

#### Get All Profiles

```http
GET /api/preferences
```

Response:

```json
[
  {
    "userId": "number",
    "gender": "string",
    "cleanlinessLevel": "string",
    "age": "number",
    "pets": "boolean",
    "smokingHabits": "boolean",
    "bio": "string",
    "user": {
      "userId": "number",
      "username": "string",
      "email": "string",
      "phoneNumber": "string",
      "profilePicture": "string"
    }
  }
]
```

Error Response (500 Internal Server Error):

```json
{
  "error": "Internal Server Error",
  "message": "Failed to fetch profiles"
}
```

### Reviews

#### Get Listing Reviews

```http
GET /api/reviews/listing/{listingId}
```

Response:

```json
[
  {
    "reviewId": "number",
    "listingId": "number",
    "rating": "number",
    "comment": "string",
    "user": {
      "userId": "number",
      "username": "string",
      "profilePicture": "string"
    }
  }
]
```

#### Create Review

```http
POST /api/reviews/listing/{listingId}
```

Request body:

```json
{
  "userId": "number",
  "rating": "number",
  "comment": "string"
}
```

Response (201 Created):

```json
{
  "reviewId": "number",
  "listingId": "number",
  "rating": "number",
  "comment": "string",
  "user": {
    "userId": "number",
    "username": "string",
    "profilePicture": "string"
  }
}
```

Error Response (400 Bad Request):

```json
{
  "error": "Bad Request",
  "message": "You have already reviewed this listing"
}
```

#### Update Review

```http
PUT /api/reviews/{reviewId}
```

Request body:

```json
{
  "rating": "number",
  "comment": "string"
}
```

Response:

```json
{
  "reviewId": "number",
  "listingId": "number",
  "rating": "number",
  "comment": "string",
  "user": {
    "userId": "number",
    "username": "string",
    "profilePicture": "string"
  }
}
```

Error Response (404 Not Found):

```json
{
  "error": "Not Found",
  "message": "Review not found"
}
```

#### Delete Review

```http
DELETE /api/reviews/{reviewId}
```

Response (204 No Content)

Error Response (404 Not Found):

```json
{
  "error": "Not Found",
  "message": "Review not found"
}
```

## Error Responses

All API endpoints may return the following error responses:

### 400 Bad Request

```json
{
  "error": "string",
  "message": "string"
}
```

### 401 Unauthorized

```json
{
  "error": "Unauthorized",
  "message": "Invalid or expired token"
}
```

### 403 Forbidden

```json
{
  "error": "Forbidden",
  "message": "Insufficient permissions"
}
```

### 404 Not Found

```json
{
  "error": "Not Found",
  "message": "Resource not found"
}
```

### 500 Internal Server Error

```json
{
  "error": "Internal Server Error",
  "message": "An unexpected error occurred"
}
```

## Rate Limiting

API requests are limited to:

- 100 requests per minute for authenticated users
- 20 requests per minute for unauthenticated users

Rate limit headers are included in the response:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1620000000
```

## Pagination

Endpoints that return lists support pagination using the following query parameters:

- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10, max: 100)

Pagination metadata is included in the response:

```json
{
  "data": [],
  "pagination": {
    "total": "number",
    "page": "number",
    "limit": "number",
    "totalPages": "number"
  }
}
```
