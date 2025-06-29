resource "aws_db_instance" "resumate_db_instance" {
  allocated_storage    = 20
  engine               = "postgres"
  engine_version       = "15.2"
  instance_class       = "db.t3.micro"
  db_name              = "resumate_db"
  username             = "user"
  password             = var.db_password
  parameter_group_name = "default.postgres15"
  skip_final_snapshot  = true
  publicly_accessible  = false # Best practice to keep private
  vpc_security_group_ids = [aws_security_group.resumate_rds_sg.id]
  db_subnet_group_name = aws_db_subnet_group.resumate_db_subnet_group.name

  tags = {
    Name = "resumate-ai-rds"
  }
}

resource "aws_db_subnet_group" "resumate_db_subnet_group" {
  name       = "resumate-ai-db-subnet-group"
  subnet_ids = [aws_subnet.resumate_private_subnet_a.id] # Use private subnets

  tags = {
    Name = "resumate-ai-db-subnet-group"
  }
}

resource "aws_security_group" "resumate_rds_sg" {
  name        = "resumate-ai-rds-sg"
  description = "Allow traffic to RDS from ECS tasks"
  vpc_id      = aws_vpc.resumate_vpc.id

  ingress {
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [aws_security_group.resumate_backend_sg.id] # Only allow from backend ECS SG
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}
