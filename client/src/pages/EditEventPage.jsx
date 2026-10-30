import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { API_URL, getStoredUser } from "../config";
import useUserLanguage from "../hooks/useUserLanguage";

const categoryOptions = ["Sports", "Music", "Technology", "Education", "Business"];

function EditEventPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const user = getStoredUser();
  const userId = user?.id;
  const userRole = user?.role;
  useUserLanguage();

  const [formData, setFormData] = useState({
    eventName: "",
    venue: "",
    description: "",
    category: "",
    date: "",
    price: "",
    capacity: "",
    image: "",
  });

  useEffect(() => {
    if (!userId || userRole !== "organizer") {
      navigate("/login");
      return;
    }

    const fetchEvent = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/events/${id}`);

        if (String(response.data.organizerId) !== String(userId)) {
          navigate("/my-events");
          return;
        }

        setFormData({
          eventName: response.data.eventName || "",
          venue: response.data.venue || "",
          description: response.data.description || "",
          category: response.data.category || "",
          date: response.data.date || "",
          price: response.data.price || "",
          capacity: response.data.capacity || "",
          image: response.data.image || "",
        });
      } catch (error) {
        console.log(error);
      }
    };

    fetchEvent();
  }, [id, navigate, userId, userRole]);

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

  const handleDelete = async () => {
    const confirmDelete = window.confirm(t("confirmDeleteEvent"));

    if (!confirmDelete) return;

    try {
      await axios.delete(`${API_URL}/api/events/${id}?organizerId=${userId}`);
      alert(t("eventDeletedSuccessfully"));
      navigate("/my-events");
    } catch (error) {
      alert(error.response?.data?.message || t("deleteFailed"));
    }
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
      await axios.put(`${API_URL}/api/events/${id}?organizerId=${userId}`, {
        ...formData,
        price: Number(formData.price),
        capacity: Number(formData.capacity),
      });

      alert(t("eventUpdatedSuccessfully"));
      navigate("/my-events");
    } catch (error) {
      alert(error.response?.data?.message || t("updateFailed"));
    }
  };

  return (
    <div className="edit-event-page">
      <button type="button" onClick={() => navigate("/my-events")} className="back-btn">
        {t("backToMyEvents")}
      </button>

      <div className="edit-event-header">
        <div>
          <h1 className="edit-event-title">{t("editEvent")}</h1>
          <p className="edit-event-subtitle">{t("editEventSubtitle")}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="edit-event-card">
        <div className="edit-grid">
          <div>
            <label>{t("eventName")}</label>
            <input
              type="text"
              name="eventName"
              value={formData.eventName}
              onChange={handleChange}
              className="edit-input"
            />
          </div>

          <div>
            <label>{t("venue")}</label>
            <input
              type="text"
              name="venue"
              value={formData.venue}
              onChange={handleChange}
              className="edit-input"
            />
          </div>
        </div>

        <label>{t("description")}</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="4"
          className="edit-textarea"
        />

        <div className="edit-grid">
          <div>
            <label>{t("date")}</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="edit-input"
            />
          </div>

          <div>
            <label>{t("price")}</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="edit-input"
            />
          </div>
        </div>

        <div className="edit-grid">
          <div>
            <label>{t("capacity")}</label>
            <input
              type="number"
              name="capacity"
              value={formData.capacity}
              onChange={handleChange}
              className="edit-input"
            />
          </div>

          <div>
            <label>{t("category")}</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="edit-input"
            >
              {categoryOptions.map((category) => (
                <option key={category} value={category}>
                  {t(`category${category}`)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <h3 className="banner-title">{t("eventBannerPreview")}</h3>

        {formData.image && (
          <img src={formData.image} alt={t("preview")} className="edit-banner-preview" />
        )}

        <div className="banner-upload-container">
          <label htmlFor="bannerUpload" className="upload-banner-btn">
            {t("chooseNewBanner")}
          </label>

          <input
            id="bannerUpload"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden-file-input"
          />
        </div>

        <div className="edit-actions">
          <button type="submit" className="update-event-btn">
            {t("updateEvent")}
          </button>

          <button type="button" onClick={handleDelete} className="delete-event-btn">
            {t("deleteEvent")}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditEventPage;
