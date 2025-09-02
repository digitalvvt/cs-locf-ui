#!/bin/bash

# AWS ECR Login Credentials
aws_arn="885134767910.dkr.ecr.ap-south-1.amazonaws.com"

# Login to ECR
aws ecr get-login-password --region ap-south-1 | docker login --username AWS --password-stdin "$aws_arn"

# Editable Variables
project_name="cs"
product_name="locf"
repo_name="ui"

# Auto-Generated Variables
container_name="${project_name}_${product_name}_${repo_name}"
deployment_group_name="$DEPLOYMENT_GROUP_NAME"
release_version=$(aws ssm get-parameter --name "${container_name}_${deployment_group_name}" --query "Parameter.Value" --output text)

# Deployment Info
echo "================================================="
echo "Starting Deployment"
echo "Container Name: $container_name"
echo "Deployment Group: $deployment_group_name"
echo "Release Version: $release_version"
echo "================================================="

# Remove existing image to force a fresh pull
docker image rm "$aws_arn/${project_name}-${product_name}-${deployment_group_name}:${container_name}_v_${release_version}" || true

# Pull latest image from ECR
docker pull "$aws_arn/${project_name}-${product_name}-${deployment_group_name}:${container_name}_v_${release_version}"

# Tag the pulled image locally
docker image tag "$aws_arn/${project_name}-${product_name}-${deployment_group_name}:${container_name}_v_${release_version}" "$container_name:$release_version"

# AppArmor cleanup
sudo aa-remove-unknown || true

# Stop and Remove existing container
docker stop "$container_name" || true
docker rm -f "$container_name" || true

# Start new container
docker run -d -p 8080:8080 --name "$container_name" "$container_name:$release_version"

# Clean up unused images
docker image prune -af

# Final Status
echo "Deployment complete: $container_name running with version $release_version"
