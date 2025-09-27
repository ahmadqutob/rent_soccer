# Football News Posts API Guide

## Overview
The Posts API allows users to create, read, update, and delete football news posts with image support. This system includes comprehensive validation, image upload to Cloudinary, and full CRUD operations.

## API Endpoints

### 1. Create Post
**POST** `/posts/create`

Creates a new football news post with image upload.

**Authentication:** Required (Admin or User)
**Content-Type:** `multipart/form-data`

**Request Body:**
- `title` (string, required): Post title (5-100 characters)
- `content` (string, required): Post content (50-5000 characters)
- `excerpt` (string, required): Post excerpt (max 200 characters)
- `category` (string, optional): Post category (news, match-report, transfer, analysis, opinion, other)
- `tags` (array, optional): Array of tags (max 10 tags, each max 20 characters)
- `featured` (boolean, optional): Whether post is featured (default: false)
- `published` (boolean, optional): Whether post is published (default: false)
- `mainImage` (file, required): Main image file (PNG, JPG, JPEG)
- `subImage` (files, optional): Additional images (max 5 files)

**Example Request:**
```bash
POST /posts/create
Authorization: Bearer <token>
Content-Type: multipart/form-data

Form Data:
- title: "Manchester United Wins Champions League"
- content: "In a thrilling match at Wembley Stadium..."
- excerpt: "Manchester United secures victory in the Champions League final"
- category: "match-report"
- tags: ["champions-league", "manchester-united", "victory"]
- featured: true
- published: true
- mainImage: [image file]
- subImage: [image files]
```

**Response:**
```json
{
  "success": true,
  "message": "Football news post created successfully",
  "data": {
    "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "title": "Manchester United Wins Champions League",
    "slug": "manchester-united-wins-champions-league",
    "content": "In a thrilling match at Wembley Stadium...",
    "excerpt": "Manchester United secures victory in the Champions League final",
    "category": "match-report",
    "tags": ["champions-league", "manchester-united", "victory"],
    "mainImage": {
      "url": "https://res.cloudinary.com/...",
      "public_id": "posts/main/..."
    },
    "subImages": [...],
    "featured": true,
    "published": true,
    "views": 0,
    "likes": [],
    "author": "60f7b3b3b3b3b3b3b3b3b3b3",
    "createdAt": "2023-07-20T10:30:00.000Z",
    "updatedAt": "2023-07-20T10:30:00.000Z"
  }
}
```

### 2. Get All Posts
**GET** `/posts`

Retrieves all posts with filtering and pagination.

**Authentication:** Not required

**Query Parameters:**
- `page` (number, optional): Page number (default: 1)
- `limit` (number, optional): Posts per page (default: 10, max: 50)
- `category` (string, optional): Filter by category
- `featured` (boolean, optional): Filter by featured status
- `published` (boolean, optional): Filter by published status (default: true)
- `author` (string, optional): Filter by author ID
- `search` (string, optional): Search in title, content, excerpt, and tags
- `sort` (string, optional): Sort order (default: -createdAt)

**Example Request:**
```bash
GET /posts?page=1&limit=10&category=match-report&featured=true&search=champions
```

**Response:**
```json
{
  "success": true,
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "pages": 3
  },
  "data": [
    {
      "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
      "title": "Manchester United Wins Champions League",
      "slug": "manchester-united-wins-champions-league",
      "excerpt": "Manchester United secures victory...",
      "category": "match-report",
      "tags": ["champions-league", "manchester-united"],
      "mainImage": {
        "url": "https://res.cloudinary.com/...",
        "public_id": "posts/main/..."
      },
      "featured": true,
      "published": true,
      "views": 150,
      "likesCount": 25,
      "readingTime": 3,
      "author": {
        "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
        "userName": "john_doe",
        "email": "john@example.com"
      },
      "createdAt": "2023-07-20T10:30:00.000Z"
    }
  ]
}
```

### 3. Get Single Post
**GET** `/posts/:id`

Retrieves a single post by ID and increments view count.

**Authentication:** Not required

