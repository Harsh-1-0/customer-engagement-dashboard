import PropTypes from "prop-types";
import { useState } from "react";
import axios from "axios";

const UserCard = ({ response }) => {
  const [data, setData] = useState({});
  const [engagementScore, setEngagementScore] = useState({});

  const getChurnPrediction = async (id) => {
    try {
      const response1 = await axios.get(
        `http://localhost:5500/users/advanced-churn-prediction/${id}`
      );
      setData(response1.data);
    } catch (err) {
      console.log(err);
    }
  };

  const getEngagementScore = async (id) => {
    try {
      const response2 = await axios.get(
        `http://localhost:5500/users/engagement-score/${id}`
      );
      setEngagementScore(response2.data.scores);
    } catch (err) {
      console.log(err);
    }
  };

  // Function to determine risk score color
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

  return (
    <div className="pt-10 px-6 text-black">
      <div className="bg-[#1a1a1a] shadow-lg rounded-lg p-6 flex items-center space-x-6">
        {/* User Info */}
        <div className="flex-1">
          <div className="text-2xl font-semibold text-white">
            {response.name}
          </div>
          <div className="text-gray-400">{response.email}</div>
        </div>

        {/* Action Buttons & Data */}
        <div className="flex flex-col space-y-4">
          {Object.keys(data).length !== 0 ? (
            <div className="text-center">
              <div className={`text-lg font-bold text-gray-500`}>
                Risk Level:{" "}
                <span className={`${getRiskColor(data.riskLevel)}`}>
                  {data.riskLevel}
                </span>
              </div>
              <div className="text-lg font-semibold text-white">
                Score: {data.riskScore}
              </div>
            </div>
          ) : (
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition duration-200"
              onClick={() => getChurnPrediction(response._id)}
            >
              Get Churn Prediction
            </button>
          )}

          {Object.keys(engagementScore).length !== 0 ? (
            <div className="text-center">
              <div className="text-lg font-semibold text-white">
                Engagement Score: {engagementScore.totalScore}
              </div>
            </div>
          ) : (
            <button
              className="bg-green-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-700 transition duration-200"
              onClick={() => getEngagementScore(response._id)}
            >
              Get Engagement Score
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

UserCard.propTypes = {
  response: PropTypes.object.isRequired,
};

export default UserCard;
