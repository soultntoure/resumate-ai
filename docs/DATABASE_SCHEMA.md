# Resumate AI - Database Schema

This document describes the database schema for the Resumate AI platform, powered by PostgreSQL and managed with Prisma ORM. The schema is defined in `packages/db/schema.prisma`.

## Entity Relationship Diagram (Conceptual)

```mermaid
erDiagram
    User ||--o{ Resume : creates
    Template ||--o{ Resume : uses

    User {
        string id PK
        string email UK
        string password
        string name optional
        datetime createdAt
        datetime updatedAt
    }

    Template {
        string id PK
        string name UK
        string imageUrl optional
        string content // HTML or JSON structure
        datetime createdAt
        datetime updatedAt
    }

    Resume {
        string id PK
        string userId FK "User"
        string templateId FK "Template"
        json data // JSON blob of actual resume content (experience, education, skills)
        string pdfUrl optional // URL to generated PDF in S3
        datetime createdAt
        datetime updatedAt
    }
```

## Table Details

### `User` Table

Stores user authentication and profile information.

| Column      | Type        | Constraints      | Description                          |
| :---------- | :---------- | :--------------- | :----------------------------------- |
| `id`        | `String`    | Primary Key, UUID | Unique identifier for the user.      |
| `email`     | `String`    | Unique           | User's email address (login credential). |
| `password`  | `String`    |                  | Hashed password for authentication.  |
| `name`      | `String`    | Optional         | User's full name.                    |
| `createdAt` | `DateTime`  | Default `now()`  | Timestamp of record creation.        |
| `updatedAt` | `DateTime`  | `@updatedAt`     | Timestamp of last record update.     |

### `Template` Table

Stores predefined resume templates that users can choose from.

| Column      | Type        | Constraints      | Description                                  |
| :---------- | :---------- | :--------------- | :------------------------------------------- |
| `id`        | `String`    | Primary Key, UUID | Unique identifier for the template.          |
| `name`      | `String`    | Unique           | Display name of the template.                |
| `imageUrl`  | `String`    | Optional         | URL to a thumbnail image of the template.    |
| `content`   | `String`    |                  | The actual structure/content of the template (e.g., HTML string or JSON configuration for dynamic rendering). |
| `createdAt` | `DateTime`  | Default `now()`  | Timestamp of record creation.                |
| `updatedAt` | `DateTime`  | `@updatedAt`     | Timestamp of last record update.             |

### `Resume` Table

Stores individual resumes created by users, linking to a template and holding the user's specific data.

| Column      | Type        | Constraints      | Description                                  |
| :---------- | :---------- | :--------------- | :------------------------------------------- |
| `id`        | `String`    | Primary Key, UUID | Unique identifier for the resume.            |
| `userId`    | `String`    | Foreign Key      | Links to the `User` who created the resume.  |
| `templateId`| `String`    | Foreign Key      | Links to the `Template` used for this resume. |
| `data`      | `Json`      |                  | A JSON object containing all the specific user-inputted resume details (e.g., name, contact, experience, education, skills, etc.). This allows flexible schema. |
| `pdfUrl`    | `String`    | Optional         | URL to the generated PDF file stored in S3.  |
| `createdAt` | `DateTime`  | Default `now()`  | Timestamp of record creation.                |
| `updatedAt` | `DateTime`  | `@updatedAt`     | Timestamp of last record update.             |

## Relationships

*   **User to Resume (One-to-Many)**: A `User` can create multiple `Resume`s. (`userId` in `Resume` table references `id` in `User` table).
*   **Template to Resume (One-to-Many)**: A `Template` can be used for multiple `Resume`s. (`templateId` in `Resume` table references `id` in `Template` table).
