import { useEffect, useState } from "react";
import axios from "axios";
import Papa from "papaparse";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

function AIInsightsPanel() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState([]);
  const [filters, setFilters] = useState({ dateRange: "30", riskLevel: "All" });
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({
    field: "engagementScore",
    direction: "desc",
  });
  const [selectedUser, setSelectedUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        "http://localhost:5500/users/user-insights"
      );
      setUserData(response.data.insights);
    } catch (error) {
      setError("Failed to fetch user insights. Please try again later.");
      console.error("Error fetching data", error);
    }
    setIsLoading(false);
  };

  const filteredData = userData.filter((user) => {
    const matchesRiskLevel =
      filters.riskLevel === "All" ||
      user.churnPrediction.riskLevel === filters.riskLevel;

    const matchesSearch =
      user.userInfo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.userInfo.email.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesRiskLevel && matchesSearch;
  });

  const sortedData = [...filteredData].sort((a, b) => {
    if (sortConfig.field === "engagementScore") {
      return sortConfig.direction === "desc"
        ? b.engagementScore.totalScore - a.engagementScore.totalScore
        : a.engagementScore.totalScore - b.engagementScore.totalScore;
    }
    return 0;
  });

  const getRiskColor = (riskLevel) => {
    switch (riskLevel?.toLowerCase()) {
      case "low":
        return "text-green-500";
      case "medium":
        return "text-yellow-500";
      case "high":
        return "text-red-500";
      default:
        return "text-gray-300";
    }
  };

  const exportToCSV = () => {
    const csvContent = filteredData.map((user) => ({
      Name: user.userInfo.name,
      Email: user.userInfo.email,
      "Risk Level": user.churnPrediction.riskLevel,
      "Engagement Score": user.engagementScore.totalScore,
    }));

    const csv = Papa.unparse(csvContent);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "user_insights.csv";
    link.click();
  };

  const UserDetailsModal = ({ user, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#1a1a1a] p-6 rounded-lg max-w-2xl w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{user.userInfo.name}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            ✕
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold mb-2">User Details</h3>
            <div className="space-y-2">
              <p className="text-gray-400">Email: {user.userInfo.email}</p>
              <p
                className={`font-bold ${getRiskColor(
                  user.churnPrediction.riskLevel
                )}`}
              >
                Risk Level: {user.churnPrediction.riskLevel}
              </p>
              <div>
                <p className="text-gray-400">Engagement Score</p>
                <div className="w-full bg-gray-700 rounded-full h-2 mt-1">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${user.engagementScore.totalScore}%` }}
                  />
                </div>
                <p className="text-sm text-gray-400 mt-1">
                  {user.engagementScore.totalScore}%
                </p>
              </div>
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Recommendations</h3>
            <p className="text-gray-400">
              {user.churnPrediction.riskLevel === "High" &&
                "• Send personalized re-engagement emails\n• Offer special discounts\n• Schedule customer success call"}
              {user.churnPrediction.riskLevel === "Medium" &&
                "• Recommend unused features\n• Share personalized content\n• Request feedback"}
              {user.churnPrediction.riskLevel === "Low" &&
                "• Encourage social sharing\n• Offer referral bonuses\n• Share success stories"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
  UserDetailsModal.propTypes = {
    user: PropTypes.shape({
      userInfo: PropTypes.shape({
        name: PropTypes.string.isRequired,
        email: PropTypes.string.isRequired,
      }).isRequired,
      churnPrediction: PropTypes.shape({
        riskLevel: PropTypes.string.isRequired,
      }).isRequired,
      engagementScore: PropTypes.shape({
        totalScore: PropTypes.number.isRequired,
      }).isRequired,
    }).isRequired,
    onClose: PropTypes.func.isRequired,
  };

  return (
    <div className="p-6 bg-[#262626] shadow-lg rounded-lg text-white">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">AI Insights Panel</h2>
        <div className="flex gap-4">
          <button
            onClick={exportToCSV}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            Export to CSV
          </button>
          <button
            onClick={() => {
              navigate("/");
            }}
            className="text-xl bg-[#1a1a1a] px-4 py-2 rounded-xl transition-colors"
          >
            {"<-"}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-500 bg-opacity-10 border border-red-500 text-red-500 p-4 rounded-lg mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 bg-[#1a1a1a] p-4 rounded-lg">
        <div className="text-center">
          <p className="text-2xl font-bold text-red-500">
            {
              filteredData.filter(
                (user) => user.churnPrediction.riskLevel === "High"
              ).length
            }
          </p>
          <p className="text-gray-400">High Risk Users</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-yellow-500">
            {
              filteredData.filter(
                (user) => user.churnPrediction.riskLevel === "Medium"
              ).length
            }
          </p>
          <p className="text-gray-400">Medium Risk Users</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-green-500">
            {
              filteredData.filter(
                (user) => user.churnPrediction.riskLevel === "Low"
              ).length
            }
          </p>
          <p className="text-gray-400">Low Risk Users</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <select
          value={filters.dateRange}
          onChange={(e) =>
            setFilters({ ...filters, dateRange: e.target.value })
          }
          className="bg-gray-700 text-white border p-2 rounded"
        >
          <option value="7">Last 7 Days</option>
          <option value="30">Last 30 Days</option>
          <option value="90">Last 90 Days</option>
        </select>

        <select
          value={filters.riskLevel}
          onChange={(e) =>
            setFilters({ ...filters, riskLevel: e.target.value })
          }
          className="bg-gray-700 text-white border p-2 rounded"
        >
          <option value="All">All Risk Levels</option>
          <option value="High">High Risk</option>
          <option value="Medium">Medium Risk</option>
          <option value="Low">Low Risk</option>
        </select>

        <select
          value={`${sortConfig.field}-${sortConfig.direction}`}
          onChange={(e) => {
            const [field, direction] = e.target.value.split("-");
            setSortConfig({ field, direction });
          }}
          className="bg-gray-700 text-white border p-2 rounded"
        >
          <option value="engagementScore-desc">
            Engagement Score (High to Low)
          </option>
          <option value="engagementScore-asc">
            Engagement Score (Low to High)
          </option>
        </select>

        <input
          type="text"
          placeholder="Search by name or email"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-gray-700 text-white border p-2 rounded w-full md:w-1/3"
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedData.map((user) => (
            <div
              key={user.userInfo.email}
              onClick={() => setSelectedUser(user)}
              className="p-4 bg-[#1a1a1a] border rounded-lg shadow-sm cursor-pointer hover:bg-[#2a2a2a] transition-colors"
            >
              <h3 className="font-semibold text-lg text-white">
                {user.userInfo.name}
              </h3>
              <p className="text-sm text-gray-400">{user.userInfo.email}</p>

              <div className="mt-2">
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-400">Engagement</span>
                  <span className="text-sm text-gray-400">
                    {user.engagementScore.totalScore}%
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${user.engagementScore.totalScore}%` }}
                  />
                </div>
              </div>

              <p
                className={`font-bold mt-2 ${getRiskColor(
                  user.churnPrediction.riskLevel
                )}`}
              >
                {user.churnPrediction.riskLevel} Risk
              </p>
              <p className="text-sm text-gray-400 mt-2">
                {user.churnPrediction.riskLevel === "High" &&
                  "Offer Discounts, Send Re-engagement Emails"}
                {user.churnPrediction.riskLevel === "Medium" &&
                  "Recommend Features, Personalized Content"}
                {user.churnPrediction.riskLevel === "Low" &&
                  "Encourage Social Sharing"}
              </p>
            </div>
          ))}
        </div>
      )}

      {selectedUser && (
        <UserDetailsModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      )}
    </div>
  );
}

export default AIInsightsPanel;
