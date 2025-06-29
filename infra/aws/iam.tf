resource "aws_iam_role" "ecs_task_execution_role" {
  name = "resumate-ai-ecs-task-execution-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        }
      }
    ]
  })

  tags = {
    Name = "resumate-ai-ecs-task-execution-role"
  }
}

resource "aws_iam_role_policy_attachment" "ecs_task_execution_role_policy" {
  role       = aws_iam_role.ecs_task_execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

resource "aws_iam_role" "ecs_task_role" {
  name = "resumate-ai-ecs-task-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        }
      }
    ]
  })

  tags = {
    Name = "resumate-ai-ecs-task-role"
  }
}

resource "aws_iam_policy" "ecs_app_policy" {
  name        = "resumate-ai-ecs-app-policy"
  description = "Policy for ECS tasks to access S3 and other AWS services"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect   = "Allow"
        Action   = [
          "s3:GetObject",
          "s3:PutObject",
          "s3:DeleteObject",
          "s3:ListBucket"
        ]
        Resource = [
          "${aws_s3_bucket.resumate_pdfs.arn}",
          "${aws_s3_bucket.resumate_pdfs.arn}/*",
          "${aws_s3_bucket.resumate_assets.arn}",
          "${aws_s3_bucket.resumate_assets.arn}/*"
        ]
      },
      {
        Effect = "Allow",
        Action = [
          "secretsmanager:GetSecretValue",
          "ssm:GetParameters",
          "ssm:GetParameter",
          "ssm:GetParametersByPath"
        ],
        Resource = "*" # Limit to specific secrets/parameters in production
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "ecs_task_app_policy_attach" {
  role       = aws_iam_role.ecs_task_role.name
  policy_arn = aws_iam_policy.ecs_app_policy.arn
}

resource "aws_iam_role_policy_attachment" "ecs_task_s3_read_only_attach" {
  role       = aws_iam_role.ecs_task_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonS3ReadOnlyAccess" # Example for broader S3 read
}
