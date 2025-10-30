#!/bin/bash

# Deployment script for Scorpion26.00
# This script helps you push your code to GitHub

echo "🚀 Scorpion26.00 - GitHub Deployment Script"
echo "==========================================="
echo ""

# Check if git is initialized
if [ ! -d .git ]; then
    echo "❌ Error: Git repository not initialized"
    echo "Run: git init"
    exit 1
fi

# Prompt for GitHub username
echo "📝 Please enter your GitHub username:"
read -r GITHUB_USERNAME

if [ -z "$GITHUB_USERNAME" ]; then
    echo "❌ Error: GitHub username cannot be empty"
    exit 1
fi

# Prompt for repository name (with default)
echo ""
echo "📝 Please enter your repository name (default: scorpion26-fitness):"
read -r REPO_NAME

if [ -z "$REPO_NAME" ]; then
    REPO_NAME="scorpion26-fitness"
fi

# Construct the repository URL
REPO_URL="https://github.com/$GITHUB_USERNAME/$REPO_NAME.git"

echo ""
echo "🔗 Repository URL: $REPO_URL"
echo ""

# Check if remote already exists
if git remote get-url origin &> /dev/null; then
    echo "⚠️  Remote 'origin' already exists. Removing it..."
    git remote remove origin
fi

# Add the remote
echo "➕ Adding remote repository..."
git remote add origin "$REPO_URL"

if [ $? -ne 0 ]; then
    echo "❌ Error: Failed to add remote repository"
    exit 1
fi

echo "✅ Remote added successfully"
echo ""

# Rename branch to main if needed
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "main" ]; then
    echo "🔄 Renaming branch to 'main'..."
    git branch -M main
fi

# Push to GitHub
echo "⬆️  Pushing code to GitHub..."
echo ""
git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Success! Your code is now on GitHub"
    echo ""
    echo "🌐 View your repository at:"
    echo "   https://github.com/$GITHUB_USERNAME/$REPO_NAME"
    echo ""
    echo "📋 Next Steps:"
    echo "   1. Go to https://vercel.com"
    echo "   2. Click 'Add New...' → 'Project'"
    echo "   3. Import your repository: $REPO_NAME"
    echo "   4. Configure environment variables (see DEPLOYMENT_GUIDE.md)"
    echo "   5. Deploy!"
    echo ""
else
    echo ""
    echo "❌ Error: Failed to push to GitHub"
    echo ""
    echo "💡 Troubleshooting:"
    echo "   1. Make sure you've created the repository on GitHub first"
    echo "   2. Go to: https://github.com/new"
    echo "   3. Repository name: $REPO_NAME"
    echo "   4. Do NOT initialize with README"
    echo "   5. Create repository, then run this script again"
    echo ""
    exit 1
fi
