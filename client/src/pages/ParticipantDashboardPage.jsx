import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { API_URL, getStoredUser, getUserLanguageKey } from "../config";
import EmptyState from "../components/ui/EmptyState";
import { getUniqueCategories, normalizeCategory } from "../helpers/categoryOptions";

function ParticipantDashboardPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const user = getStoredUser();
  const userId = user?.id;

  const [events, setEvents] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState({});
  const [selectedCategory, setSelectedCategory] = useState("All");

  const fetchEvents = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}/api/events`);
      setEvents(response.data);
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    if (!userId) {
      navigate("/login");
      return;
    }

    const savedLanguage = localStorage.getItem(getUserLanguageKey(userId));

    if (savedLanguage && savedLanguage !== i18n.language) {
      i18n.changeLanguage(savedLanguage);
    }

    queueMicrotask(fetchEvents);
  }, [fetchEvents, i18n, navigate, userId]);

  const handlePayment = async (event) => {
    try {
      const seatNumber = selectedSeats[event._id];

      if (!seatNumber) {
        alert(t("selectSeatFirst"));
        return;
      }

      const orderResponse = await axios.post(`${API_URL}/api/payments/create-order`, {
        amount: event.price,
      });

      const order = orderResponse.data;

      const options = {
        key: "rzp_test_SzAg77cHkWenTp",
        amount: order.amount,
        currency: order.currency,
        name: t("eventora"),
        description: event.eventName,
        order_id: order.id,
        handler: async function (response) {
          try {
            const bookingResponse = await axios.post(`${API_URL}/api/bookings/book`, {
              userId,
              eventId: event._id,
              seatNumber,
              paymentId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id,
            });

            alert(bookingResponse.data.message);
            setSelectedSeats({ ...selectedSeats, [event._id]: "" });
            fetchEvents();
          } catch (error) {
            alert(error.response?.data?.message || t("bookingFailed"));
          }
        },
        theme: { color: "#8b5cf6" },
      };

      const razorpay = new window.Razorpay(options);

      razorpay.on("payment.failed", function (response) {
        console.log(response.error);
        alert(response.error.description);
      });

      razorpay.open();
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || t("bookingFailed"));
    }
  };

  const handleLanguageChange = (event) => {
    const language = event.target.value;
    i18n.changeLanguage(language);
    localStorage.setItem(getUserLanguageKey(userId), language);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("selectedLanguage");
    i18n.changeLanguage("en");
    navigate("/");
  };

  const languages = [
    { code: "en", label: "English" },
    { code: "hi", label: "Hindi" },
    { code: "te", label: "Telugu" },
    { code: "kn", label: "Kannada" },
    { code: "ta", label: "Tamil" },
  ];

  const eventCategories = getUniqueCategories(events);

  const filteredEvents =
    selectedCategory === "All"
      ? events
      : events.filter(
          (event) => normalizeCategory(event.category) === selectedCategory
        );

  return (
    <main className="participant-dashboard-page">
      <div className="mx-auto max-w-7xl">
        <div className="participant-hero">
          <h1>{t("eventora")}</h1>
          <h2>
            {t("welcomeBack")}, {user?.name}
          </h2>
          <p>{t("participantHeroSubtitle")}</p>
        </div>

        <div className="event-banner">
          <img
            src="https://images.unsplash.com/photo-1501386761578-eac5c94b800a"
            alt={t("eventBanner")}
          />
          <button className="banner-arrow left" aria-label={t("previous")}>
            &lt;
          </button>
          <button className="banner-arrow right" aria-label={t("next")}>
            &gt;
          </button>
        </div>

        <div className="language-card">
          {languages.map((language) => (
            <button
              key={language.code}
              onClick={() => handleLanguageChange({ target: { value: language.code } })}
              className={`language-btn ${i18n.language === language.code ? "active" : ""}`}
            >
              {language.label}
            </button>
          ))}
        </div>

        <div className="mb-6 mt-4 flex flex-wrap gap-3">
          <button onClick={() => navigate("/my-bookings")} className="eventora-btn">
            {t("myBookings")}
          </button>

          <button onClick={handleLogout} className="eventora-logout-btn">
            {t("logout")}
          </button>
        </div>

        <section className="eventora-events">
          <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <h2 className="eventora-section-title">{t("availableEvents")}</h2>

            <label className="flex flex-col md:flex-row md:items-center gap-2 font-bold">
              {t("filterByCategory")}
              <select
                value={selectedCategory}
                onChange={(event) => setSelectedCategory(event.target.value)}
                className="rounded-lg border p-2 font-normal"
              >
                {eventCategories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.value === "All" ? t("allCategories") : category.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {filteredEvents.length === 0 ? (
            <EmptyState title={t("noEventsFound")} />
          ) : (
            <div className="event-grid">
              {filteredEvents.map((event) => (
                <div className="event-card-new" key={event._id}>
                  <img
                    src={
                      event.image ||
                      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f"
                    }
                    alt={event.eventName}
                    className="event-image"
                  />

                  <div className="event-details">
                    <span className="event-category">{event.category}</span>
                    <h3 className="event-title">{event.eventName}</h3>
                    <p>{t("date")}: {event.date}</p>
                    <p>{t("venue")}: {event.venue}</p>
                    <p>{t("price")}: INR {event.price}</p>
                    <p>
                      {t("availableSeats")}:{" "}
                      {event.capacity - (event.bookedSeats?.length || 0)}
                    </p>

                    <div className="event-actions">
                      <select
                        value={selectedSeats[event._id] || ""}
                        onChange={(e) =>
                          setSelectedSeats({
                            ...selectedSeats,
                            [event._id]: e.target.value,
                          })
                        }
                      >
                        <option value="">{t("selectSeat")}</option>
                        {Array.from({ length: event.capacity }, (_, index) => {
                          const seat = `S${index + 1}`;
                          if (event.bookedSeats?.includes(seat)) return null;

                          return (
                            <option key={seat} value={seat}>
                              {seat}
                            </option>
                          );
                        })}
                      </select>

                      <button onClick={() => handlePayment(event)} className="book-btn">
                        {t("payBook")}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default ParticipantDashboardPage;
