resource "aws_cloudfront_distribution" "resumate_frontend_cdn" {
  origin {
    domain_name = aws_lb.resumate_api_lb.dns_name # Point to ALB for Next.js SSR/API routes
    origin_id   = "frontend-alb-origin"

    custom_header {
      name  = "X-Origin-Type"
      value = "frontend"
    }

    custom_origin_config {
      http_port              = 80
      https_port             = 443
      origin_protocol_policy = "http-only" # Or "https-only" if ALB has SSL enabled
      origin_read_timeout    = 30
      origin_ssl_protocols   = ["TLSv1.2"]
    }
  }

  enabled             = true
  is_ipv6_enabled     = true
  comment             = "CloudFront distribution for Resumate AI frontend"
  default_root_object = "index.html" # Or adjust for Next.js, e.g., root page

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD", "OPTIONS", "PUT", "POST", "PATCH", "DELETE"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "frontend-alb-origin"

    forwarded_values {
      query_string = true

      cookies {
        forward = "all"
      }

      headers = ["Authorization", "Host"]
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 86400 # 24 hours
    max_ttl                = 31536000 # 1 year
    compress               = true
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true # Use CloudFront's default SSL certificate
    # Or use acm_certificate_arn if you have a custom domain
    # acm_certificate_arn      = "arn:aws:acm:us-east-1:123456789012:certificate/xyz-123"
    # ssl_support_method       = "sni-only"
    # minimum_protocol_version = "TLSv1.2_2021"
  }

  tags = {
    Name = "resumate-ai-frontend-cdn"
  }
}
