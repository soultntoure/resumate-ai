resource "aws_ecs_cluster" "resumate_cluster" {
  name = "resumate-ai-cluster"

  setting {
    name  = "containerInsights"
    value = "enabled"
  }

  tags = {
    Name = "resumate-ai-cluster"
  }
}

resource "aws_cloudwatch_log_group" "resumate_logs" {
  name              = "/ecs/resumate-ai"
  retention_in_days = 7
}

resource "aws_ecs_task_definition" "resumate_backend_task" {
  family                   = "resumate-ai-backend-task"
  cpu                      = 256
  memory                   = 512
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  execution_role_arn       = aws_iam_role.ecs_task_execution_role.arn
  task_role_arn            = aws_iam_role.ecs_task_role.arn

  container_definitions = jsonencode([
    {
      "name": "backend-container",
      "image": "${aws_ecr_repository.resumate_backend_ecr.repository_url}:latest",
      "cpu": 256,
      "memory": 512,
      "essential": true,
      "portMappings": [
        {
          "containerPort": 3001,
          "hostPort": 3001,
          "protocol": "tcp"
        }
      ],
      "environment": [
        { "name": "DATABASE_URL", "value": "${aws_rds_cluster_instance.resumate_db_instance.endpoint}" },
        { "name": "JWT_SECRET", "value": "${var.jwt_secret}" },
        { "name": "AWS_ACCESS_KEY_ID", "value": "${var.aws_access_key_id}" },
        { "name": "AWS_SECRET_ACCESS_KEY", "value": "${var.aws_secret_access_key}" },
        { "name": "AWS_REGION", "value": "${var.aws_region}" },
        { "name": "AWS_S3_BUCKET_NAME", "value": "${aws_s3_bucket.resumate_pdfs.bucket}" },
        { "name": "NEXT_PUBLIC_APP_URL", "value": "${aws_cloudfront_distribution.resumate_frontend_cdn.domain_name}" } # Assuming frontend is on CloudFront
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "${aws_cloudwatch_log_group.resumate_logs.name}",
          "awslogs-region": "${var.aws_region}",
          "awslogs-stream-prefix": "backend"
        }
      }
    }
  ])

  tags = {
    Name = "resumate-ai-backend-task"
  }
}

resource "aws_ecs_service" "resumate_backend_service" {
  name            = "resumate-ai-backend-service"
  cluster         = aws_ecs_cluster.resumate_cluster.id
  task_definition = aws_ecs_task_definition.resumate_backend_task.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = [aws_subnet.resumate_private_subnet_a.id]
    security_groups  = [aws_security_group.resumate_backend_sg.id]
    assign_public_ip = false
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.resumate_backend_tg.arn
    container_name   = "backend-container"
    container_port   = 3001
  }

  depends_on = [aws_lb_listener.resumate_http_listener] # Ensure ALB is ready

  tags = {
    Name = "resumate-ai-backend-service"
  }
}

resource "aws_ecr_repository" "resumate_backend_ecr" {
  name                 = "resumate-ai-backend"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }
}

resource "aws_ecr_repository" "resumate_frontend_ecr" {
  name                 = "resumate-ai-frontend"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }
}

# Frontend ECS service (similar to backend, but might be public facing)
resource "aws_ecs_task_definition" "resumate_frontend_task" {
  family                   = "resumate-ai-frontend-task"
  cpu                      = 256
  memory                   = 512
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  execution_role_arn       = aws_iam_role.ecs_task_execution_role.arn
  task_role_arn            = aws_iam_role.ecs_task_role.arn

  container_definitions = jsonencode([
    {
      "name": "frontend-container",
      "image": "${aws_ecr_repository.resumate_frontend_ecr.repository_url}:latest",
      "cpu": 256,
      "memory": 512,
      "essential": true,
      "portMappings": [
        {
          "containerPort": 3000,
          "hostPort": 3000,
          "protocol": "tcp"
        }
      ],
      "environment": [
        { "name": "NEXT_PUBLIC_API_URL", "value": "${aws_lb.resumate_api_lb.dns_name}" } # Backend API URL
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "${aws_cloudwatch_log_group.resumate_logs.name}",
          "awslogs-region": "${var.aws_region}",
          "awslogs-stream-prefix": "frontend"
        }
      }
    }
  ])

  tags = {
    Name = "resumate-ai-frontend-task"
  }
}

