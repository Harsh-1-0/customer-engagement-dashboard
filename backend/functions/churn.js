function calculateRiskScore(metrics) {
  let score = 0;

  // Login recency weight: 40%
  if (metrics.daysSinceLastLogin > 30) score += 40;
  else if (metrics.daysSinceLastLogin > 14) score += 25;
  else if (metrics.daysSinceLastLogin > 7) score += 15;

  // Session duration trend weight: 30%
  if (metrics.engagementTrend < -20) score += 30;
  else if (metrics.engagementTrend < -10) score += 20;
  else if (metrics.engagementTrend < 0) score += 10;

  // Account maturity and activity weight: 30%
  const sessionsPerDay = metrics.totalSessions / metrics.accountAge;
  if (sessionsPerDay < 0.1) score += 30;
  else if (sessionsPerDay < 0.3) score += 15;

  return Math.min(score, 100);
}

function determineRiskLevel(metrics) {
  if (metrics.riskScore >= 70) return "High";
  if (metrics.riskScore >= 40) return "Medium";
  return "Low";
}

function identifyRiskFactors(metrics) {
  const factors = [];

  if (metrics.daysSinceLastLogin > 14) {
    factors.push("Extended period of inactivity");
  }

  if (metrics.engagementTrend < -10) {
    factors.push("Declining engagement trend");
  }

  if (metrics.avgSessionDuration < 300000) {
    // Less than 5 minutes
    factors.push("Short session duration");
  }

  return factors;
}

async function calculateUserMetrics(user, now) {
  const daysSinceLastLogin = user.lastLogin
    ? Math.floor((now - user.lastLogin) / (1000 * 60 * 60 * 24))
    : Infinity;

  const accountAge = Math.floor((now - user.createdAt) / (1000 * 60 * 60 * 24));

  // Calculate average session duration
  const avgSessionDuration =
    user.sessionDuration.length > 0
      ? user.sessionDuration.reduce(
          (acc, session) => acc + session.duration,
          0
        ) / user.sessionDuration.length
      : 0;

  // Calculate engagement trend (last 7 sessions vs previous 7)
  const recentSessions = user.sessionDuration.slice(-7);
  const previousSessions = user.sessionDuration.slice(-14, -7);

  const recentAvg =
    recentSessions.length > 0
      ? recentSessions.reduce((acc, session) => acc + session.duration, 0) /
        recentSessions.length
      : 0;

  const previousAvg =
    previousSessions.length > 0
      ? previousSessions.reduce((acc, session) => acc + session.duration, 0) /
        previousSessions.length
      : 0;

  const engagementTrend =
    previousAvg !== 0 ? ((recentAvg - previousAvg) / previousAvg) * 100 : 0;

  // Calculate risk score (0-100)
  const riskScore = calculateRiskScore({
    daysSinceLastLogin,
    avgSessionDuration,
    engagementTrend,
    accountAge,
    totalSessions: user.sessionDuration.length,
  });

  return {
    daysSinceLastLogin,
    avgSessionDuration,
    engagementTrend,
    accountAge,
    riskScore,
  };
}

export {
  calculateRiskScore,
  determineRiskLevel,
  identifyRiskFactors,
  calculateUserMetrics,
};
