# Practice backend concepts

This project aims to practice the following backend and arquitecture concepts:

- Monorepo
- 3 backends deployed locally
  - 1 working as a BFF (Backend For Frontend) or API Gateway
  - 1 auth service providing authentication and centralized permissions
  - 1 books service for resource management (CRUD on any resource)
- Task processing with Queue

## BFF service (REST API Gateway)

This service will be responsible of:

- Working as API Gateway
- Orchestrating requests
- Create API Gateway logs

## Auth service (REST API service)

This auth service will be responsible of:

- [x] Sign up
- [x] Sign in
- [x] Get *user profile*
- [ ] Get *user permissions*
- [ ] General permission management
- [ ] Log requests or failures for monitoring

Resources:
- Local Docker deployment
  - Backend
  - Database
    - users
      - user.permissions: permission\[\]
    - permissions

## Books service (REST API service)

This books service will be responsible of:

- [x] CRUD operations
- [ ] Limit CRUD operations depending on the permissions returned through the auth-microservice
- [ ] Log requests or failures

Resources:
- Local Docker deployment
  - [ ] Backend
  - [x] Database
    - [x] books