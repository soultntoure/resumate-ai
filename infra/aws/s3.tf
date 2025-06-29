resource "aws_s3_bucket" "resumate_pdfs" {
  bucket = "${var.s3_bucket_prefix}-resumate-pdfs"
  acl    = "private" # Keep PDFs private, access via signed URLs or backend

  versioning {
    enabled = true
  }

  tags = {
    Name = "resumate-ai-pdfs"
  }
}

resource "aws_s3_bucket_public_access_block" "resumate_pdfs_block_public_access" {
  bucket                  = aws_s3_bucket.resumate_pdfs.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket" "resumate_assets" {
  bucket = "${var.s3_bucket_prefix}-resumate-assets"
  acl    = "public-read" # For public assets like template images

  tags = {
    Name = "resumate-ai-assets"
  }
}

resource "aws_s3_bucket_public_access_block" "resumate_assets_block_public_access" {
  bucket                  = aws_s3_bucket.resumate_assets.id
  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

resource "aws_s3_bucket_policy" "resumate_assets_policy" {
  bucket = aws_s3_bucket.resumate_assets.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect    = "Allow"
        Principal = "*"
        Action    = [
          "s3:GetObject"
        ]
        Resource  = [
          "${aws_s3_bucket.resumate_assets.arn}/*"
        ]
      }
    ]
  })
}
