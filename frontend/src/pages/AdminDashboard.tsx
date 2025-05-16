import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import api from "../services/api";
import "../styles/AdminDashboard.css";

interface PackageStatusData {
  [key: string]: number;
}

const COLORS = [
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff7f50",
  "#a29bfe",
  "#fd79a8",
];

const formatStatus = (status: string) =>
  status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();

const AdminDashboard = () => {
  const [statusData, setStatusData] = useState<PackageStatusData>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatusData = async () => {
      try {
        const { data } = await api.get<PackageStatusData>(
          "/admin/stats/packages-by-status"
        );
        console.log("📦 API response:", data);
        setStatusData(data);
      } catch (error) {
        console.error("Error fetching package stats", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStatusData();
  }, []);

  const pieData = Object.entries(statusData).map(([status, count]) => ({
    name: formatStatus(status),
    value: count,
  }));

  return (
    <div className="dashboard-container">
      <h1>📦 Admin Dashboard</h1>

      {loading ? (
        <p>Loading analytics...</p>
      ) : Object.keys(statusData).length === 0 ? (
        <p>No package data available.</p>
      ) : (
        <>
          <div className="stats-cards">
            {Object.entries(statusData).map(([status, count]) => (
              <div key={status} className="card">
                <h2>{formatStatus(status)}</h2>
                <p>{count}</p>
              </div>
            ))}
          </div>

          <div className="chart-container">
            <PieChart width={400} height={400}>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={120}
                fill="#8884d8"
                label
              >
                {pieData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
