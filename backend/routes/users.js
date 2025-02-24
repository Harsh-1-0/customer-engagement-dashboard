import express from "express";
import userModel from "../model/userModel.js";
import bcrypt from "bcrypt";
import EngagementScoring from "../functions/engagement.js";
const router = express.Router();
import {
  determineRiskLevel,
  identifyRiskFactors,
  calculateUserMetrics,
} from "../functions/churn.js";

router.get("/", async (req, res) => {
  try {
    const response = await userModel.find({});
    return res.status(200).json(response);
  } catch (error) {
    console.log("Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});
// User Login Route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const loginTime = new Date();

    user.lastLogin = loginTime;
    await user.save();

    return res.status(200).json({ message: "Login successful" });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// User Logout Route
router.post("/logout", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await userModel.findOne({ email });

    if (!user || !user.lastLogin) {
      return res.status(400).json({ message: "User not logged in" });
    }

    const logoutTime = new Date();
    const sessionDuration = logoutTime - user.lastLogin; // Duration in milliseconds

    user.lastLogout = logoutTime;
    user.sessionDuration.push({
      loginTime: user.lastLogin,
      logoutTime: logoutTime,
      duration: sessionDuration,
    });

    await user.save();

    return res.status(200).json({
      message: "Logout successful",
      sessionDuration: sessionDuration / 1000 + " seconds",
    });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Active Users Route
router.get("/active-users", async (req, res) => {
  try {
    const now = new Date();
    const oneDayAgo = new Date(now - 24 * 60 * 60 * 1000);
    const oneWeekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now - 30 * 24 * 60 * 60 * 1000);
    const totalUsers = await userModel.countDocuments({});
    const dailyActive = await userModel.countDocuments({
      lastLogin: { $gte: oneDayAgo },
    });
    const weeklyActive = await userModel.countDocuments({
      lastLogin: { $gte: oneWeekAgo },
    });
    const monthlyActive = await userModel.countDocuments({
      lastLogin: { $gte: oneMonthAgo },
    });

    return res
      .status(200)
      .json({ dailyActive, weeklyActive, monthlyActive, totalUsers });
  } catch (error) {
    console.error("Active users error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/retention", async (req, res) => {
  try {
    const now = new Date();
    const oneDayAgo = new Date(now - 24 * 60 * 60 * 1000);
    const oneWeekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);

    // Users who logged in at least once in the past month
    const dailyUsers = await userModel.countDocuments({
      lastLogin: { $gte: oneDayAgo },
    });

    // Users who logged in at least once in the past week
    const weeklyUsers = await userModel.countDocuments({
      lastLogin: { $gte: oneWeekAgo },
    });

    // Retention Rate Calculation
    const retentionRate =
      weeklyUsers > 0 ? (dailyUsers / weeklyUsers) * 100 : 0;

    return res.status(200).json({
      dailyActiveUsers: dailyUsers,
      weeklyActiveUsers: weeklyUsers,
      retentionRate: retentionRate.toFixed(2),
    });
  } catch (error) {
    console.error("Retention rate error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/engagement-score", async (req, res) => {
  try {
    const users = await userModel.find({});

    const scores = await Promise.all(
      users.map((user) => EngagementScoring.calculateEngagementScore(user._id))
    );

    return res.status(200).json({ scores });
  } catch (error) {
    console.error("Engagement score error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/active-users-overtime", async (req, res) => {
  try {
    const data = await userModel.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$lastLogin" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/engagement-scores", async (req, res) => {
  try {
    const data = await userModel.find({}, { email: 1, engagementScore: 1 });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.get("/retention-trends", async (req, res) => {
  try {
    const data = await userModel.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$lastActive" } },
          retainedUsers: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.get("/churn-prediction", async (req, res) => {
  try {
    const now = new Date();
    const users = await userModel.find({});

    let riskData = {
      Low: {
        total: 0,
        count: 0,
        min: null,
        max: null,
        minUser: null,
        maxUser: null,
        avg: 0,
      },
      Medium: {
        total: 0,
        count: 0,
        min: null,
        max: null,
        minUser: null,
        maxUser: null,
        avg: 0,
      },
      High: {
        total: 0,
        count: 0,
        min: null,
        max: null,
        minUser: null,
        maxUser: null,
        avg: 0,
      },
    };

    const predictions = await Promise.all(
      users.map(async (user) => {
        const metrics = await calculateUserMetrics(user, now);
        const riskLevel = determineRiskLevel(metrics);
        const riskFactors = identifyRiskFactors(metrics);
        const riskScore = metrics.riskScore;

        if (riskData[riskLevel]) {
          let levelData = riskData[riskLevel];

          levelData.total += riskScore;
          levelData.count += 1;

          if (levelData.min === null || riskScore < levelData.min) {
            levelData.min = riskScore;
            levelData.minUser = user.email;
          }

          if (levelData.max === null || riskScore > levelData.max) {
            levelData.max = riskScore;
            levelData.maxUser = user.email;
          }
        }
      })
    );

    Object.keys(riskData).forEach((level) => {
      if (riskData[level].count > 0) {
        riskData[level].avg = riskData[level].total / riskData[level].count;
      } else {
        riskData[level].avg = 0;
      }
    });

    return res.status(200).json({
      riskData,
    });
  } catch (error) {
    console.error("Churn prediction error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/user-insights", async (req, res) => {
  try {
    const now = new Date();
    const users = await userModel.find({});

    const insights = await Promise.all(
      users.map(async (user) => {
        // Fetch engagement score
        const engagementScore =
          await EngagementScoring.calculateEngagementScore(user._id);

        // Calculate key metrics for churn prediction
        const metrics = await calculateUserMetrics(user, now);
        const riskLevel = determineRiskLevel(metrics);
        const riskFactors = identifyRiskFactors(metrics);

        return {
          userInfo: user, // Full user details
          engagementScore,
          churnPrediction: {
            riskLevel,
            riskScore: metrics.riskScore,
            riskFactors,
            metrics: {
              daysSinceLastLogin: metrics.daysSinceLastLogin,
              avgSessionDuration: metrics.avgSessionDuration,
              engagementTrend: metrics.engagementTrend,
              accountAge: metrics.accountAge,
            },
          },
        };
      })
    );

    return res.status(200).json({ insights });
  } catch (error) {
    console.error("User insights error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
