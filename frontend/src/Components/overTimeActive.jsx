import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import PropTypes from "prop-types";

const ActiveUsersChart = ({ data }) => {
  return (
    <div>
      <h2 className="text-center text-xl font-semibold text-white mb-4">
        Retention of Users Overtime
      </h2>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data}>
          <XAxis dataKey="_id" />
          <YAxis />
          <Tooltip />
          <CartesianGrid stroke="#ccc" />
          <Line type="monotone" dataKey="count" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

ActiveUsersChart.propTypes = {
  data: PropTypes.object.isRequired,
};
export default ActiveUsersChart;
