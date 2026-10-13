# Presentation with Animation

This project focuses on creating interactive presentations with smooth animations using modern web technologies.

## Core Principles

### 1. Test-Driven Development (TDD)

- Red-Green-Refactor cycle **MUST** be followed for all development.
- All new features and bug fixes **MUST** have corresponding tests that cover the functionality being implemented or fixed.
- Tests **MUST** be written before the implementation based on the requirements and expected behavior of the feature or bug fix.

### 2. Quality Gates

- All code **MUST** pass linting checks and adhere to the project's coding standards.
- All code **MUST** have a code coverage of at least 80% for new features and bug fixes.
- All tests **MUST** pass.

## Technical Stack

- TypeScript
- Next.js for the frontend framework
- GSAP and ScrollTrigger for animations
- Jest for unit testing
- Playwright for end-to-end testing
- ESLint and Prettier for linting and code formatting

## Project and Code Guidelines

- Must follow Google TypeScript Style Guide
- Types must be explicitly defined for all classes, interfaces, constants, variables, function parameters, and return types.
- Type "any" **MUST NOT** be used. All types must be explicitly defined to ensure type safety and maintainability.
- Docstrings **MUST** be provided for all public classes, interfaces, and functions.
- Must use Next.js App Router for routing.
