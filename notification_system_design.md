# Stage 1

## Notification APIs

### Get All Notifications

GET /notifications

Headers:
Authorization: Bearer <token>
Content-Type: application/json

Response:

{
  "success": true,
  "notifications": [
    {
      "id": 1,
      "title": "Placement Drive",
      "message": "Amazon Hiring",
      "type": "placement",
      "read": false
    }
  ]
}

### Get Notification By Id

GET /notifications/{id}

### Create Notification

POST /notifications

Request:

{
  "title": "Placement Drive",
  "message": "Amazon Hiring",
  "type": "placement"
}

### Mark Notification As Read

PUT /notifications/{id}/read

Response:

{
  "success": true,
  "message": "Notification marked as read"
}

## Real Time Notification Design

Use WebSockets for real-time notifications.

Flow:

1. Student connects to WebSocket server.
2. New notification is created.
3. Server pushes notification instantly to connected users.
4. User receives notification without refreshing the page.