# User Schema Documentation

## Overview

The `User` schema defines the structure for storing user information in the database. It includes fields for authentication, session tracking, engagement metrics, and churn prediction.

## Schema Definition

```javascript
import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
  // Login Credentials
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  // Login Tracking
  lastLogin: { type: Date, default: null },
  lastLogout: { type: Date, default: null },

  // Session Tracking
  sessionDuration: [
    {
      loginTime: { type: Date },
      logoutTime: { type: Date },
      duration: { type: Number },
    },
  ],

  // Churn Prediction Metrics
  totalSessions: { type: Number, default: 0 },
  avgSessionDuration: { type: Number, default: 0 },
  engagementScore: { type: Number, default: 0 },
  lastActive: { type: Date },
  createdAt: { type: Date, default: Date.now },

  // Engagement Metrics
  engagementMetrics: {
    featureUsage: {
      search: { type: Number, default: 0 },
      profile: { type: Number, default: 0 },
      messages: { type: Number, default: 0 },
    },
    interactions: {
      lastInteractionDate: { type: Date },
      totalInteractions: { type: Number, default: 0 },
      dailyInteractionCounts: [
        {
          date: Date,
          count: Number,
        },
      ],
    },
    sessionQuality: {
      avgSessionDuration: { type: Number, default: 0 },
      bounceRate: { type: Number, default: 0 },
      deepSessions: { type: Number, default: 0 },
    },
  },
  engagementScore: { type: Number, default: 0 },
});
const userModel = mongoose.model("user", userSchema);
export default userModel;
```

## Field Descriptions

### **Authentication Fields**

| Field      | Type   | Description                     |
| ---------- | ------ | ------------------------------- |
| `name`     | String | User's full name (Required)     |
| `email`    | String | User's email (Unique, Required) |
| `password` | String | Hashed password (Required)      |

### **Login Tracking**

| Field        | Type | Description              |
| ------------ | ---- | ------------------------ |
| `lastLogin`  | Date | Timestamp of last login  |
| `lastLogout` | Date | Timestamp of last logout |

### **Session Tracking**

| Field             | Type   | Description                        |
| ----------------- | ------ | ---------------------------------- |
| `sessionDuration` | Array  | Tracks each login/logout session   |
| `loginTime`       | Date   | Timestamp when the session started |
| `logoutTime`      | Date   | Timestamp when the session ended   |
| `duration`        | Number | Duration of the session in minutes |

### **Churn Prediction Metrics**

| Field                | Type   | Description                                 |
| -------------------- | ------ | ------------------------------------------- |
| `totalSessions`      | Number | Total number of sessions a user had         |
| `avgSessionDuration` | Number | Average session duration in minutes         |
| `engagementScore`    | Number | A computed score based on user activity     |
| `lastActive`         | Date   | Timestamp of the user's last activity       |
| `createdAt`          | Date   | Timestamp when the user account was created |

### **Engagement Metrics**

#### **Feature Usage**

| Field      | Type   | Description                          |
| ---------- | ------ | ------------------------------------ |
| `search`   | Number | Number of times the user used search |
| `profile`  | Number | Number of profile views              |
| `messages` | Number | Number of messages sent              |

#### **Interactions**

| Field                    | Type   | Description                                     |
| ------------------------ | ------ | ----------------------------------------------- |
| `lastInteractionDate`    | Date   | Last time the user interacted with the platform |
| `totalInteractions`      | Number | Total number of user interactions               |
| `dailyInteractionCounts` | Array  | Daily interaction count logs                    |

#### **Session Quality**

| Field                | Type   | Description                              |
| -------------------- | ------ | ---------------------------------------- |
| `avgSessionDuration` | Number | Average session duration in minutes      |
| `bounceRate`         | Number | Percentage of sessions under 1 minute    |
| `deepSessions`       | Number | Count of sessions longer than 10 minutes |

### **Engagement Score**

| Field             | Type   | Description                                      |
| ----------------- | ------ | ------------------------------------------------ |
| `engagementScore` | Number | Final engagement score computed based on metrics |

