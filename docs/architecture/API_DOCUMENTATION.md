# 📚 Scorpion26 API Documentation

**Version:** 1.0.0  
**Base URL:** `https://your-domain.com/api`

---

## 🔐 Authentication

All authenticated endpoints require a valid session token. Include the session cookie in your requests.

### Authentication Flow

1. **Register:** `POST /api/auth/register`
2. **Login:** `POST /api/auth/login`
3. **Logout:** `POST /api/auth/logout`

---

## 📋 API Endpoints

### Authentication APIs

#### POST /api/auth/register
Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "name": "John Doe"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": { "id": "uuid", "email": "user@example.com" },
    "session": { "access_token": "...", "refresh_token": "..." }
  }
}
```

#### POST /api/auth/login
Authenticate an existing user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": { "id": "uuid", "email": "user@example.com" },
    "session": { "access_token": "...", "refresh_token": "..." },
    "role": "member"
  }
}
```

#### POST /api/auth/logout
Log out the current user.

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

#### POST /api/auth/reset-password
Request a password reset email.

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

---

### Program APIs

#### GET /api/programs
List all published programs.

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 20)
- `category` (string): Filter by category
- `difficulty` (string): Filter by difficulty

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "Strength Training 101",
      "description": "Build muscle and strength",
      "category": "strength",
      "difficulty": "beginner",
      "duration": "8 weeks",
      "is_published": true
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 50,
    "totalPages": 3
  }
}
```

#### POST /api/programs
Create a new program (requires `MANAGE_CONTENT` permission).

**Request Body:**
```json
{
  "title": "Advanced HIIT",
  "description": "High-intensity interval training",
  "category": "cardio",
  "difficulty": "advanced",
  "duration": "4 weeks"
}
```

---

### Community APIs

#### GET /api/community/posts
List community posts.

**Query Parameters:**
- `page` (number): Page number
- `limit` (number): Items per page

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "content": "Just completed my first workout!",
      "likes_count": 15,
      "comments_count": 3,
      "created_at": "2025-11-03T12:00:00Z"
    }
  ]
}
```

#### POST /api/community/posts
Create a new post.

**Request Body:**
```json
{
  "content": "Feeling great after today's workout!",
  "media_urls": ["https://..."],
  "visibility": "public"
}
```

#### POST /api/community/posts/[id]/like
Like or unlike a post.

**Response:**
```json
{
  "success": true,
  "data": {
    "liked": true,
    "likes_count": 16
  }
}
```

---

### Progress APIs

#### GET /api/progress
Get user's progress data.

**Response:**
```json
{
  "success": true,
  "data": {
    "workouts_completed": 45,
    "current_streak": 7,
    "total_minutes": 2340,
    "achievements": 12
  }
}
```

#### POST /api/progress
Log a workout completion.

**Request Body:**
```json
{
  "workout_id": "uuid",
  "duration_minutes": 45,
  "notes": "Great session!",
  "rating": 5
}
```

#### GET /api/progress/stats
Get detailed progress statistics.

**Response:**
```json
{
  "success": true,
  "data": {
    "weekly_stats": { "workouts": 5, "minutes": 225 },
    "monthly_stats": { "workouts": 20, "minutes": 900 },
    "body_measurements": [...]
  }
}
```

#### POST /api/progress/photos
Upload progress photos.

**Request Body:** (multipart/form-data)
- `photos`: File uploads
- `date`: Date of photos
- `visibility`: "private" or "public"

---

### Subscription APIs

#### GET /api/subscriptions/plans
List available subscription plans.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Monthly Membership",
      "price_monthly": 29.99,
      "features": ["All programs", "Unlimited workouts", "Progress tracking"],
      "stripe_price_id_monthly": "price_..."
    }
  ]
}
```

#### POST /api/subscriptions/checkout
Create a checkout session.

**Request Body:**
```json
{
  "plan_id": 1,
  "billing_period": "monthly"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "checkout_url": "https://checkout.stripe.com/..."
  }
}
```

#### GET /api/subscriptions/my
Get current user's subscription.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "plan_id": 1,
    "status": "active",
    "current_period_end": "2025-12-03T12:00:00Z",
    "cancel_at_period_end": false
  }
}
```

---

### User APIs (Admin Only)

#### GET /api/users
List all users (requires `MANAGE_USERS` permission).

**Query Parameters:**
- `page` (number): Page number
- `limit` (number): Items per page
- `role` (string): Filter by role

