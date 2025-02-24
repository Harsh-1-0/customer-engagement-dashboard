import ActiveUsers from "./activeUsers";
import EngegementScore from "./engegementCall";
import Retentation from "./retentationUser";
import OverTimeActiveUsers from "./overtimeUsersCall";
import ChurnPieChart from "./churnChart";

function Dashboard() {
  return (
    <div className="flex flex-col gap-2">
      <ActiveUsers />
      <div className="grid grid-cols-3 max-md:grid-cols-1 max-md:gap-0">
        <Retentation />
        <div className="col-span-2">
          <EngegementScore />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4 max-md:grid-cols-1 max-md:gap-0">
        <div className="col-span-2">
          <OverTimeActiveUsers />
        </div>
        <ChurnPieChart />
      </div>
    </div>
  );
}

export default Dashboard;