**Example Request:**
```bash
GET /posts/60f7b3b3b3b3b3b3b3b3b3b3
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "title": "Manchester United Wins Champions League",
    "slug": "manchester-united-wins-champions-league",
    "content": "In a thrilling match at Wembley Stadium...",
    "excerpt": "Manchester United secures victory...",
    "category": "match-report",
    "tags": ["champions-league", "manchester-united", "victory"],
    "mainImage": {
      "url": "https://res.cloudinary.com/...",
      "public_id": "posts/main/..."
    },
    "subImages": [...],
    "featured": true,
    "published": true,
    "views": 151,
    "likes": ["60f7b3b3b3b3b3b3b3b3b3b4"],
    "likesCount": 1,
    "readingTime": 3,
    "author": {
      "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
      "userName": "john_doe",
      "email": "john@example.com"
    },
    "createdAt": "2023-07-20T10:30:00.000Z",
    "updatedAt": "2023-07-20T10:30:00.000Z"
  }
}
```

### 4. Update Post
**PUT** `/posts/:id`

Updates an existing post. Only the author or admin can update.

**Authentication:** Required (Admin or User)
**Content-Type:** `multipart/form-data`

**Request Body:** Same as create post (all fields optional)

**Example Request:**
```bash
PUT /posts/60f7b3b3b3b3b3b3b3b3b3b3
Authorization: Bearer <token>
Content-Type: multipart/form-data

Form Data:
- title: "Updated: Manchester United Wins Champions League"
- content: "Updated content..."
- mainImage: [new image file]
```

**Response:**
```json
{
  "success": true,
  "message": "Post updated successfully",
  "data": {
    // Updated post data
  }
}
```

### 5. Delete Post
**DELETE** `/posts/:id`

Soft deletes a post. Only the author or admin can delete.

**Authentication:** Required (Admin or User)

**Example Request:**
```bash
DELETE /posts/60f7b3b3b3b3b3b3b3b3b3b3
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Post deleted successfully"
}
```

### 6. Like/Unlike Post
**PATCH** `/posts/:id/like`

Toggles like status for a post.

**Authentication:** Required (Admin or User)

**Example Request:**
```bash
PATCH /posts/60f7b3b3b3b3b3b3b3b3b3b3/like
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Post liked successfully",
  "liked": true
}
```

## Post Categories
- `news`: General football news
- `match-report`: Match reports and analysis
- `transfer`: Transfer news and rumors
- `analysis`: Tactical analysis and insights
- `opinion`: Opinion pieces and editorials
- `other`: Other football-related content

## Image Specifications
- **Main Image**: Required, optimized to 800x600px
- **Sub Images**: Optional, up to 5 images, optimized to 600x400px
- **Supported Formats**: PNG, JPG, JPEG
- **Storage**: Cloudinary with automatic optimization

## Features
- **Image Upload**: Automatic upload to Cloudinary with optimization
- **Slug Generation**: Automatic URL-friendly slug from title
- **View Tracking**: Automatic view count increment
- **Like System**: Users can like/unlike posts
- **Search**: Full-text search across title, content, excerpt, and tags
- **Filtering**: Filter by category, featured status, author, etc.
- **Pagination**: Efficient pagination for large datasets
- **Soft Delete**: Posts are soft deleted, not permanently removed
- **Reading Time**: Automatic reading time estimation
- **Author Population**: Author information included in responses

## Error Handling
- **400**: Bad Request (validation errors, missing required fields)
- **401**: Unauthorized (missing or invalid token)
- **403**: Forbidden (insufficient permissions)
- **404**: Not Found (post doesn't exist)
- **500**: Internal Server Error (server issues)

## Validation Rules
- **Title**: 5-100 characters, required
- **Content**: 50-5000 characters, required
- **Excerpt**: Max 200 characters, required
- **Tags**: Max 10 tags, each max 20 characters
- **Category**: Must be one of the predefined categories
- **Images**: Main image required, sub images optional (max 5)

## Security Features
- **Authorization**: Role-based access control
- **File Validation**: Only image files allowed
- **Input Sanitization**: All inputs validated and sanitized
- **Soft Delete**: Data preservation for recovery
- **Image Cleanup**: Automatic cleanup of uploaded files

