# Resumate AI - Backend API Documentation

This document outlines the RESTful API endpoints for the Resumate AI backend.

The API is built with NestJS and follows standard REST conventions.

**Base URL:** `https://api.resumate-ai.com/api` (Production) or `http://localhost:3001/api` (Local Development)

## Authentication

All protected endpoints require a Bearer Token (JWT) in the `Authorization` header.

### `POST /auth/register`
*   **Description**: Registers a new user account.
*   **Request Body**: `RegisterDto`
    ```json
    {
        "name": "John Doe",
        "email": "john.doe@example.com",
        "password": "securepassword123"
    }
    ```
*   **Response**: `UserProfile` (without password)
    ```json
    {
        "id": "uuid-string",
        "email": "john.doe@example.com",
        "name": "John Doe",
        "createdAt": "2023-01-01T12:00:00Z",
        "updatedAt": "2023-01-01T12:00:00Z"
    }
    ```

### `POST /auth/login`
*   **Description**: Logs in a user and returns a JWT access token.
*   **Request Body**: `LoginDto`
    ```json
    {
        "email": "john.doe@example.com",
        "password": "securepassword123"
    }
    ```
*   **Response**: `LoginResponse`
    ```json
    {
        "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
    ```

### `GET /auth/profile`
*   **Description**: Retrieves the authenticated user's profile.
*   **Authentication**: Required
*   **Response**: `UserProfile`

## Users

### `GET /users/me`
*   **Description**: Get the profile of the current authenticated user.
*   **Authentication**: Required
*   **Response**: `UserProfile`

## Templates

### `GET /templates`
*   **Description**: Retrieves a list of all available resume templates.
*   **Authentication**: Optional (public access for browsing)
*   **Response**: `Template[]`
    ```json
    [
        {
            "id": "uuid-template-1",
            "name": "Modern Professional",
            "imageUrl": "https://example.com/template1.png",
            "content": "<html><body>...template HTML...</body></html>",
            "createdAt": "2023-01-01T12:00:00Z",
            "updatedAt": "2023-01-01T12:00:00Z"
        }
    ]
    ```

### `GET /templates/:id`
*   **Description**: Retrieves a specific template by ID.
*   **Authentication**: Optional
*   **Response**: `Template`

## Resumes

### `POST /resumes`
*   **Description**: Creates a new resume for the authenticated user.
*   **Authentication**: Required
*   **Request Body**: `CreateResumeDto`
    ```json
    {
        "templateId": "uuid-template-1",
        "data": {
            "name": "Jane Doe",
            "email": "jane.doe@example.com",
            "summary": "Experienced professional...",
            "experience": [],
            "education": []
        }
    }
    ```
*   **Response**: `Resume`

### `GET /resumes`
*   **Description**: Retrieves all resumes belonging to the authenticated user.
*   **Authentication**: Required
*   **Response**: `Resume[]`

### `GET /resumes/:id`
*   **Description**: Retrieves a specific resume by ID for the authenticated user.
*   **Authentication**: Required
*   **Response**: `Resume`

### `PATCH /resumes/:id`
*   **Description**: Updates a specific resume for the authenticated user.
*   **Authentication**: Required
*   **Request Body**: `UpdateResumeDto` (Partial `CreateResumeDto`)
*   **Response**: `Resume`

### `DELETE /resumes/:id`
*   **Description**: Deletes a specific resume for the authenticated user.
*   **Authentication**: Required
*   **Response**: `204 No Content`

### `POST /resumes/:id/generate-pdf`
*   **Description**: Generates a PDF for the specified resume and uploads it to S3.
*   **Authentication**: Required
*   **Response**: `{"pdfUrl": "https://s3.amazonaws.com/your-bucket/path/to/resume.pdf"}`

## Files (Internal/Protected)

These endpoints are primarily for the backend's internal use or specific frontend upload features.

### `POST /files/upload/avatar`
*   **Description**: Uploads a user avatar image.
*   **Authentication**: Required
*   **Request Body**: `multipart/form-data` with a file field named `file`.
*   **Response**: `{"url": "https://s3.amazonaws.com/your-bucket/path/to/avatar.jpg"}`

### `GET /files/download/:key`
*   **Description**: Streams a file from S3 given its key.
*   **Authentication**: Required (or implement signed URLs for private files)
*   **Response**: File content (e.g., `application/pdf`, `image/jpeg`)
