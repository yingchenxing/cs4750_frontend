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

### Listings

#### Get All Listings

```http
GET /api/listings
```

Response:

```json
[
  {
    "listing_id": "number",
    "user": {
      "userId": "number",
      "username": "string",
      "email": "string",
      "phoneNumber": "string",
      "profilePicture": "string"
    },
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
]
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

Example request:

```json
{
  "userId": 1,
  "title": "Summer Sublet Room",
  "description": "Subletting my room near campus for the summer.",
  "location": "123 University Ave",
  "propertyType": "Apartment",
  "rentPrice": 900,
  "leaseDuration": 3,
  "availTimeStart": "2025-06-01",
  "availTimeEnd": "2025-09-01",
  "image": "https://i.imgur.com/Dt145tX.jpeg",
  "isSublease": true,
  "subleaseReason": "Going abroad for internship"
}
```

Response:

```json
{
  "listing_id": "number",
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

Response (200 OK):

```json
{
  "savedId": "number",
  "savedAt": "string (ISO-8601 datetime)"
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

#### Get Conversations

```http
GET /messages/conversations
```

Response:

```json
{
  "conversations": [
    {
      "id": "string",
      "participants": [
        {
          "id": "string",
          "firstName": "string",
          "lastName": "string",
          "profileImage": "string"
        }
      ],
      "lastMessage": {
        "content": "string",
        "timestamp": "string",
        "senderId": "string"
      }
    }
  ]
}
```

#### Get Messages in Conversation

```http
GET /messages/conversations/:conversationId
```

Query parameters:

- `page` (optional): Page number for pagination
- `limit` (optional): Number of messages per page

Response:

```json
{
  "messages": [
    {
      "id": "string",
      "content": "string",
      "senderId": "string",
      "timestamp": "string"
    }
  ],
  "total": "number",
  "page": "number",
  "limit": "number"
}
```

#### Send Message

```http
POST /messages/conversations/:conversationId
```

Request body:

```json
{
  "content": "string"
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
