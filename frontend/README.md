# 📊 Dashboard

## 📌 Overview
This dashboard provides key insights into user activity, engagement, retention, and churn prediction. It allows administrators to take necessary actions based on AI-driven insights and user behavior trends.

## 🏗️ Components

### 👥 Active User
- Calls the Active User API.
- Categorizes users based on **Daily, Weekly, Monthly**, and **Total Users**.
- Provides a structured view of active user trends.

### 📞 EngagementCall & 📈 EngagementScore
- **EngagementCall**: Calls the API for user engagement data.
- **EngagementScore**: Displays the engagement data in a **bar graph** format for better visualization.

### 🔄 Retention User
- Fetches the total **retention users**.
- Provides a **button** to the **AI Insight Panel** to retrieve detailed user information.

### 🤖 AI Insight Panel
- Displays:
  - **Name & Email**
  - **Engagement Score**
  - **Churn Classification**
- Provides recommended **admin actions** to **retain users**.
- Features:
  - **Filters** (By Days, By Churn Risk Level, Search by Name & Email)
  - **Export CSV** file for all users.

### 📊 Churn Chart
- Calls the API for **churn prediction**.
- Categorizes users into a **pie chart** based on churn risk levels.
- Highlights the **user with the highest risk** (shows their email).

### 📈 OverTimeActive & OverTimeUsersCall
- **OverTimeUsersCall**: Calls the API to fetch active users over a **date range**.
- **OverTimeActive**: Maps the fetched data to a **line graph** for visual trends.

---
✨ **Designed for clarity and ease of use. Empowering administrators with data-driven insights!**

 
## Author

Harsh Kumar Sinha