resource "aws_vpc" "resumate_vpc" {
  cidr_block = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name = "resumate-ai-vpc"
  }
}

resource "aws_internet_gateway" "resumate_igw" {
  vpc_id = aws_vpc.resumate_vpc.id

  tags = {
    Name = "resumate-ai-igw"
  }
}

resource "aws_subnet" "resumate_public_subnet_a" {
  vpc_id                  = aws_vpc.resumate_vpc.id
  cidr_block              = "10.0.1.0/24"
  availability_zone       = "${var.aws_region}a"
  map_public_ip_on_launch = true

  tags = {
    Name = "resumate-ai-public-subnet-a"
  }
}

resource "aws_subnet" "resumate_private_subnet_a" {
  vpc_id            = aws_vpc.resumate_vpc.id
  cidr_block        = "10.0.101.0/24"
  availability_zone = "${var.aws_region}a"

  tags = {
    Name = "resumate-ai-private-subnet-a"
  }
}

resource "aws_route_table" "resumate_public_rt" {
  vpc_id = aws_vpc.resumate_vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.resumate_igw.id
  }

  tags = {
    Name = "resumate-ai-public-rt"
  }
}

resource "aws_route_table_association" "resumate_public_rta_a" {
  subnet_id      = aws_subnet.resumate_public_subnet_a.id
  route_table_id = aws_route_table.resumate_public_rt.id
}

# More subnets and NAT gateways would be added for high availability across AZs
