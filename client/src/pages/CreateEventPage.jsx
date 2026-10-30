import { useEffect, useState } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { API_URL, getStoredUser } from "../config";
import useUserLanguage from "../hooks/useUserLanguage";

const categoryOptions = ["Sports", "Music", "Technology", "Education", "Business"];

function CreateEventPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const user = getStoredUser();
  useUserLanguage();

  const [formData, setFormData] = useState({
    eventName: "",
    category: "",
    description: "",
    venue: "",
    date: "",
    time: "",
    price: "",
    capacity: "",
    image: "",
  });

  useEffect(() => {
    if (!user || user.role !== "organizer") {
      navigate("/login");
    }
  }, [navigate, user]);

  if (!user || user.role !== "organizer") {
    return null;
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert(t("validImageMessage"));
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      setFormData((current) => ({
        ...current,
        image: reader.result,
      }));
    };

    reader.readAsDataURL(file);
  };

  const isPastDate = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return new Date(`${date}T00:00:00`) < today;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isPastDate(formData.date)) {
      alert(t("eventDatePastMessage"));
      return;
    }

    if (Number(formData.capacity) <= 0) {
      alert(t("capacityGreaterThanZero"));
      return;
    }

    if (Number(formData.price) < 0) {
      alert(t("priceCannotBeNegative"));
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/api/events/create`, {
        organizerId: user.id,
        ...formData,
        price: Number(formData.price),
        capacity: Number(formData.capacity),
      });

      alert(response.data.message);

      setFormData({
        eventName: "",
        category: "",
        description: "",
        venue: "",
        date: "",
        time: "",
        price: "",
        capacity: "",
        image: "",
      });
    } catch (error) {
      alert(error.response?.data?.message || t("eventCreationFailed"));
    }
  };

  return (
    <main className="create-event-page">
      <button
        type="button"
        onClick={() => navigate("/organizer-dashboard")}
        className="back-btn"
      >
        {t("backToDashboard")}
      </button>

      <div className="create-event-container">
        <div className="create-event-card">
          <h1 className="create-event-title">{t("createEvent")}</h1>

          <p className="create-event-subtitle">{t("professionalEventForm")}</p>

          <form onSubmit={handleSubmit}>
            <div className="create-event-grid">
              <div className="input-group">
                <label>{t("eventName")}</label>
                <input
                  type="text"
                  name="eventName"
                  value={formData.eventName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="input-group">
                <label>{t("category")}</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="input-group"
                  required
                >
                  <option value="">{t("selectCategory")}</option>
                  {categoryOptions.map((category) => (
                    <option key={category} value={category}>
                      {t(`category${category}`)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="input-group">
              <label>{t("description")}</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>

            <div className="create-event-grid">
              <div className="input-group">
                <label>{t("venue")}</label>
                <input
                  type="text"
                  name="venue"
                  value={formData.venue}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="input-group">
                <label>{t("date")}</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  min={new Date().toISOString().split("T")[0]}
                  required
                />
              </div>
            </div>

            <div className="create-event-grid">
              <div className="input-group">
                <label>{t("time")}</label>
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="input-group">
                <label>{t("price")}</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  min="0"
                  required
                />
              </div>
            </div>

            <div className="create-event-grid">
              <div className="input-group">
                <label>{t("capacity")}</label>
                <input
                  type="number"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleChange}
                  min="1"
                  required
                />
              </div>

              <div className="input-group">
                <label>{t("eventBanner")}</label>
                <input type="file" accept="image/*" onChange={handleImageUpload} />
              </div>
            </div>

            {formData.image && (
              <img
                src={formData.image}
                alt={t("preview")}
                className="event-image-preview"
              />
            )}

            <button type="submit" className="create-event-btn">
              {t("createEvent")}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}

export default CreateEventPage;
