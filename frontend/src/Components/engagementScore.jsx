import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import PropTypes from "prop-types";

const EngagementScoreChart = ({ data }) => {
  return (
    <div className="p-4 bg-[#161515] text-white  shadow-lg">
      <h2 className="text-center text-xl font-semibold mb-4">
        Engagement Over Time
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid stroke="" />
          <XAxis
            dataKey="email"
            stroke="#fff"
            angle={-70}
            textAnchor="end"
            interval={0}
          />
          <YAxis stroke="#fff" />
          <Tooltip contentStyle={{ background: "#222", color: "#fff" }} />
          <Bar
            type="monotone"
            dataKey="value"
            stroke="#262626"
            strokeWidth={1}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

EngagementScoreChart.propTypes = {
  data: PropTypes.array.isRequired,
};

export default EngagementScoreChart;
