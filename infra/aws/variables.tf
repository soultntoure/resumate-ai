variable "aws_region" {
  description = "The AWS region to deploy resources."
  type        = string
  default     = "us-east-1"
}

variable "db_password" {
  description = "Password for the RDS PostgreSQL database."
  type        = string
  sensitive   = true
}

variable "jwt_secret" {
  description = "Secret key for JWT authentication."
  type        = string
  sensitive   = true
}

variable "aws_access_key_id" {
  description = "AWS Access Key ID for S3 operations."
  type        = string
  sensitive   = true
}

variable "aws_secret_access_key" {
  description = "AWS Secret Access Key for S3 operations."
  type        = string
  sensitive   = true
}

variable "s3_bucket_prefix" {
  description = "Prefix for S3 bucket names to ensure uniqueness."
  type        = string
  default     = "resumate-ai"
}

variable "frontend_url" {
  description = "The public URL of the deployed frontend (for Cognito callbacks)."
  type        = string
  default     = "http://localhost:3000"
}

# Add any other variables needed for your infrastructure
