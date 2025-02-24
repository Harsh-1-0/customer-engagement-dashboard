# User Schema Documentation

This document explains the Mongoose schema used for user management, session tracking, and engagement analysis.

## Schema Overview

The `userSchema` defines the structure of the `user` collection in MongoDB. It includes fields for login credentials, session tracking, engagement metrics, and churn prediction data.

---

## Fields and Descriptions

### 1. **Login Credentials**

- `name` (String, Required): User's full name.
- `email` (String, Required, Unique): User's email address.
- `password` (String, Required): Hashed password for authentication.

### 2. **Login Tracking**

- `lastLogin` (Date, Default: `null`): Stores the timestamp of the last login.
- `lastLogout` (Date, Default: `null`): Stores the timestamp of the last logout.

### 3. **Session Tracking**

- `sessionDuration` (Array of Objects): Tracks login and logout times along with session duration.
  - `loginTime` (Date): Timestamp of when the user logs in.
  - `logoutTime` (Date): Timestamp of when the user logs out.
  - `duration` (Number): Duration of the session in milliseconds.

### 4. **Churn Prediction Fields**

- `totalSessions` (Number, Default: `0`): Total number of sessions a user has.
- `avgSessionDuration` (Number, Default: `0`): Average session duration in milliseconds.
- `engagementScore` (Number, Default: `0`): Computed score based on user activity.
- `lastActive` (Date): The last recorded active timestamp.
- `createdAt` (Date, Default: `Date.now`): Timestamp when the user was created.

### 5. **Engagement Metrics**

#### a) **Feature Usage**

Tracks usage of specific features in the platform:

- `search` (Number, Default: `0`): Number of times search was used.
- `profile` (Number, Default: `0`): Number of profile visits.
- `messages` (Number, Default: `0`): Number of messages sent or viewed.

#### b) **User Interactions**

- `lastInteractionDate` (Date): Timestamp of the last interaction.
- `totalInteractions` (Number, Default: `0`): Total number of interactions.
- `dailyInteractionCounts` (Array of Objects): Tracks daily interaction counts.
  - `date` (Date): The date of the interaction.
  - `count` (Number): Number of interactions on that day.

#### c) **Session Quality**

- `avgSessionDuration` (Number, Default: `0`): The average duration of user sessions.
- `bounceRate` (Number, Default: `0`): The number of sessions lasting less than one minute.
- `deepSessions` (Number, Default: `0`): The number of sessions lasting more than ten minutes.

### 6. **Engagement Score**

- `engagementScore` (Number, Default: `0`): Final computed score based on engagement metrics.

---

## Model Definition

The schema is defined using Mongoose and is assigned to the `userModel`:

```javascript
const userModel = mongoose.model("user", userSchema);
export default userModel;
```

---

## Usage

This model can be imported and used in various parts of the application to handle user-related database operations:

```javascript
import userModel from "../model/userModel.js";

// Creating a new user
const newUser = new userModel({
  name: "John Doe",
  email: "john@example.com",
  password: "hashedpassword",
});
await newUser.save();
```

---
