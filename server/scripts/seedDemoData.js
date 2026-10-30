const dotenv = require("dotenv");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("../models/User");
const Event = require("../models/Event");
const Booking = require("../models/Booking");

dotenv.config();

const password = "Password@123";

const organizers = [
  {
    name: "Aarav Mehta",
    email: "aarav.organizer@example.com",
    phone: "9876500001",
    language: "English",
  },
  {
    name: "Priya Reddy",
    email: "priya.organizer@example.com",
    phone: "9876500002",
    language: "Telugu",
  },
  {
    name: "Kavya Iyer",
    email: "kavya.organizer@example.com",
    phone: "9876500003",
    language: "Tamil",
  },
  {
    name: "Nikhil Kapoor",
    email: "nikhil.organizer@example.com",
    phone: "9876500004",
    language: "Hindi",
  },
  {
    name: "Meera Gowda",
    email: "meera.organizer@example.com",
    phone: "9876500005",
    language: "Kannada",
  },
  {
    name: "Farah Khan",
    email: "farah.organizer@example.com",
    phone: "9876500006",
    language: "English",
  },
];

const participants = [
  {
    name: "Rahul Sharma",
    email: "rahul.participant@example.com",
    phone: "9876510001",
    language: "Hindi",
  },
  {
    name: "Sneha Rao",
    email: "sneha.participant@example.com",
    phone: "9876510002",
    language: "Kannada",
  },
  {
    name: "Divya Nair",
    email: "divya.participant@example.com",
    phone: "9876510003",
    language: "English",
  },
  {
    name: "Manoj Kumar",
    email: "manoj.participant@example.com",
    phone: "9876510004",
    language: "Telugu",
  },
  {
    name: "Ananya Krishnan",
    email: "ananya.participant@example.com",
    phone: "9876510005",
    language: "Tamil",
  },
  {
    name: "Vikram Desai",
    email: "vikram.participant@example.com",
    phone: "9876510006",
    language: "English",
  },
  {
    name: "Ishita Banerjee",
    email: "ishita.participant@example.com",
    phone: "9876510007",
    language: "Hindi",
  },
  {
    name: "Arjun Varma",
    email: "arjun.participant@example.com",
    phone: "9876510008",
    language: "Telugu",
  },
  {
    name: "Neha Kulkarni",
    email: "neha.participant@example.com",
    phone: "9876510009",
    language: "Kannada",
  },
  {
    name: "Sanjay Menon",
    email: "sanjay.participant@example.com",
    phone: "9876510010",
    language: "Tamil",
  },
  {
    name: "Pooja Malhotra",
    email: "pooja.participant@example.com",
    phone: "9876510011",
    language: "English",
  },
  {
    name: "Kiran Patel",
    email: "kiran.participant@example.com",
    phone: "9876510012",
    language: "Hindi",
  },
  {
    name: "Aditya Shetty",
    email: "aditya.participant@example.com",
    phone: "9876510013",
    language: "Kannada",
  },
  {
    name: "Riya Kapoor",
    email: "riya.participant@example.com",
    phone: "9876510014",
    language: "Hindi",
  },
  {
    name: "Karthik Ramesh",
    email: "karthik.participant@example.com",
    phone: "9876510015",
    language: "Tamil",
  },
  {
    name: "Meghana Choudary",
    email: "meghana.participant@example.com",
    phone: "9876510016",
    language: "Telugu",
  },
  {
    name: "Aisha Fernandes",
    email: "aisha.participant@example.com",
    phone: "9876510017",
    language: "English",
  },
];

