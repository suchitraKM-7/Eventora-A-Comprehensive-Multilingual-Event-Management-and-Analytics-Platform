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
  CartesianGrid,
  ResponsiveContainer
} from "recharts";

function AdminEventAnalyticsPage() {

  const navigate = useNavigate();

  const [analytics, setAnalytics] = useState(null);

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
  const totalEvents = analytics.eventAnalytics.length;

const totalRevenue =
  analytics.eventAnalytics.reduce(
    (sum, event) => sum + event.revenue,
    0
  );
  const avgRevenuePerEvent =
  analytics.eventAnalytics.length > 0
    ? (
        totalRevenue /
        analytics.eventAnalytics.length
      ).toFixed(2)
    : 0;
    const topEvents =
  [...analytics.eventAnalytics]
    .sort(
      (a, b) =>
        b.revenue - a.revenue
    )
    .slice(0, 3);
const totalBookings =
  analytics.eventAnalytics.reduce(
    (sum, event) => sum + event.bookings,
    0
  );
  const avgRevenuePerBooking =
  totalBookings > 0
    ? (
        totalRevenue /
        totalBookings
      ).toFixed(2)
    : 0;
    const successfulEvents =
  analytics.eventAnalytics.filter(
    event => event.bookings > 0
  ).length;

const successRate =
  (
    successfulEvents /
    analytics.eventAnalytics.length
  * 100
  ).toFixed(1);

const topRevenueEvent =
  [...analytics.eventAnalytics]
    .sort((a, b) => b.revenue - a.revenue)[0];
const eventChartData =
  analytics.eventAnalytics.map(event => ({
    eventName: event.eventName,
    name: event.eventName
      .replace("2026", "")
      .split(" ")
      .slice(0, 2)
      .join(" "),
    revenue: event.revenue
  }));
const EventRevenueTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) {
    return null;
  }

  const data = payload[0].payload;

  return (
    <div className="analytics-chart-tooltip">
      <strong>{data.eventName}</strong>
      <span>Revenue: ₹{data.revenue}</span>
    </div>
  );
};
const exportCSV = () => {

const csvRows = [

  [
    "Event Name",
    "Organizer",
    "Total Seats",
    "Available Seats",
    "Booked Seats",
    "Event Date",
    "Revenue"
  ],

...analytics.eventAnalytics.map(
  event => [

    event.eventName,

    event.organizer,

    event.totalSeats,

    event.availableSeats,

    event.bookedSeats,

    new Date(
  event.eventDate
).toLocaleDateString(),

    event.revenue

  ]
)
];

const csvContent =
csvRows
.map(row => row.join(","))
.join("\n");

const blob = new Blob(
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
"event-wise-report.csv";

link.click();

};
const exportPDF = () => {

const doc =
new jsPDF();

doc.text(
"EVENT WISE ANALYTICS REPORT",
20,
20
);

autoTable(doc, {

head: [[
  "Event",
  "Organizer",
  "Total Seats",
  "Available Seats",
  "Booked Seats",
  "Event Date",
  "Revenue"
]],

body:
  analytics.eventAnalytics.map(
    event => [

      event.eventName,

      event.organizer,

      event.totalSeats,

      event.availableSeats,

      event.bookedSeats,

      new Date(
  event.eventDate
).toLocaleDateString(),

      `Rs. ${event.revenue}`

    ]
  )

});

doc.save(
"event-wise-report.pdf"
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
      Event Wise Analytics
    </h1>
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

      <section className="analytics-section">
        <div className="analytics-cards">

  <div className="analytics-card">
    <h3>Total Events</h3>
    <p>{totalEvents}</p>
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
  <h3>Avg Revenue/Event</h3>
  <p>₹{avgRevenuePerEvent}</p>
</div>
<div className="analytics-card">
  <h3>Avg Revenue/Booking</h3>
  <p>₹{avgRevenuePerBooking}</p>
</div>
<div className="analytics-card">
  <h3>Event Success Rate</h3>
  <p>{successRate}%</p>
</div>
  <div className="analytics-card">
    <h3>Top Revenue Event</h3>
    <p>{topRevenueEvent?.eventName}</p>
  </div>

</div>

        <h2 className="analytics-section-title">
          Event Revenue Report
        </h2>

        <table className="analytics-table">

          <thead>

            <tr>

              <th>Event Name</th>
              <th>Organizer</th>
              <th>Event Date</th>
              <th>Revenue</th>
              <th>Total Seats</th>
              <th>Available Seats</th>
              <th>Booked Seats</th>

            </tr>

          </thead>

          <tbody>

            {analytics.eventAnalytics
              .sort((a, b) => b.revenue - a.revenue)
              .map((event) => (

                <tr key={event.eventName}>

                  <td>{event.eventName}</td>
                  <td>{event.organizer}</td>
                  <td>{new Date(event.eventDate).toLocaleDateString()}</td>                  <td>₹{event.revenue}</td>
                  <td>{event.totalSeats}</td>
                  <td>{event.availableSeats}</td>
                  <td>{event.bookedSeats}</td>

                </tr>

            ))}

          </tbody>

        </table>

      </section>
      <section className="analytics-section">

  <h2 className="analytics-section-title">
    Top 3 Revenue Events
  </h2>

  <table className="analytics-table">

    <thead>
      <tr>
        <th>Rank</th>
        <th>Event Name</th>
        <th>Revenue</th>
      </tr>
    </thead>

    <tbody>

      {topEvents.map(
        (event, index) => (

          <tr key={event.eventName}>

            <td>#{index + 1}</td>

            <td>
              {event.eventName}
            </td>

            <td>
              ₹{event.revenue}
            </td>

          </tr>

        )
      )}

    </tbody>

  </table>

</section>
<section className="analytics-section">

  <h2 className="analytics-section-title">
    Event Revenue Chart
  </h2>

  <div className="chart-container">

    <ResponsiveContainer
      width="100%"
      height={400}
    >

      <BarChart data={eventChartData}>

        <CartesianGrid strokeDasharray="3 3" />

        <XAxis dataKey="name" tick={false} />

        <YAxis />

        <Tooltip content={<EventRevenueTooltip />} />

        <Bar
          dataKey="revenue"
          fill="#a855f7"
        />

      </BarChart>

    </ResponsiveContainer>

  </div>

</section>


    </main>

  );

}

export default AdminEventAnalyticsPage;
