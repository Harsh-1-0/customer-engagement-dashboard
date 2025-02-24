import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
  //login credentials
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  //login tracking
  lastLogin: { type: Date, default: null },
  lastLogout: { type: Date, default: null },
  //session tracking
  sessionDuration: [
    {
      loginTime: { type: Date },
      logoutTime: { type: Date },
      duration: { type: Number },
    },
  ],
  // New fields for churn prediction
  totalSessions: { type: Number, default: 0 },
  avgSessionDuration: { type: Number, default: 0 },
  engagementScore: { type: Number, default: 0 },
  lastActive: { type: Date },
  createdAt: { type: Date, default: Date.now },

  //engagement metrics
  engagementMetrics: {
    featureUsage: {
      // Track specific feature usage
      search: { type: Number, default: 0 },
      profile: { type: Number, default: 0 },
      messages: { type: Number, default: 0 },
      // Add more features as needed
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
      bounceRate: { type: Number, default: 0 }, // Sessions < 1 minute
      deepSessions: { type: Number, default: 0 }, // Sessions > 10 minutes
    },
  },
  engagementScore: { type: Number, default: 0 },
});
const userModel = mongoose.model("user", userSchema);

export default userModel;
