# 🎉 Eventora – Comprehensive Multilingual Event Management and Analytics Platform

**Manage Events. Measure Success.**

Eventora is a MERN stack-based web application designed to simplify event management through event creation, participant registration, online ticket booking, secure payment processing, QR code ticket generation, multilingual support, and real-time analytics.

The platform provides separate dashboards for Participants, Organizers, and Administrators to ensure efficient event management.

## 🚀 Key Features

- **User Authentication:** Secure registration and login using JWT and bcrypt.
- **Event Management:** Organizers can create, update, and manage events.
- **Online Booking:** Participants can browse events and book tickets.
- **Secure Payments:** Razorpay integration for payment processing.
- **QR Code Tickets:** Automatic QR code generation for event tickets.
- **Email Notifications:** Automated email notifications using Nodemailer.
- **Multilingual Support:** Supports five languages.
- **Analytics Dashboard:** Track users, events, bookings, and revenue.
- **Role-Based Access:** Separate functionalities for Participants, Organizers, and Administrators.

## 👥 User Roles

| Role | Functionalities |
|---|---|
| Participant | Browse events, book tickets, make payments, access tickets |
| Organizer | Create events, manage bookings, monitor event performance |
| Administrator | Manage users, monitor events, view platform analytics |

## 🌐 Supported Languages

Eventora supports:

- English
- Kannada
- Hindi
- Telugu
- Tamil

## 🛠️ Technologies Used

### Frontend
- React.js
- React Router
- Axios
- CSS / Tailwind CSS
- i18next

### Backend
- Node.js
- Express.js

### Database
- MongoDB
- Mongoose

### Authentication & Security
- JSON Web Token (JWT)
- bcrypt

### Integrations & Tools
- Razorpay (Test Mode)
- Nodemailer
- QR Code Generation
- Postman
- Vite

## 📂 Project Structure

```text
Eventora/
│
├── client/                 # React Frontend
│
├── server/                 # Node.js & Express Backend
│
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

## ⚙️ Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/suchitraKM-7/Eventora-A-Comprehensive-Multilingual-Event-Management-and-Analytics-Platform.git
```

### 2. Navigate to the Project

```bash
cd Eventora-A-Comprehensive-Multilingual-Event-Management-and-Analytics-Platform
```

### 3. Install Backend Dependencies

```bash
cd server
npm install
```

### 4. Install Frontend Dependencies

Open another terminal:

```bash
cd client
npm install
```

### 5. Configure Environment Variables

Create a `.env` file inside the server folder.

Configure the required environment variables according to your backend configuration, including:

- MongoDB connection string
- JWT secret
- Razorpay test credentials
- Email configuration

**Note:** Never upload your `.env` file or private API credentials to GitHub.

### 6. Run the Application

Start the backend:

```bash
cd server
npm start
```

Start the frontend in another terminal:

```bash
cd client
npm run dev
```

Open the local URL displayed by Vite in your browser.

## 📊 Analytics Dashboard

The platform provides analytics to monitor:

- Total registered users
- Active users
- Total events
- Total bookings
- Revenue generated
- Event-wise revenue
- Organizer-wise revenue
## 📸 Project Screenshots

### Eventora Landing Page

![Eventora Landing Page](screenshots/landing-page.png)
### Participant Dashboard

#### Dashboard Overview
![Participant Dashboard](screenshots/participant-dashboard-top.png)

#### Available Events
![Available Events](screenshots/participant-dashboard-events.png)
## Participant Dashboard

### Dashboard Overview
![Participant Dashboard](screenshots/participant-dashboard-top.png)

### Available Events
![Available Events](screenshots/participant-dashboard-events.png)

## Organizer Dashboard

### Dashboard Overview
![Organizer Dashboard](screenshots/organizer-dashboard-overview.png)

### Quick Actions and Statistics
![Organizer Dashboard Statistics](screenshots/organizer-dashboard-stats.png)

### Recent Events and Analytics
![Organizer Dashboard Analytics](screenshots/organizer-dashboard-analytics.png)

## Admin Dashboard

### Dashboard Overview
![Admin Dashboard](screenshots/admin-dashboard-overview.png)

### Date-wise Analytics
![Date-wise Analytics](screenshots/admin-datewise-analytics.png)

### Event-wise Analytics
![Event-wise Analytics](screenshots/admin-eventwise-analytics.png)

### Organizer-wise Analytics
![Organizer-wise Analytics](screenshots/admin-organizer-analytics.png)

## Other Features

### Create Event
![Create Event](screenshots/create-event.png)

### My Bookings
![My Bookings](screenshots/my-bookings.png)

### QR Ticket
![QR Ticket](screenshots/qr-ticket.png)

## 🔮 Future Enhancements

- Live event tracking.
- Advanced reporting and analytics.
- Enhanced event recommendation system.
- Cloud-based deployment.
- Improved mobile responsiveness.

## 👩‍💻 Developer

**Suchitra K M**

Master of Computer Applications (MCA)

GitHub: https://github.com/suchitraKM-7

---

⭐ If you find this project interesting, don't forget to star the repository!

**Eventora – Manage Events. Measure Success.**
