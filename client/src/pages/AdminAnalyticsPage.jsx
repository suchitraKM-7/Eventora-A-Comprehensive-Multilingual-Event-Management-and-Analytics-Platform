import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../config";
import "./AdminDashboard.css";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";

function AdminAnalyticsPage() {
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState(null);
  const [view, setView] = useState("daily");

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
    return <h2>Loading Analytics...</h2>;
  }

  const cards = analytics.summary;
  const stats = {
  daily: {
    users: cards.dailyUsers,
    activeUsers: cards.dailyActiveUsers,
    events: cards.dailyEvents,
    bookings: cards.dailyBookings,
    revenue: cards.dailyRevenue
  },

  weekly: {
    users: cards.weeklyUsers,
    activeUsers: cards.weeklyActiveUsers,
    events: cards.weeklyEvents,
    bookings: cards.weeklyBookings,
    revenue: cards.weeklyRevenue
  },

  monthly: {
    users: cards.monthlyUsers,
    activeUsers: cards.monthlyActiveUsers,
    events: cards.monthlyEvents,
    bookings: cards.monthlyBookings,
    revenue: cards.monthlyRevenue
  },

  yearly: {
    users: cards.yearlyUsers,
    activeUsers: cards.yearlyActiveUsers,
    events: cards.yearlyEvents,
    bookings: cards.yearlyBookings,
    revenue: cards.yearlyRevenue
  }

};

const filteredReports =
  analytics.bookingReports.filter(
    (report) => {

      const bookingDate =
        new Date(
          report.bookingDate
        );

      const now =
        new Date();

      if (view === "daily") {

        return (
          bookingDate
            .toDateString() ===
          now.toDateString()
        );

      }

      if (view === "weekly") {

  const sevenDaysAgo =
    new Date();

  sevenDaysAgo.setDate(
    sevenDaysAgo.getDate() - 7
  );

  return (
    bookingDate >=
    sevenDaysAgo
  );

}

      if (view === "monthly") {

        return (
          bookingDate.getMonth() ===
          now.getMonth() &&
          bookingDate.getFullYear() ===
          now.getFullYear()
        );

      }

      return (
        bookingDate.getFullYear() ===
        now.getFullYear()
      );

    }
  );
  const sortedReports = [...filteredReports].sort(
  (a, b) =>
    new Date(b.bookingDate) -
    new Date(a.bookingDate)
);

const totalRevenue =
  filteredReports.reduce(
    (sum, report) =>
      sum + report.amount,
    0
  );
  const exportCSV = () => {

  const headers = [
    "Date",
    "Event Name",
    "User",
    "Organizer",
    "Amount"
  ];

  const rows = sortedReports.map(
    report => [
      new Date(
  report.bookingDate
).toISOString().split("T")[0],

      report.eventName,

      report.userName,

      report.organizerName,

      report.amount
    ]
  );

  const csvContent =
    [
      headers,
      ...rows
    ]
      .map(
        row =>
          row.join(",")
      )
      .join("\n");

  const blob =
    new Blob(
      [csvContent],
      {
        type:
          "text/csv;charset=utf-8;"
      }
    );

  const link =
    document.createElement("a");

  link.href =
    URL.createObjectURL(blob);

  link.download =
    `${view}-analytics-report.csv`;

  link.click();
};
const exportPDF = () => {

  const doc = new jsPDF();

  doc.setFontSize(18);

  doc.text(
    `${view.toUpperCase()} ANALYTICS REPORT`,
    14,
    20
  );

  autoTable(doc, {
    startY: 30,

    head: [[
      "Date",
      "Event Name",
      "User",
      "Organizer",
      "Amount"
    ]],

    body: sortedReports.map(
      report => [
        new Date(
          report.bookingDate
        ).toLocaleDateString(),

        report.eventName,
        report.userName,
        report.organizerName,
        report.amount.toString()
      ]
    )
  });

  doc.save(
    `${view}-analytics-report.pdf`
  );
};


  return (
  <main className="admin-analytics-page">
  <button
  className="back-btn"
  onClick={() => navigate("/admin-dashboard")}
>
  ← Back to Admin Dashboard
</button>
    <h1 className="analytics-page-title">
      Date wise Analytics
    </h1>
    <div className="analytics-filter">

<button
  className={
    view === "daily"
      ? "filter-btn active"
      : "filter-btn"
  }
  onClick={() => setView("daily")}
>
  Daily
</button>

<button
  className={
    view === "weekly"
      ? "filter-btn active"
      : "filter-btn"
  }
  onClick={() => setView("weekly")}
>
  Weekly
</button>

<button
  className={
    view === "monthly"
      ? "filter-btn active"
      : "filter-btn"
  }
  onClick={() => setView("monthly")}
>
  Monthly
</button>

<button
  className={
    view === "yearly"
      ? "filter-btn active"
      : "filter-btn"
  }
  onClick={() => setView("yearly")}
>
  Yearly
</button>

</div>
  <h2 className="analytics-subtitle">
  {view.charAt(0).toUpperCase() + view.slice(1)} Analytics
</h2>
    <div className="analytics-cards">

  <div className="analytics-card">
    <h3> New Users</h3>
    <p>{stats[view].users}</p>
  </div>
  <div className="analytics-card">
    <h3>Active Users</h3>
    <p>{stats[view].activeUsers}</p>
  </div>
  <div className="analytics-card">
    <h3>Events</h3>
    <p>{stats[view].events}</p>
  </div>

  <div className="analytics-card">
    <h3>Bookings</h3>
    <p>{stats[view].bookings}</p>
  </div>

  <div className="analytics-card">
    <h3>Revenue</h3>
    <p>₹{stats[view].revenue}</p>
  </div>

</div>

<section className="analytics-section">
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
  <h2 className="analytics-section-title">
    Booking Reports
  </h2>

  <div className="report-summary">

    <div className="summary-box">
      <h3>Total Revenue</h3>
      <p>₹{totalRevenue}</p>
    </div>

    <div className="summary-box">
      <h3>Total Bookings</h3>
      <p>{filteredReports.length}</p>
    </div>

  </div>

  <table className="analytics-table">
   
    <thead>

      <tr>
        <th>Date</th>
        <th>Event Name</th>
        <th>User</th>
        <th>Organizer</th>
        <th>Amount</th>
        
      </tr>

    </thead>

    <tbody>

  {filteredReports.length === 0 ? (

    <tr>
      <td
        colSpan="5"
        style={{
          textAlign: "center",
          padding: "20px"
        }}
      >
        No booking data available
      </td>
    </tr>

  ) : (

    [...filteredReports]
      .sort(
        (a, b) =>
          new Date(b.bookingDate) -
          new Date(a.bookingDate)
      )
      .map(
        (report, index) => (

          <tr key={index}>

            <td>
              {new Date(
                report.bookingDate
              ).toLocaleDateString()}
            </td>

            <td>
              {report.eventName}
            </td>

            <td>
              {report.userName}
            </td>

            <td>
              {report.organizerName}
            </td>

            <td>
              ₹{report.amount}
            </td>

          </tr>

        )
      )

  )}

</tbody>

  </table>

</section>

</main>
);
}
export default AdminAnalyticsPage;