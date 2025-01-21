# Practice backend concepts

This project aims to practice the following backend and arquitecture concepts:

- Monorepo
- 3 backends deployed locally
  - 1 working as a BFF (Backend For Frontend) or Backend entry point
  - 1 auth service providing authentication and centralized

## BFF service (REST API Gateway)

This service will be responsible of:

- Working as API Gateway
- Create API Gateway logs

## Auth service (REST API service)

This auth service will be responsible of:

- Authenticating credentials
- Exposing an endpoint for retrieving the *user profile*
- Exposing an endpoint for retrieving the *user profile*
- Exposing an endpoint for retrieving the *user permissions*
- Log requests or failures

Resources:
- Local Docker deployment
  - Backend
  - Database
    - user
    - user-permissions
    - permissions

## The Books service (REST API service)

This books service will be responsible of:

- CRUD operations
- Limit CRUD operations depending on the permissions returned through the auth-microservice
- Log requests or failures