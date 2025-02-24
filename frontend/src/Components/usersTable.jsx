import { useState, useEffect } from "react";
import axios from "axios";
import UserCard from "./userCard";

function UserActivity() {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get("http://localhost:5500/users", {});
        setData(response.data);
        setFilteredData(response.data);
      } catch (err) {
        console.log(err);
      }
    };

    getData();
  }, []);

  useEffect(() => {
    const results = data.filter(
      (user) =>
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredData(results);
  }, [searchTerm, data]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="bg-[#262626] p-4">
      <div className="mb-4 px-4">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={handleSearch}
          className="w-full px-4 py-2 rounded-lg bg-gray-600 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-gray-900"
        />
      </div>
      {Array.isArray(filteredData) &&
        filteredData.map((user) => {
          return <UserCard key={user._id} response={user} />;
        })}
    </div>
  );
}

export default UserActivity;
