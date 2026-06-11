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


# Stage 2

## Database Choice

I would use PostgreSQL because it provides reliable storage, supports relationships between users and notifications, and offers good query performance.

## Database Schema

### Users Table

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE
);
```

### Notifications Table

```sql
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    message TEXT,
    type VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### UserNotifications Table

```sql
CREATE TABLE user_notifications (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    notification_id INT REFERENCES notifications(id),
    is_read BOOLEAN DEFAULT FALSE
);
```

## Problems as Data Volume Increases

1. Slow queries
2. Large storage requirements
3. High user traffic
4. Delayed notification delivery

## Solutions

- Indexing
- Caching using Redis
- Database partitioning
- Read replicas

## SQL Queries

### Get All Notifications

```sql
SELECT * FROM notifications;
```

### Create Notification

```sql
INSERT INTO notifications(title, message, type)
VALUES ('Placement Drive','Amazon Hiring','placement');
```

### Mark Notification As Read

```sql
UPDATE user_notifications
SET is_read = TRUE
WHERE notification_id = 1;
```

# Stage 3

## Is the Query Accurate?

```sql
SELECT * FROM notifications
WHERE studentID = 1042 AND isRead = false
ORDER BY createdAt DESC;
```

Yes, the query is logically correct because it fetches all unread notifications of student 1042 and sorts them by newest first.

## Why Is It Slow?

The notifications table contains approximately 5,000,000 records.

Without proper indexes, the database must scan a very large number of rows before finding matching notifications.

The query also sorts results using createdAt, which further increases execution time.

## Improvements

Create a composite index:

```sql
CREATE INDEX idx_notifications_student_read_created
ON notifications(studentID, isRead, createdAt DESC);
```

## Computation Cost

Without index: O(N)

With index: O(log N)

## Should We Add Indexes On Every Column?

No.

Adding indexes on every column increases storage usage and slows down insert, update, and delete operations.

Indexes should only be created on frequently searched or sorted columns.

## Query To Find Students Who Received Placement Notifications In Last 7 Days

```sql
SELECT DISTINCT studentID
FROM notifications
WHERE notification_type = 'Placements'
AND createdAt >= NOW() - INTERVAL '7 days';
```


# Stage 4

## Problem

Currently, notifications are fetched from the database every time a student loads a page. This creates a large number of database requests and can overwhelm the database, resulting in slow response times and poor user experience.

## Solution 1: Caching Using Redis

Store frequently accessed notifications in Redis cache.

### Advantages

- Faster response times
- Reduced database load
- Improved user experience

### Tradeoffs

- Additional infrastructure required
- Cache invalidation must be handled correctly

## Solution 2: Real-Time Notifications Using WebSockets

Instead of requesting notifications on every page load, the server can push notifications to students in real time.

### Advantages

- Instant notification delivery
- Fewer database queries

### Tradeoffs

- More complex implementation
- Persistent connections consume server resources

## Solution 3: Pagination

Example:

GET /notifications?page=1&limit=20

### Advantages

- Reduced data transfer
- Faster API responses

### Tradeoffs

- Additional API logic required

## Solution 4: Database Indexing

Create indexes on frequently searched columns.

### Advantages

- Faster query execution

### Tradeoffs

- Increased storage consumption

## Recommended Approach

Use Redis Caching + WebSockets + Pagination + Proper Database Indexing for best performance.