const eventTemplates = [
  {
    organizerEmail: "aarav.organizer@example.com",
    eventName: "Grand Wedding Expo 2026",
    category: "Wedding",
    description: "Premium wedding planners, venues, decor teams and live showcases.",
    venue: "Taj Convention Centre, Bengaluru",
    date: "2026-09-12",
    time: "18:00",
    price: 1499,
    capacity: 120,
  },
  {
    organizerEmail: "aarav.organizer@example.com",
    eventName: "Startup Leadership Summit",
    category: "Business",
    description: "Founder talks, networking and product leadership sessions.",
    venue: "NIMHANS Convention Centre, Bengaluru",
    date: "2026-10-05",
    time: "10:00",
    price: 999,
    capacity: 90,
  },
  {
    organizerEmail: "aarav.organizer@example.com",
    eventName: "Indie Music Night",
    category: "Concert",
    description: "An evening of independent artists, fusion bands and food stalls.",
    venue: "Phoenix Marketcity Arena, Bengaluru",
    date: "2026-11-18",
    time: "19:30",
    price: 799,
    capacity: 150,
  },
  {
    organizerEmail: "priya.organizer@example.com",
    eventName: "Hyderabad Food Carnival",
    category: "Food",
    description: "Regional cuisines, chef counters and live cultural performances.",
    venue: "Hitex Exhibition Centre, Hyderabad",
    date: "2026-09-25",
    time: "12:00",
    price: 499,
    capacity: 180,
  },
  {
    organizerEmail: "priya.organizer@example.com",
    eventName: "Tech for Bharat Conference",
    category: "Technology",
    description: "Product demos, AI workshops and multilingual technology talks.",
    venue: "T-Hub, Hyderabad",
    date: "2026-10-22",
    time: "09:30",
    price: 1299,
    capacity: 110,
  },
  {
    organizerEmail: "priya.organizer@example.com",
    eventName: "Classical Dance Festival",
    category: "Culture",
    description: "Kuchipudi, Bharatanatyam and Carnatic ensemble performances.",
    venue: "Shilpakala Vedika, Hyderabad",
    date: "2026-12-03",
    time: "18:30",
    price: 699,
    capacity: 140,
  },
  {
    organizerEmail: "kavya.organizer@example.com",
    eventName: "Chennai Literature Weekend",
    category: "Literature",
    description: "Author conversations, book launches and poetry sessions.",
    venue: "Sir Mutha Venkatasubba Rao Hall, Chennai",
    date: "2026-09-30",
    time: "11:00",
    price: 399,
    capacity: 100,
  },
  {
    organizerEmail: "kavya.organizer@example.com",
    eventName: "Corporate Annual Gala",
    category: "Corporate",
    description: "Awards, dinner, team recognition and entertainment.",
    venue: "ITC Grand Chola, Chennai",
    date: "2026-11-07",
    time: "19:00",
    price: 1899,
    capacity: 130,
  },
  {
    organizerEmail: "kavya.organizer@example.com",
    eventName: "Beachside Wellness Retreat",
    category: "Wellness",
    description: "Yoga, mindfulness workshops and nutrition sessions.",
    venue: "ECR Beach Resort, Chennai",
    date: "2026-12-19",
    time: "07:00",
    price: 1599,
    capacity: 80,
  },
  {
    organizerEmail: "nikhil.organizer@example.com",
    eventName: "Delhi Fashion Showcase",
    category: "Fashion",
    description: "Designer runway collections, styling workshops and brand pop-ups.",
    venue: "Pragati Maidan, New Delhi",
    date: "2026-10-11",
    time: "17:00",
    price: 1199,
    capacity: 160,
  },
  {
    organizerEmail: "nikhil.organizer@example.com",
    eventName: "North India Wedding Summit",
    category: "Wedding",
    description: "Wedding vendors, venue partners, luxury decor and planning sessions.",
    venue: "The Leela Ambience, Gurugram",
    date: "2026-11-22",
    time: "10:30",
    price: 1699,
    capacity: 140,
  },
  {
    organizerEmail: "nikhil.organizer@example.com",
    eventName: "Comedy Club Live",
    category: "Entertainment",
    description: "Stand-up sets from touring comics with reserved seating.",
    venue: "DLF CyberHub Amphitheatre, Gurugram",
    date: "2026-12-10",
    time: "20:00",
    price: 899,
    capacity: 100,
  },
  {
    organizerEmail: "meera.organizer@example.com",
    eventName: "Mysuru Heritage Walk",
    category: "Travel",
    description: "Guided heritage route with local food and palace history.",
    venue: "Mysore Palace North Gate, Mysuru",
    date: "2026-09-20",
    time: "08:00",
    price: 299,
    capacity: 60,
  },
  {
    organizerEmail: "meera.organizer@example.com",
    eventName: "Bengaluru DevOps Bootcamp",
    category: "Technology",
    description: "Hands-on CI/CD, cloud deployment and monitoring sessions.",
    venue: "Manyata Tech Park, Bengaluru",
    date: "2026-10-28",
    time: "09:00",
    price: 1499,
    capacity: 85,
  },
  {
    organizerEmail: "meera.organizer@example.com",
    eventName: "Kannada Theatre Evening",
    category: "Culture",
    description: "Contemporary Kannada plays with post-show artist interactions.",
    venue: "Ranga Shankara, Bengaluru",
    date: "2026-11-15",
    time: "18:45",
    price: 499,
    capacity: 95,
  },
  {
    organizerEmail: "farah.organizer@example.com",
    eventName: "Mumbai Film Makers Meetup",
    category: "Film",
    description: "Networking for directors, editors, actors and independent producers.",
    venue: "NCPA, Mumbai",
    date: "2026-09-27",
    time: "16:00",
    price: 799,
    capacity: 120,
  },
  {
    organizerEmail: "farah.organizer@example.com",
    eventName: "Luxury Brand Expo",
    category: "Business",
    description: "Premium retail, lifestyle brands and buyer meetings.",
    venue: "Jio World Convention Centre, Mumbai",
    date: "2026-11-29",
    time: "11:00",
    price: 2499,
    capacity: 200,
  },
  {
    organizerEmail: "farah.organizer@example.com",
    eventName: "New Year Gala Preview",
    category: "Party",
    description: "Pre-New-Year dinner, music performances and festive experiences.",
    venue: "Grand Hyatt, Mumbai",
    date: "2026-12-28",
    time: "19:30",
    price: 2999,
    capacity: 180,
  },
];