#### GET /api/users/[id]
Get user details.

#### PUT /api/users/[id]
Update user information.

#### DELETE /api/users/[id]
Delete a user account.

---

### Checkout APIs

#### POST /api/checkout/stripe
Create a Stripe checkout session.

**Request Body:**
```json
{
  "items": [
    { "price_id": "price_...", "quantity": 1 }
  ],
  "success_url": "https://...",
  "cancel_url": "https://..."
}
```

#### POST /api/checkout/shopify
Create a Shopify checkout.

**Request Body:**
```json
{
  "items": [
    { "variant_id": "...", "quantity": 1 }
  ]
}
```

---

### Support APIs

#### GET /api/support/tickets
List user's support tickets.

**Query Parameters:**
- `status` (string): Filter by status ("open", "closed")

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "subject": "Login Issue",
      "description": "Cannot access my account",
      "status": "open",
      "priority": "high",
      "created_at": "2025-11-03T12:00:00Z"
    }
  ]
}
```

#### POST /api/support/tickets
Create a new support ticket.

**Request Body:**
```json
{
  "subject": "Payment Issue",
  "description": "My payment failed but I was charged",
  "priority": "high",
  "category": "billing"
}
```

---

### Admin APIs

#### GET /api/admin/audit-logs
View audit logs (requires `VIEW_AUDIT_LOGS` permission).

**Query Parameters:**
- `page` (number): Page number
- `limit` (number): Items per page
- `user_id` (string): Filter by user
- `action` (string): Filter by action

---

### Utility APIs

#### POST /api/upload
Upload files to storage.

**Request Body:** (multipart/form-data)
- `file`: File to upload
- `bucket`: Storage bucket name
- `path`: File path

**Response:**
```json
{
  "success": true,
  "data": {
    "url": "https://storage.../file.jpg",
    "path": "uploads/file.jpg"
  }
}
```

#### GET /api/workouts
List workouts.

#### POST /api/workouts
Create a new workout.

#### GET /api/brand-config
Get brand configuration.

#### PUT /api/brand-config
Update brand configuration (admin only).

---

## 🔒 Permissions

### Role Hierarchy
1. **Admin** - Full system access
2. **Team** - Internal team access
3. **Collaborator** - Content contributor
4. **Member** - Paid subscription
5. **Guest** - Trial access

### Permission List
- `VIEW_PREMIUM_CONTENT`
- `CREATE_CUSTOM_WORKOUTS`
- `POST_COMMUNITY`
- `VIEW_MEMBER_DISCOUNTS`
- `VIEW_OWN_ANALYTICS`
- `MANAGE_CONTENT`
- `ACCESS_ADMIN_PANEL`
- `MANAGE_USERS`
- `MANAGE_ROLES`
- `VIEW_AUDIT_LOGS`
- `MANAGE_SUBSCRIPTIONS`
- `MANAGE_PAYMENTS`
- `MODERATE_COMMUNITY`
- `MANAGE_SUPPORT_TICKETS`
- `VIEW_ALL_ANALYTICS`

---

## 📊 Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional success message"
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message"
  }
}
```

### Common Error Codes
- `UNAUTHORIZED` - Authentication required
- `FORBIDDEN` - Insufficient permissions
- `NOT_FOUND` - Resource not found
- `VALIDATION_ERROR` - Invalid input data
- `DATABASE_ERROR` - Database operation failed
- `INTERNAL_ERROR` - Server error
- `RATE_LIMIT_EXCEEDED` - Too many requests

---

## 🚀 Rate Limiting

- **Default:** 100 requests per minute per IP
- **Authenticated:** 1000 requests per minute per user
- **Admin:** Unlimited

Rate limit headers:
- `X-RateLimit-Limit`: Maximum requests
- `X-RateLimit-Remaining`: Remaining requests
- `X-RateLimit-Reset`: Reset timestamp

---

## 🔗 Webhooks

### Stripe Webhook
**Endpoint:** `POST /api/webhooks/stripe`

**Events:**
- `checkout.session.completed`
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.payment_succeeded`
- `invoice.payment_failed`

---

## 📝 Notes

- All timestamps are in ISO 8601 format (UTC)
- All monetary amounts are in cents (USD)
- File uploads have a 10MB size limit
- API responses are cached for 60 seconds (where applicable)
- Pagination uses 1-based indexing

---

**Last Updated:** November 3, 2025  
**Contact:** support@scorpion26.com
