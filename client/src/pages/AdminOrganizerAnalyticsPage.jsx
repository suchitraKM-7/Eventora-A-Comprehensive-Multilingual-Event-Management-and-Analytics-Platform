import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../config";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";

function AdminOrganizerAnalyticsPage() {

  const [analytics, setAnalytics] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {

    const fetchAnalytics = async () => {

      try {

        const response = await axios.get(
          `${API_URL}/api/analytics/admin-full`
        );

        setAnalytics(response.data);

      } catch (error) {

        console.log(error);

      }
    };

    fetchAnalytics();

  }, []);

  if (!analytics) {
    return <h2>Loading...</h2>;
  }
  const chartData =
  analytics.organizerAnalytics.map(
    organizer => ({
      name: organizer.name,
      revenue: organizer.revenue
    })
  );
  const totalOrganizers =
  analytics.organizerAnalytics.length;

const totalRevenue =
  analytics.organizerAnalytics.reduce(
    (sum, organizer) =>
      sum + organizer.revenue,
    0
  );

const totalBookings =
  analytics.organizerAnalytics.reduce(
    (sum, organizer) =>
      sum + organizer.bookings,
    0
  );

const topOrganizer =
  [...analytics.organizerAnalytics]
    .sort(
      (a, b) =>
        b.revenue - a.revenue
    )[0];
const exportCSV = () => {

  const csvRows = [

    [
      "Organizer",
      "Events Created",
      "Bookings",
      "Revenue",
      "Avg Revenue/Event",
      "Avg Bookings/Event"
    ],

    ...analytics.organizerAnalytics.map(
      organizer => [

        organizer.name,

        organizer.eventsCreated,

        organizer.bookings,

        organizer.revenue,

        (
          organizer.revenue /
          organizer.eventsCreated
        ).toFixed(2),

        (
          organizer.bookings /
          organizer.eventsCreated
        ).toFixed(2)

      ]
    )

  ];

  const csvContent =
    csvRows
      .map(row => row.join(","))
      .join("\n");

  const blob =
    new Blob(
      [csvContent],
      {
        type:
          "text/csv;charset=utf-8;"
      }
    );

  const url =
    URL.createObjectURL(blob);

  const link =
    document.createElement("a");

  link.href = url;

  link.download =
    "organizer-wise-report.csv";

  link.click();
};
const exportPDF = () => {

  const doc =
    new jsPDF();

  doc.text(
    "ORGANIZER WISE ANALYTICS REPORT",
    20,
    20
  );

  autoTable(doc, {

    head: [[

      "Organizer",
      "Events",
      "Bookings",
      "Revenue",
      "Avg Rev/Event",
      "Avg Book/Event"

    ]],

    body:
      analytics.organizerAnalytics.map(
        organizer => [

          organizer.name,

          organizer.eventsCreated,

          organizer.bookings,

          `Rs. ${organizer.revenue}`,

          (
            organizer.revenue /
            organizer.eventsCreated
          ).toFixed(2),

          (
            organizer.bookings /
            organizer.eventsCreated
          ).toFixed(2)

        ]
      )

  });

  doc.save(
    "organizer-wise-report.pdf"
  );

}; 

  return (
    <main className="admin-dashboard">
        <button
  className="back-btn"
  onClick={() =>
    navigate("/admin-dashboard")
  }
>
  ← Back to Admin Dashboard
</button>

<h1 className="analytics-page-title">
  Organizer Wise Analytics
</h1>
<div className="export-buttons">

  <button
    className="export-btn"
    onClick={exportCSV}
  >
    Export CSV
  </button>

  <button
    className="export-btn"
    onClick={exportPDF}
  >
    Export PDF
  </button>

</div>
<div className="analytics-cards">

  <div className="analytics-card">
    <h3>Total Organizers</h3>
    <p>{totalOrganizers}</p>
  </div>

  <div className="analytics-card">
    <h3>Total Revenue</h3>
    <p>₹{totalRevenue}</p>
  </div>

  <div className="analytics-card">
    <h3>Total Bookings</h3>
    <p>{totalBookings}</p>
  </div>

  <div className="analytics-card">
    <h3>Top Organizer</h3>
    <p>{topOrganizer?.name}</p>
  </div>

</div>
<h2 className="analytics-section-title">
  Organizer Revenue Report
</h2>
<table className="analytics-table">

  <thead>

    <tr>

      <th>Organizer</th>
      <th>Events Created</th>
      <th>Bookings</th>
      <th>Revenue</th>
      <th>Avg Revenue/Event</th>
      <th>Avg Bookings/Event</th>

    </tr>

  </thead>

  <tbody>
  {analytics.organizerAnalytics.map((organizer) => (
    <tr key={organizer.name}>
  <td>{organizer.name}</td>
  <td>{organizer.eventsCreated}</td>
  <td>{organizer.bookings}</td>
  <td>₹{organizer.revenue}</td>
  <td>₹{organizer.avgRevenuePerEvent}</td>
  <td>{organizer.avgBookingsPerEvent}</td>
</tr>
  ))}
</tbody>

</table>
<section className="analytics-section">
  <h2 className="analytics-section-title">
    Organizer Revenue Chart
  </h2>

  <div className="analytics-chart-card">

    <ResponsiveContainer
      width="100%"
      height={400}
    >

      <BarChart data={chartData}>

        <CartesianGrid
          strokeDasharray="3 3"
        />

        <XAxis
          dataKey="name"
          tick={{
            fill: "#ffffff"
          }}
        />

        <YAxis
          tick={{
            fill: "#ffffff"
          }}
        />

        <Tooltip />

        <Bar
          dataKey="revenue"
          fill="#a855f7"
          radius={[10,10,10,10]}
        />

      </BarChart>

    </ResponsiveContainer>

  </div>
</section>
    </main>
  );
}

export default AdminOrganizerAnalyticsPage;