const eventImageUrls = {
  "Grand Wedding Expo 2026":
    "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&w=1200&q=80",
  "Startup Leadership Summit":
    "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80",
  "Indie Music Night":
    "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80",
  "Hyderabad Food Carnival":
    "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=1200&q=80",
  "Tech for Bharat Conference":
    "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80",
  "Classical Dance Festival":
    "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=1200&q=80",
  "Chennai Literature Weekend":
    "https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&w=1200&q=80",
  "Corporate Annual Gala":
    "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80",
  "Beachside Wellness Retreat":
    "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80",
  "Delhi Fashion Showcase":
    "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1200&q=80",
  "North India Wedding Summit":
    "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
  "Comedy Club Live":
    "https://images.unsplash.com/photo-1585699324551-f6c309eedeca?auto=format&fit=crop&w=1200&q=80",
  "Mysuru Heritage Walk":
    "https://commons.wikimedia.org/wiki/Special:Redirect/file/Mysore%20Palace%2C%20Mysuru.jpg",
  "Bengaluru DevOps Bootcamp":
    "https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=1200&q=80",
  "Kannada Theatre Evening":
    "https://images.unsplash.com/photo-1503095396549-807759245b35?auto=format&fit=crop&w=1200&q=80",
  "Mumbai Film Makers Meetup":
    "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1200&q=80",
  "Luxury Brand Expo":
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80",
  "New Year Gala Preview":
    "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=1200&q=80",
};

const bookingTemplates = [
  ["rahul.participant@example.com", "Grand Wedding Expo 2026", "S1", "Checked-In"],
  ["sneha.participant@example.com", "Grand Wedding Expo 2026", "S2", "Booked"],
  ["divya.participant@example.com", "Startup Leadership Summit", "S1", "Booked"],
  ["manoj.participant@example.com", "Indie Music Night", "S3", "Cancelled"],
  ["ananya.participant@example.com", "Hyderabad Food Carnival", "S1", "Checked-In"],
  ["vikram.participant@example.com", "Hyderabad Food Carnival", "S2", "Booked"],
  ["rahul.participant@example.com", "Tech for Bharat Conference", "S5", "Booked"],
  ["sneha.participant@example.com", "Classical Dance Festival", "S4", "Checked-In"],
  ["divya.participant@example.com", "Chennai Literature Weekend", "S1", "Booked"],
  ["manoj.participant@example.com", "Corporate Annual Gala", "S2", "Checked-In"],
  ["ananya.participant@example.com", "Beachside Wellness Retreat", "S1", "Booked"],
  ["vikram.participant@example.com", "Beachside Wellness Retreat", "S3", "Cancelled"],
  ["ishita.participant@example.com", "Delhi Fashion Showcase", "S1", "Booked"],
  ["arjun.participant@example.com", "Delhi Fashion Showcase", "S2", "Checked-In"],
  ["neha.participant@example.com", "North India Wedding Summit", "S4", "Booked"],
  ["sanjay.participant@example.com", "Comedy Club Live", "S1", "Checked-In"],
  ["pooja.participant@example.com", "Mysuru Heritage Walk", "S3", "Booked"],
  ["kiran.participant@example.com", "Bengaluru DevOps Bootcamp", "S1", "Booked"],
  ["ishita.participant@example.com", "Kannada Theatre Evening", "S2", "Cancelled"],
  ["arjun.participant@example.com", "Mumbai Film Makers Meetup", "S5", "Booked"],
  ["neha.participant@example.com", "Luxury Brand Expo", "S7", "Checked-In"],
  ["sanjay.participant@example.com", "New Year Gala Preview", "S9", "Booked"],
  ["pooja.participant@example.com", "New Year Gala Preview", "S10", "Cancelled"],
  ["kiran.participant@example.com", "Mumbai Film Makers Meetup", "S6", "Checked-In"],
  ["aditya.participant@example.com", "Bengaluru DevOps Bootcamp", "S31", "Booked"],
  ["riya.participant@example.com", "Startup Leadership Summit", "S32", "Booked"],
  ["karthik.participant@example.com", "Mysuru Heritage Walk", "S33", "Checked-In"],
  ["meghana.participant@example.com", "Hyderabad Food Carnival", "S34", "Booked"],
  ["aisha.participant@example.com", "Grand Wedding Expo 2026", "S35", "Checked-In"],
  ["aditya.participant@example.com", "Tech for Bharat Conference", "S36", "Booked"],
  ["riya.participant@example.com", "Delhi Fashion Showcase", "S37", "Checked-In"],
  ["karthik.participant@example.com", "Beachside Wellness Retreat", "S38", "Booked"],
  ["meghana.participant@example.com", "Classical Dance Festival", "S39", "Checked-In"],
  ["aisha.participant@example.com", "Indie Music Night", "S40", "Booked"],
];

