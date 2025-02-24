import { useState, useEffect } from "react";
import { GoDotFill } from "react-icons/go";
import axios from "axios";

function ActiveUsers() {
  const [data, setData] = useState({});

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5500/users/active-users"
        );
        setData(response.data);
      } catch (err) {
        console.log(err);
      }
    };

    getData();
  }, []);

  return (
    <div className="w-full font-poppins text-white bg-[#120f0f] p-4">
      <div className="flex flex-wrap justify-center gap-4 md:justify-evenly">
        {[
          { label: "DAILY USERS", value: data.dailyActive, color: "green-500" },
          { label: "WEEKLY USERS", value: data.weeklyActive, color: "red-500" },
          {
            label: "MONTHLY USERS",
            value: data.monthlyActive,
            color: "yellow-500",
          },
          { label: "TOTAL USERS", value: data.totalUsers, color: "blue-500" },
        ].map((item, index) => (
          <button
            key={index}
            className={`flex items-center border-2 border-${item.color} rounded-full p-3 gap-2 min-w-[160px] justify-center`}
          >
            <div>{item.label}</div>
            <GoDotFill className={`text-${item.color}`} />
            <div>{item.value}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

export default ActiveUsers;
