output "api_load_balancer_dns_name" {
  description = "The DNS name of the API Load Balancer."
  value       = aws_lb.resumate_api_lb.dns_name
}

output "cloudfront_domain_name" {
  description = "The domain name of the CloudFront distribution."
  value       = aws_cloudfront_distribution.resumate_frontend_cdn.domain_name
}

output "backend_ecr_repository_url" {
  description = "The URL of the backend ECR repository."
  value       = aws_ecr_repository.resumate_backend_ecr.repository_url
}

output "frontend_ecr_repository_url" {
  description = "The URL of the frontend ECR repository."
  value       = aws_ecr_repository.resumate_frontend_ecr.repository_url
}

output "s3_pdfs_bucket_name" {
  description = "The name of the S3 bucket for PDF storage."
  value       = aws_s3_bucket.resumate_pdfs.bucket
}

output "s3_assets_bucket_name" {
  description = "The name of the S3 bucket for static assets."
  value       = aws_s3_bucket.resumate_assets.bucket
}

output "cognito_user_pool_id" {
  description = "The ID of the Cognito User Pool."
  value       = aws_cognito_user_pool.resumate_user_pool.id
}

output "cognito_user_pool_client_id" {
  description = "The ID of the Cognito User Pool Client."
  value       = aws_cognito_user_pool_client.resumate_app_client.id
}
