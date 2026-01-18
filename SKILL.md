# Git Release Management Skill

This skill provides automated git release management functionality, including pushing the latest commits to the remote repository.

## Overview

The Git Release Management Skill helps manage version releases and deployment by ensuring all local commits are pushed to the remote repository. It handles common git operations required for releasing code changes.

## Features

- **Status Check**: Verify current git status before operations
- **Commit Management**: Stage and commit pending changes
- **Push Operations**: Push latest commits to remote repository
- **Release Tagging**: Create version tags for releases
- **Branch Management**: Handle different branches for releases

## Usage

### Basic Push Operation

To push the latest commits to the remote repository:

```bash
git add .
git commit -m "Release: Update features"
git push origin main
```

### Release Process

1. Check git status: `git status`
2. Stage changes: `git add .`
3. Commit with release message: `git commit -m "Release v1.0.0"`
4. Push to remote: `git push origin main`
5. Create tag: `git tag v1.0.0 && git push --tags`

## Commands

### Push Latest Commits

```bash
# Stage all changes
git add .

# Commit with a release message
git commit -m "Release: Latest updates"

# Push to remote
git push origin main
```

### Create Release Tag

```bash
# Create annotated tag
git tag -a v1.0.0 -m "Release version 1.0.0"

# Push tag to remote
git push origin v1.0.0
```

## Best Practices

- Always check `git status` before pushing
- Use descriptive commit messages
- Tag releases with semantic versioning (e.g., v1.0.0)
- Push tags separately after commits
- Ensure CI/CD pipelines are triggered by pushes

## Error Handling

If push fails due to conflicts:
1. Pull latest changes: `git pull origin main`
2. Resolve conflicts
3. Commit and push again

## Integration

This skill can be integrated with CI/CD pipelines to automate release processes upon successful builds.