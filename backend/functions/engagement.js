import userModel from "../model/userModel.js";
class EngagementScoring {
  static weights = {
    recency: 0.3,
    frequency: 0.25,
    duration: 0.2,
    featureUsage: 0.15,
    consistency: 0.1,
  };

  static async calculateEngagementScore(userId) {
    const user = await userModel.findById(userId);
    if (!user) throw new Error("User not found");

    const now = new Date();
    const scores = {};

    // 1. Recency Score (30%) - How recently has the user been active?
    scores.recency = this.calculateRecencyScore(user.lastLogin, now);

    // 2. Frequency Score (25%) - How often does the user engage?
    scores.frequency = this.calculateFrequencyScore(user.sessionDuration, now);

    // 3. Duration Score (20%) - How long do they engage?
    scores.duration = this.calculateDurationScore(
      user.engagementMetrics.sessionQuality
    );

    // 4. Feature Usage Score (15%) - How many features do they use?
    scores.featureUsage = this.calculateFeatureScore(
      user.engagementMetrics.featureUsage
    );

    // 5. Consistency Score (10%) - How consistent is their engagement?
    scores.consistency = this.calculateConsistencyScore(
      user.engagementMetrics.interactions
    );

    // Calculate weighted average
    const totalScore = Object.keys(scores).reduce((total, metric) => {
      return total + scores[metric] * this.weights[metric];
    }, 0);

    // Update user's engagement score
    user.engagementScore = Math.round(totalScore);
    await user.save();

    return {
      email: user.email,
      totalScore: user.engagementScore,
      breakdown: scores,
      insights: this.generateInsights(scores),
    };
  }

  static calculateRecencyScore(lastLogin, now) {
    if (!lastLogin) return 0;
    const daysSinceLastLogin = (now - lastLogin) / (1000 * 60 * 60 * 24);

    // Exponential decay formula
    return Math.exp(-daysSinceLastLogin / 7) * 100;
  }

  static calculateFrequencyScore(sessions, now) {
    if (!sessions.length) return 0;

    const oneWeekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
    const recentSessions = sessions.filter((s) => s.loginTime >= oneWeekAgo);

    // Score based on sessions per week (max 14 sessions = 100%)
    return Math.min(100, (recentSessions.length / 14) * 100);
  }

  static calculateDurationScore(sessionQuality) {
    const { avgSessionDuration, bounceRate, deepSessions } = sessionQuality;

    // Convert average duration to minutes
    const avgDurationMinutes = avgSessionDuration / (1000 * 60);

    // Score components
    const durationScore = Math.min(100, (avgDurationMinutes / 30) * 100);
    const bounceDeduction = bounceRate * 0.5;
    const deepBonus = Math.min(20, (deepSessions / 10) * 20);

    return Math.max(0, durationScore - bounceDeduction + deepBonus);
  }

  static calculateFeatureScore(featureUsage) {
    const features = Object.keys(featureUsage);
    if (!features.length) return 0;

    const featureScores = features.map((feature) => {
      const usage = featureUsage[feature];
      // Logarithmic scaling for each feature
      return Math.min(100, (Math.log10(usage + 1) / Math.log10(100)) * 100);
    });

    return featureScores.reduce((a, b) => a + b) / features.length;
  }

  static calculateConsistencyScore(interactions) {
    if (!interactions.dailyInteractionCounts.length) return 0;

    // Calculate variance in daily interactions
    const counts = interactions.dailyInteractionCounts.map((d) => d.count);
    const mean = counts.reduce((a, b) => a + b) / counts.length;
    const variance =
      counts.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / counts.length;

    // Lower variance = higher consistency score
    return Math.max(0, 100 - Math.sqrt(variance) * 10);
  }

  static generateInsights(scores) {
    const insights = [];

    if (scores.recency < 50) {
      insights.push("User engagement has dropped recently");
    }
    if (scores.frequency < 40) {
      insights.push("User visits less frequently than ideal");
    }
    if (scores.duration < 30) {
      insights.push("Sessions are shorter than average");
    }
    if (scores.featureUsage < 25) {
      insights.push("Limited feature exploration");
    }
    if (scores.consistency < 20) {
      insights.push("Irregular usage pattern detected");
    }

    return insights;
  }
}
export default EngagementScoring;