const upsertUser = async (user, role, hashedPassword) =>
  User.findOneAndUpdate(
    { email: user.email },
    {
      ...user,
      role,
      password: hashedPassword,
    },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );

const makeTicketNumber = (eventName, seatNumber) =>
  `TKT-DEMO-${eventName
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 28)}-${seatNumber}`;

const seed = async () => {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not configured");
  }

  await mongoose.connect(process.env.MONGODB_URI);

  const hashedPassword = await bcrypt.hash(password, 10);

  const organizerDocs = await Promise.all(
    organizers.map((organizer) =>
      upsertUser(organizer, "organizer", hashedPassword)
    )
  );

  const participantDocs = await Promise.all(
    participants.map((participant) =>
      upsertUser(participant, "participant", hashedPassword)
    )
  );

  const organizerByEmail = Object.fromEntries(
    organizerDocs.map((organizer) => [organizer.email, organizer])
  );

  const eventDocs = [];

  for (const template of eventTemplates) {
    const organizer = organizerByEmail[template.organizerEmail];
    const event = await Event.findOneAndUpdate(
      { eventName: template.eventName },
      {
        organizerId: organizer._id,
        eventName: template.eventName,
        category: template.category,
        description: template.description,
        venue: template.venue,
        date: template.date,
        time: template.time,
        price: template.price,
        capacity: template.capacity,
        image: eventImageUrls[template.eventName] || "",
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    eventDocs.push(event);
  }

  const userByEmail = Object.fromEntries(
    participantDocs.map((participant) => [participant.email, participant])
  );
  const eventByName = Object.fromEntries(
    eventDocs.map((event) => [event.eventName, event])
  );

  const desiredSeatsByEvent = {};

  for (const [email, eventName, seatNumber, attendanceStatus] of bookingTemplates) {
    const user = userByEmail[email];
    const event = eventByName[eventName];
    const isCancelled = attendanceStatus === "Cancelled";

    await Booking.findOneAndUpdate(
      {
        userId: user._id,
        eventId: event._id,
        status: isCancelled ? "Cancelled" : "Booked",
      },
      {
        userId: user._id,
        eventId: event._id,
        seatNumber,
        ticketPrice: event.price,
        ticketNumber: makeTicketNumber(eventName, seatNumber),
        paymentId: `pay_demo_${seatNumber.toLowerCase()}`,
        orderId: `order_demo_${seatNumber.toLowerCase()}`,
        status: isCancelled ? "Cancelled" : "Booked",
        attendanceStatus,
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    if (!isCancelled) {
      desiredSeatsByEvent[eventName] = desiredSeatsByEvent[eventName] || [];
      desiredSeatsByEvent[eventName].push(seatNumber);
    }
  }

  for (const event of eventDocs) {
    const bookedSeats = desiredSeatsByEvent[event.eventName] || [];
    event.bookedSeats = bookedSeats;
    event.availableSeats = Math.max(event.capacity - bookedSeats.length, 0);
    await event.save();
  }

  console.log("Demo data seeded successfully");
  console.log(`Organizers: ${organizerDocs.length}`);
  console.log(`Participants: ${participantDocs.length}`);
  console.log(`Events: ${eventDocs.length}`);
  console.log(`Bookings: ${bookingTemplates.length}`);
  console.log(`Password for all demo accounts: ${password}`);
};

seed()
  .catch((error) => {
    console.error("Demo data seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