## Model Export

The model is exported as `userModel` and can be imported using:

```javascript
import userModel from "./path-to-model";
```

## Usage Example

Example of how to create a new user:

```javascript
import userModel from "./models/userModel";

const newUser = new userModel({
  name: "John Doe",
  email: "johndoe@example.com",
  password: "hashedpassword123",
});

async function saveUser {
  await newUser.save()
}


```

-# User Routes Documentation

## **1. Route: Generate Fake Users**

### **Endpoint:**

`GET /generate`

### **Description:**

This route generates and inserts 100 fake users into the database using Faker.js. It assigns different engagement metrics and risk categories (high, medium, low) based on randomized factors.

### **Request:**

- Method: `GET`
- URL: `/`
- No request body required.

### **Response:**

#### **Success Response (201 Created):**

```json
{
  "message": "Users generated successfully!",
  "users": [
    {
      "_id": "60d...",
      "name": "John Doe",
      "email": "johndoe@example.com",
      "password": "$2b$10$...",
      "createdAt": "2023-02-01T10:00:00.000Z",
      "lastLogin": "2024-02-15T12:00:00.000Z",
      "sessionDuration": [
        {
          "loginTime": "2024-01-01T08:00:00.000Z",
          "logoutTime": "2024-01-01T08:30:00.000Z",
          "duration": 1800000
        }
      ]
    }
  ]
}
```

#### **Error Response (500 Internal Server Error):**

```json
{
  "error": "Internal server error"
}
```

### **Functionality Details:**

1. **Generates 100 fake users** with different engagement and risk metrics:
   - **Risk Categories:** High, Medium, Low
   - **Metrics Based on Risk:** Days since last login, total sessions, average session duration, engagement trend
2. **Randomizes user data** using `faker.js`, including:
   - Name, Email
   - Hashed password (`bcrypt`)
   - CreatedAt, LastLogin timestamps
   - Session history (Login and Logout timestamps)
3. **Inserts users into MongoDB** using `insertMany`.
4. **Returns a success message** along with generated user data.

### **Technology Used:**

- **Express.js** for API routing
- **MongoDB (Mongoose)** for database interactions
- **Faker.js** for generating fake data
- **bcrypt** for password hashing

---

### **Notes:**

- Adjust path if `userModel.js` is located elsewhere.
- Modify the `bcrypt.hashSync` default password for security.
- Ensure MongoDB connection (`configDB()`) is properly set up before running the route.

---

## **2. Route: Create New User**

### **Endpoint:**

`POST /`

### **Description:**

This route creates a new user in the database with the provided `name`, `email`, and `password`.

### **Request:**

- Method: `POST`
- URL: `/signup`
- Body (JSON):

```json
{
  "name": "John Doe",
  "email": "johndoe@example.com",
  "password": "securepassword"
}
```

### **Response:**

#### **Success Response (201 Created):**

```json
{
  "_id": "60d...",
  "name": "John Doe",
  "email": "johndoe@example.com",
  "password": "$2b$10$..."
}
```

#### **Error Response (500 Internal Server Error):**

```json
{
  "message": "Internal server error"
}
```

### **Functionality Details:**

1. Extracts `name`, `email`, and `password` from the request body.
2. Hashes the password using `bcrypt`.
3. Creates a new user document in MongoDB.
4. Saves the user to the database.
5. Returns the newly created user data.

### **Technology Used:**

- **Express.js** for API routing
- **MongoDB (Mongoose)** for database interactions
- **bcrypt** for password hashing

---

# Authentication and Analytics API

## Overview

This API provides user authentication and activity tracking endpoints, including login, logout, active users, and retention rate calculations.

## Routes

### 1. User Login

**Endpoint:** `POST users/login`

