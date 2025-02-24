import { useState, useEffect } from "react";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const ChurnPieChart = () => {
  const [chartData, setChartData] = useState([]);
  const [data, setData] = useState({});

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5500/users/churn-prediction"
        );
        setData(response.data.riskData);

        setChartData([
          {
            name: "Low",
            value: response.data.riskData.Low.count,
            color: "#34D399",
          }, // Green
          {
            name: "Medium",
            value: response.data.riskData.Medium.count,
            color: "#FACC15",
          }, // Yellow
          {
            name: "High",
            value: response.data.riskData.High.count,
            color: "#EF4444",
          }, // Red
        ]);
      } catch (error) {
        console.error(error);
      }
    };

    getData();
  }, []);

  return (
    <div className="p-4 bg-[#161515] text-white flex flex-col items-center justify-center shadow-lg">
      <h2 className="text-center text-xl font-semibold mb-4">
        User Churn Prediction
      </h2>

      <div className="w-full flex justify-center">
        <ResponsiveContainer width={400} height={400}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              outerRadius={120}
              dataKey="value"
              label={({ name, percent }) =>
                `${name}: ${(percent * 100).toFixed(1)}%`
              }
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {data.High && (
        <div className="text-center text-lg font-semibold mt-4">
          {data.High.maxUser ? data.High.maxUser : "No"} users are at highest
          risk
          {data.High.maxUser ? ` with riskScore ${data.High.max}` : ""}
        </div>
      )}
    </div>
  );
};

export default ChurnPieChart;
