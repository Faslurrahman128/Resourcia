# Smart Campus Team Development Structure

This file defines the recommended module structure so each member can work independently after pushing to GitHub.

## Member 1 - Facilities and Assets

Backend package root:
- `com.smartcampus.facilities`

Suggested package layout:
- `controller` - Resource and resource-type endpoints
- `service` - Facilities business logic
- `repository` - JPA repositories for resources and resource types
- `dto` - Request and response DTOs
- `model` - Resource and resource-type entities

## Member 2 - Booking Management

Current implementation root:
- `com.smartcampus.booking`

This module currently contains booking APIs, conflict checks, status workflow, and user/admin booking views.

## Member 3 - Tickets and Maintenance

Backend package root:
- `com.smartcampus.tickets`

Suggested package layout:
- `controller` - Ticket CRUD, comments, technician assignment endpoints
- `service` - Ticket workflow and assignment logic
- `repository` - Ticket, comment, image, assignment repositories
- `dto` - Ticket request and response models
- `model` - Ticket domain entities

## Member 4 - Auth and Notifications

Backend package root:
- `com.smartcampus.auth`

Suggested package layout:
- `controller` - Auth and notification endpoints
- `service` - Login, role access, notification delivery
- `repository` - User, role, user-role, notification repositories
- `dto` - Auth and notification request/response models
- `model` - User, role, mapping, notification entities

## Frontend Module Layout

Module folders are created under:
- `frontend/src/modules/facilities`
- `frontend/src/modules/tickets`
- `frontend/src/modules/auth`

Each module has:
- `pages`
- `components`
- `services`

## Notes

- Existing app routes and APIs are unchanged.
- This scaffold is intentionally non-breaking and ready for incremental development.
- Use feature branches per member, then merge to avoid conflicts.
