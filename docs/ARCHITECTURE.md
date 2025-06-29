# Resumate AI - High-Level Architecture

## Overview

Resumate AI is built as a modern, decoupled web application following a microservices-like approach within a monorepo structure. It comprises a Next.js frontend, a NestJS backend API, a PostgreSQL database, and leverages various AWS services for scalability, reliability, and security.

## Key Components

1.  **Frontend (Next.js)**:
    *   **Purpose**: User interface for creating, editing, and viewing resumes. Handles user authentication flows, template browsing, and resume data input.
    *   **Technologies**: React, Next.js (App Router), TypeScript, Tailwind CSS, TanStack Query, React Hook Form.
    *   **Deployment**: Containerized (Docker) and deployed to AWS ECS Fargate, exposed via an Application Load Balancer and AWS CloudFront for low-latency content delivery.

2.  **Backend API (NestJS)**:
    *   **Purpose**: Core business logic, user management, template management, resume data persistence, and PDF generation.
    *   **Technologies**: Node.js, NestJS, TypeScript, Prisma (ORM), PostgreSQL, JWT authentication, Puppeteer (for PDF generation).
    *   **Deployment**: Containerized (Docker) and deployed to AWS ECS Fargate, exposed via an Application Load Balancer.

3.  **Database (PostgreSQL)**:
    *   **Purpose**: Stores all structured data: user accounts, resume details (metadata and JSON data blobs), and template definitions.
    *   **Deployment**: AWS RDS for PostgreSQL for managed, scalable, and highly available database service.

4.  **Object Storage (AWS S3)**:
    *   **Purpose**: Stores generated PDF resumes and static template assets (images).
    *   **Deployment**: AWS S3 Buckets, integrated with backend for upload/download and CloudFront for asset delivery.

5.  **Authentication (AWS Cognito)**:
    *   **Purpose**: Manages user registration, login, and identity. Provides user pools for directory services and identity pools for AWS resource authorization.
    *   **Integration**: Backend uses JWTs issued by Cognito for API authentication. Frontend interacts directly with Cognito or via backend proxy.

6.  **Infrastructure as Code (Terraform)**:
    *   **Purpose**: Defines and provisions all AWS cloud resources programmatically, ensuring consistency, repeatability, and version control of infrastructure.

7.  **CI/CD (GitHub Actions)**:
    *   **Purpose**: Automates the build, test, and deployment process for both frontend and backend services upon code changes.

## Data Flow (Example: Resume Creation)

1.  **User Interaction**: User logs into the **Frontend** (Next.js app).
2.  **Authentication**: Frontend sends login credentials to **Backend API** (`/auth/login`). Backend authenticates against **Cognito/Database**, issues a JWT.
3.  **Data Input**: User selects a template and inputs resume data on the **Frontend**. 
4.  **Save Resume**: Frontend sends resume data (including selected `templateId` and the `data` JSON blob) to **Backend API** (`/resumes`).
5.  **Data Persistence**: Backend uses **Prisma** to save the resume record to the **PostgreSQL (RDS)** database.
6.  **PDF Generation Request**: User triggers PDF generation from Frontend. Frontend calls **Backend API** (`/resumes/:id/generate-pdf`).
7.  **PDF Generation**: Backend fetches resume data and template content from **PostgreSQL**. It then uses **Puppeteer** to render the HTML content (populated with resume data) into a PDF.
8.  **PDF Storage**: The generated PDF `Buffer` is uploaded by the **Backend** to **AWS S3**.
9.  **URL Update**: The S3 PDF URL is saved back into the **PostgreSQL** database for the resume record.
10. **PDF Access**: Frontend retrieves the PDF URL and allows the user to download or view the PDF, potentially served via **CloudFront** if configured for secure S3 access.

## Scalability and Reliability Considerations

*   **Containerization (ECS Fargate)**: Abstracts away server management, providing auto-scaling capabilities.
*   **Managed Database (RDS)**: Handles database backups, patching, and scaling.
*   **S3 for Assets**: Highly scalable and durable object storage.
*   **CloudFront**: Reduces latency and offloads traffic from origins.
*   **Load Balancers (ALB)**: Distributes incoming traffic across multiple ECS tasks for high availability and fault tolerance.
*   **Stateless Backend**: Allows horizontal scaling of API instances.

This architecture provides a solid foundation for the MVP, with clear paths for future expansion and feature development.