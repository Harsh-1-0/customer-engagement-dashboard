import { faker } from "@faker-js/faker";
import userModel from "../model/userModel.js"; // Adjust path if needed
import configDB from "../config/mongodb.js";
import express from "express";
import bcrypt from "bcrypt";
configDB();
const router = express.Router();
router.get("/", async (req, res) => {
  try {
    const users = [];

    for (let i = 0; i < 100; i++) {
      const now = new Date();

      // Assign risk categories
      const riskCategory = faker.helpers.weightedArrayElement([
        { value: "high", weight: 22 },
        { value: "medium", weight: 28 },
        { value: "low", weight: 50 },
      ]);

      let daysSinceLastLogin;
      let totalSessions;
      let avgSessionDuration;
      let engagementTrend;

      // Assign values based on risk category
      if (riskCategory === "high") {
        daysSinceLastLogin = faker.number.int({ min: 31, max: 90 }); // High risk: Inactive for over a month
        totalSessions = faker.number.int({ min: 1, max: 5 }); // Very few sessions
        avgSessionDuration = faker.number.int({ min: 60000, max: 300000 }); // 1-5 min
        engagementTrend = faker.number.int({ min: -50, max: -20 }); // Strong negative trend
      } else if (riskCategory === "medium") {
        daysSinceLastLogin = faker.number.int({ min: 15, max: 30 }); // Medium risk: 2-4 weeks inactive
        totalSessions = faker.number.int({ min: 5, max: 20 }); // Moderate session count
        avgSessionDuration = faker.number.int({ min: 300000, max: 900000 }); // 5-15 min
        engagementTrend = faker.number.int({ min: -20, max: -5 }); // Slight decline
      } else {
        daysSinceLastLogin = faker.number.int({ min: 1, max: 14 }); // Low risk: Recently active
        totalSessions = faker.number.int({ min: 20, max: 200 }); // Many sessions
        avgSessionDuration = faker.number.int({ min: 900000, max: 3600000 }); // 15 min - 1 hour
        engagementTrend = faker.number.int({ min: 0, max: 20 }); // Stable or increasing
      }

      const createdAt = faker.date.past({ years: 3, refDate: now });
      const lastLogin = new Date(
        now - daysSinceLastLogin * 24 * 60 * 60 * 1000
      );

      // Generate session data
      const sessionDuration = Array.from({ length: totalSessions }, () => {
        const loginTime = faker.date.between({ from: createdAt, to: now });
        const duration = faker.number.int({
          min: 60000,
          max: avgSessionDuration,
        });

        return {
          loginTime,
          logoutTime: new Date(loginTime.getTime() + duration),
          duration,
        };
      });
      const user = new userModel({
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: bcrypt.hashSync("1234", 10),
        createdAt,
        lastLogin,
        sessionDuration,
      });

      users.push(user);
    }

    // Save all users to the database
    await userModel.insertMany(users);

    res.status(201).json({ message: "Users generated successfully!", users });
  } catch (error) {
    console.error("Error generating users:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
