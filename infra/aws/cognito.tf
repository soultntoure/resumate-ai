resource "aws_cognito_user_pool" "resumate_user_pool" {
  name = "resumate-ai-user-pool"

  auto_verified_attributes = ["email"]

  password_policy {
    minimum_length    = 8
    require_lowercase = true
    require_numbers   = true
    require_symbols   = false
    require_uppercase = true
  }

  schemas {
    name     = "email"
    required = true
    mutable  = true
    attribute_data_type = "String"
  }
  schemas {
    name     = "name"
    required = false
    mutable  = true
    attribute_data_type = "String"
  }

  tags = {
    Name = "resumate-ai-user-pool"
  }
}

resource "aws_cognito_user_pool_client" "resumate_app_client" {
  name                                 = "resumate-ai-app-client"
  user_pool_id                         = aws_cognito_user_pool.resumate_user_pool.id
  generate_secret                      = false # For web/mobile clients
  explicit_auth_flows                  = ["ADMIN_NO_SRP_AUTH", "USER_PASSWORD_AUTH"]
  read_attributes                      = ["email", "name"]
  write_attributes                     = ["email", "name"]
  supported_identity_providers         = ["COGNITO"]
  callback_urls                        = ["http://localhost:3000/api/auth/callback", "${var.frontend_url}/api/auth/callback"]
  logout_urls                          = ["http://localhost:3000/logout", "${var.frontend_url}/logout"]
}

resource "aws_cognito_identity_pool" "resumate_identity_pool" {
  identity_pool_name               = "resumate-ai-identity-pool"
  allow_unauthenticated_identities = false

  cognito_identity_providers {
    client_id  = aws_cognito_user_pool_client.resumate_app_client.id
    provider_name = aws_cognito_user_pool.resumate_user_pool.provider_name
  }
}

resource "aws_iam_role" "cognito_authenticated_role" {
  name = "resumate-ai-cognito-authenticated-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Federated = "cognito-identity.amazonaws.com"
        }
        Action = "sts:AssumeRoleWithWebIdentity"
        Condition = {
          StringEquals = {
            "cognito-identity.amazonaws.com:aud" = aws_cognito_identity_pool.resumate_identity_pool.id
          }
          "ForAnyValue:StringLike" = {
            "cognito-identity.amazonaws.com:amr" = "authenticated"
          }
        }
      }
    ]
  })
}

resource "aws_iam_policy" "cognito_auth_policy" {
  name        = "resumate-ai-cognito-auth-policy"
  description = "Policy for authenticated Cognito users"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "s3:GetObject",
          "s3:PutObject"
        ]
        Resource = [
          "${aws_s3_bucket.resumate_pdfs.arn}/users/${cognito_identity_pool_sub()}/resumes/*", # Allow user to manage their own PDFs
          "${aws_s3_bucket.resumate_assets.arn}/*" # Allow read-only for public assets
        ]
      }
      # Add other permissions required for authenticated users
    ]
  })
}

resource "aws_iam_role_policy_attachment" "cognito_auth_policy_attach" {
  role       = aws_iam_role.cognito_authenticated_role.name
  policy_arn = aws_iam_policy.cognito_auth_policy.arn
}

# Associate authenticated role with identity pool
resource "aws_cognito_identity_pool_roles_attachment" "resumate_identity_pool_roles" {
  identity_pool_id = aws_cognito_identity_pool.resumate_identity_pool.id

  roles = {
    "authenticated" = aws_iam_role.cognito_authenticated_role.arn
  }
}
