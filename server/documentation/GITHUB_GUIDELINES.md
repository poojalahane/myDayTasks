# GitHub Contribution Guidelines

Welcome to the `technical-interview-base` project! To maintain code quality and streamline collaboration, please adhere to the following guidelines when contributing to this project.

## Table of Contents

- [Branching Strategy](#branching-strategy)
- [Commit Messages](#commit-messages)
- [Pull Requests](#pull-requests)
- [Code Reviews](#code-reviews)
- [Issue Tracking](#issue-tracking)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Documentation](#documentation)
- [Security](#security)
- [Code of Conduct](#code-of-conduct)

## Branching Strategy

- **Main Branch**: The `main` branch contains the stable code base. Direct commits to `main` are prohibited.
- **Feature Branches**: Create branches for new features or bug fixes using the format:

  ```
  feat/brief-description
  fix/brief-description
  ```

- **Release Branches**: Used for preparing a new production release.

## Commit Messages

- Write clear and concise commit messages.
- Use the present tense (e.g., "Add feature" not "Added feature").
- Reference issues and pull requests when appropriate (e.g., "Fix login bug (#42)").

## Pull Requests

- Ensure your PR is up-to-date with the `main` branch.
- Provide a clear description of the changes.
- Link to any relevant issues.
- Assign at least one reviewer.
- Pass all continuous integration checks before requesting a review.

## Code Reviews

- Be respectful and constructive in your feedback.
- Focus on code quality, readability, and maintainability.
- Reviewers should provide feedback within 2 business days.

## Issue Tracking

- Use GitHub Issues to report bugs or request features.
- Provide detailed information, including steps to reproduce, expected behavior, and screenshots if necessary.
- Label issues appropriately (e.g., `bug`, `enhancement`, `question`).

## Coding Standards

- Follow the [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript) for JavaScript code.
- Use ESLint and Prettier for linting and formatting.
- Keep functions and classes small and focused.
- Comment complex or critical sections of code.

## Testing

- Write unit tests for new features and bug fixes.
- Ensure all tests pass before submitting a pull request.
- Aim for high test coverage.

## Documentation

- Update the documentation in the `README.md` and relevant `.md` files.
- Document public APIs and modules using JSDoc comments.

## Security

- Do not commit sensitive information (e.g., passwords, API keys).
- Report security vulnerabilities directly to the project maintainers.