resource "aws_ecs_service" "resumate_frontend_service" {
  name            = "resumate-ai-frontend-service"
  cluster         = aws_ecs_cluster.resumate_cluster.id
  task_definition = aws_ecs_task_definition.resumate_frontend_task.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = [aws_subnet.resumate_public_subnet_a.id]
    security_groups  = [aws_security_group.resumate_frontend_sg.id]
    assign_public_ip = true
  }

  # For a Next.js server, you'd typically expose it via an ALB for public access
  load_balancer {
    target_group_arn = aws_lb_target_group.resumate_frontend_tg.arn
    container_name   = "frontend-container"
    container_port   = 3000
  }

  depends_on = [aws_lb_listener.resumate_http_listener] # Ensure ALB is ready

  tags = {
    Name = "resumate-ai-frontend-service"
  }
}

# Application Load Balancer for Backend API
resource "aws_lb" "resumate_api_lb" {
  name               = "resumate-ai-api-lb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.resumate_api_lb_sg.id]
  subnets            = [aws_subnet.resumate_public_subnet_a.id]

  tags = {
    Name = "resumate-ai-api-lb"
  }
}

resource "aws_lb_target_group" "resumate_backend_tg" {
  name     = "resumate-ai-backend-tg"
  port     = 3001
  protocol = "HTTP"
  vpc_id   = aws_vpc.resumate_vpc.id
  target_type = "ip"

  health_check {
    path                = "/api/health" # Assuming a health check endpoint
    protocol            = "HTTP"
    matcher             = "200"
    interval            = 30
    timeout             = 5
    healthy_threshold   = 2
    unhealthy_threshold = 2
  }
}

resource "aws_lb_target_group" "resumate_frontend_tg" {
  name     = "resumate-ai-frontend-tg"
  port     = 3000
  protocol = "HTTP"
  vpc_id   = aws_vpc.resumate_vpc.id
  target_type = "ip"

  health_check {
    path                = "/api/health" # Assuming a health check endpoint on frontend
    protocol            = "HTTP"
    matcher             = "200"
    interval            = 30
    timeout             = 5
    healthy_threshold   = 2
    unhealthy_threshold = 2
  }
}

resource "aws_lb_listener" "resumate_http_listener" {
  load_balancer_arn = aws_lb.resumate_api_lb.arn
  port              = "80"
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.resumate_backend_tg.arn
  }
}

# Security Group for Backend ECS tasks
resource "aws_security_group" "resumate_backend_sg" {
  name        = "resumate-ai-backend-sg"
  description = "Allow traffic to backend ECS tasks"
  vpc_id      = aws_vpc.resumate_vpc.id

  ingress {
    from_port       = 3001
    to_port         = 3001
    protocol        = "tcp"
    security_groups = [aws_security_group.resumate_api_lb_sg.id] # Only allow from ALB
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# Security Group for Frontend ECS tasks
resource "aws_security_group" "resumate_frontend_sg" {
  name        = "resumate-ai-frontend-sg"
  description = "Allow traffic to frontend ECS tasks"
  vpc_id      = aws_vpc.resumate_vpc.id

  ingress {
    from_port       = 3000
    to_port         = 3000
    protocol        = "tcp"
    security_groups = [aws_security_group.resumate_api_lb.id] # Only allow from ALB or CloudFront origin
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# Security Group for ALB (to allow public access)
resource "aws_security_group" "resumate_api_lb_sg" {
  name        = "resumate-ai-api-lb-sg"
  description = "Allow HTTP/HTTPS traffic to ALB"
  vpc_id      = aws_vpc.resumate_vpc.id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}
