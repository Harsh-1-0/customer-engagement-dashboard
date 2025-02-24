import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
function Retentation() {
  const [data, setData] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5500/users/retention",
          {}
        );

        setData(response.data);
      } catch (err) {
        console.log(err);
      }
    };
    getData();
  }, []);

  return (
    <div className="flex flex-col  items-center justify-center p-6 bg-[#262626] text-white rounded-lg shadow-lg">
      {data && (
        <div className="text-lg font-semibold mb-4">
          Retention Rate:{" "}
          <span
            className={`
            ${data.retentionRate < 40.0 ? "text-red-500" : ""}
            ${
              data.retentionRate >= 40.0 && data.retentionRate < 70.0
                ? "text-yellow-400"
                : ""
            }
            ${data.retentionRate >= 70.0 ? "text-green-400" : ""}
          `}
          >
            {data.retentionRate}%
          </span>
        </div>
      )}

      <button
        onClick={() => navigate("/userstable")}
        className="px-4 py-2 bg-[#100e0e] hover:bg-[#000000] text-[#39FF14] font-medium rounded-md transition duration-300"
      >
        All Users Table
      </button>
    </div>
  );
}

export default Retentation;