**Description:** Authenticates a user with email and password. Updates the last login time on successful login.

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "yourpassword"
}
```

**Responses:**

- `200 OK`: Login successful
- `404 Not Found`: User not found
- `401 Unauthorized`: Invalid credentials
- `500 Internal Server Error`: Server error

---

### 2. User Logout

**Endpoint:** `POST users/logout`

**Description:** Logs out the user, records logout time, and stores session duration.

**Request Body:**

```json
{
  "email": "user@example.com"
}
```

**Responses:**

- `200 OK`: Logout successful
- `400 Bad Request`: User not logged in
- `500 Internal Server Error`: Server error

---

### 3. Active Users Statistics

**Endpoint:** `GET users/active-users`

**Description:** Retrieves the count of active users for different timeframes (daily, weekly, and monthly) and the total user count.

**Responses:**

```json
{
  "dailyActive": 10,
  "weeklyActive": 50,
  "monthlyActive": 200,
  "totalUsers": 500
}
```

- `200 OK`: Successfully retrieved active users data
- `500 Internal Server Error`: Server error

---

### 4. User Retention Rate

**Endpoint:** `GET users/retention`

**Description:** Calculates and returns the retention rate based on daily and weekly active users.

**Responses:**

```json
{
  "dailyActiveUsers": 10,
  "weeklyActiveUsers": 50,
  "retentionRate": "20.00"
}
```

- `200 OK`: Successfully retrieved retention rate
- `500 Internal Server Error`: Server error

# Engagement Score API Routes

## Overview

This document describes the API endpoints used to retrieve user engagement scores and analyze user activity trends. The engagement score is calculated based on various user activity metrics such as recency, frequency, session duration, feature usage, and consistency.

---

## **1. Get Engagement Score for All Users**

### **Endpoint:**

```http
GET /engagement-score
```

### **Description:**

This route fetches all users from the database and calculates their engagement scores using the `calculateEngagementScore` function in the `EngagementScoring` class.

### **Response Format:**

Returns a JSON response containing an array of engagement scores for all users.

### **Example Response:**

```json
{
  "scores": [
    {
      "email": "user1@example.com",
      "totalScore": 85,
      "breakdown": {
        "recency": 90,
        "frequency": 80,
        "duration": 70,
        "featureUsage": 85,
        "consistency": 60
      },
      "insights": ["User engagement has dropped recently"]
    },
    {
      "email": "user2@example.com",
      "totalScore": 72,
      "breakdown": {
        "recency": 80,
        "frequency": 65,
        "duration": 55,
        "featureUsage": 60,
        "consistency": 40
      },
      "insights": [
        "User visits less frequently than ideal",
        "Sessions are shorter than average"
      ]
    }
  ]
}
```

### **Error Handling:**

- **500 Internal Server Error:** If an error occurs during the calculation or data fetching.

---

## **2. Get Engagement Scores with Email**

### **Endpoint:**

```http
GET /engagement-scores
```

### **Description:**

This route retrieves all users' email addresses along with their stored engagement scores directly from the database.

### **Response Format:**

Returns a JSON array of user emails and their corresponding engagement scores.

### **Example Response:**

```json
[
  {
    "email": "user1@example.com",
    "engagementScore": 85
  },
  {
    "email": "user2@example.com",
    "engagementScore": 72
  }
]
```

### **Error Handling:**

- **500 Internal Server Error:** If an error occurs while retrieving data from the database.

---

## **3. Get Retention Trends**

### **Endpoint:**

```http
GET users/retention-trends
```

### **Description:**

This route fetches user retention trends by aggregating user activity based on their last active date.

### **Response Format:**

Returns a JSON array of retention data grouped by date.

### **Example Response:**

```json
[
  {
    "_id": "2024-02-20",
    "retainedUsers": 120
  },
  {
    "_id": "2024-02-21",
    "retainedUsers": 98
  }
]
```

### **Error Handling:**

- **500 Internal Server Error:** If an error occurs while fetching retention data.

---

## **4. Get Active Users Over Time**

### **Endpoint:**

```http
GET users/active-users-overtime
```

### **Description:**

This route retrieves the number of active users per day based on their last login date.

### **Response Format:**

Returns a JSON array of daily active user counts.

### **Example Response:**

```json
[
  {
    "_id": "2024-02-20",
    "count": 150
  },
  {
    "_id": "2024-02-21",
    "count": 135
  }
]
```

### **Error Handling:**

- **500 Internal Server Error:** If an error occurs while retrieving active user data.

---

## **Dependencies & Related Functions**

### **Key Functions Used in These Routes:**

- `calculateEngagementScore(userId)`: Computes engagement score based on user activity metrics.
- `calculateRecencyScore(lastLogin, now)`: Calculates how recently the user has been active.
- `calculateFrequencyScore(sessions, now)`: Evaluates how often the user engages.
- `calculateDurationScore(sessionQuality)`: Measures the duration of user engagement.
- `calculateFeatureScore(featureUsage)`: Assesses how many platform features the user interacts with.
- `calculateConsistencyScore(interactions)`: Determines the consistency of the user's engagement.
- `generateInsights(scores)`: Provides insights based on engagement score breakdown.

---

## **Notes:**

- The `/engagement-score` route dynamically calculates the engagement scores and updates the database.
- The `/engagement-scores` route simply retrieves already stored scores without recalculating.
- The `/retention-trends` and `/active-users-overtime` routes help track user engagement trends over time.
- The scores are calculated using a weighted formula that considers multiple engagement factors.

For more details on engagement scoring methodology, refer to the `EngagementScoring` class in `engagement.js`. 🚀

# Churn Prediction and User Insights API

## Overview
This API provides endpoints for predicting user churn risk and generating user engagement insights. It analyzes user activity, engagement trends, and session durations to determine churn risk levels.

## Endpoints

### 1. `GET users/churn-prediction`
**Description:**
This route calculates churn risk levels for users based on their engagement metrics.

**Process:**
- Fetches all users from the database.
- Calculates engagement metrics using `calculateUserMetrics`.
- Determines risk level using `determineRiskLevel`.
- Categorizes users into `Low`, `Medium`, and `High` risk levels.
- Computes min, max, and average risk scores per category.
- Returns risk summary statistics.

**Response Example:**
```json
{
  "riskData": {
    "Low": {
      "total": 250,
      "count": 5,
      "min": 20,
      "max": 60,
      "minUser": "user1@example.com",
      "maxUser": "user2@example.com",
      "avg": 50
    },
    "Medium": { ... },
    "High": { ... }
  }
}
```

### 2. `GET users/user-insights`
**Description:**
This route provides detailed user engagement insights and churn predictions.

**Process:**
- Fetches all users.
- Computes engagement scores using `EngagementScoring.calculateEngagementScore`.
- Calculates key metrics using `calculateUserMetrics`.
- Identifies churn risk factors using `identifyRiskFactors`.
- Returns insights for each user.

**Response Example:**
```json
{
  "insights": [
    {
      "userInfo": { "email": "user@example.com", ... },
      "engagementScore": 85,
      "churnPrediction": {
        "riskLevel": "Medium",
        "riskScore": 45,
        "riskFactors": ["Extended period of inactivity"],
        "metrics": {
          "daysSinceLastLogin": 10,
          "avgSessionDuration": 500000,
          "engagementTrend": -15,
          "accountAge": 200
        }
      }
    }
  ]
}
```

## Functions

### 1. `calculateUserMetrics(user, now)`
**Purpose:** Computes user engagement metrics including:
- Days since last login
- Average session duration
- Engagement trend
- Account age
- Risk score

### 2. `calculateRiskScore(metrics)`
**Purpose:** Assigns a churn risk score (0-100) based on:
- Login recency (40%)
- Session duration trend (30%)
- Account activity (30%)

### 3. `determineRiskLevel(metrics)`
**Purpose:** Categorizes users into:
- `Low` (score < 40)
- `Medium` (40 ≤ score < 70)
- `High` (score ≥ 70)

### 4. `identifyRiskFactors(metrics)`
**Purpose:** Identifies risk factors such as:
- Long inactivity periods
- Declining engagement trends
- Short session durations



## Author
Harsh Kumar Sinha


