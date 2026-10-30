import { useEffect, useState } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { API_URL } from "../config";
import EmptyState from "../components/ui/EmptyState";
import EventCard from "../components/dashboard/EventCard";
import { getUniqueCategories, normalizeCategory } from "../helpers/categoryOptions";

function HomePage() {
  const { t } = useTranslation();
  const [events, setEvents] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState("All");

  const fetchEvents = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/events`
      );

      setEvents(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    queueMicrotask(fetchEvents);
  }, []);

  const searchEvents = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/events/search?keyword=${keyword}`
      );

      setEvents(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const resetEvents = () => {
    setKeyword("");
    setSelectedCategory("All");
    fetchEvents();
  };

  const eventCategories = getUniqueCategories(events);

  const filteredEvents =
    selectedCategory === "All"
      ? events
      : events.filter(
          (event) => normalizeCategory(event.category) === selectedCategory
        );

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-bold mb-6 text-center">
        {t("appName")}
      </h1>

      <div className="flex gap-2 mb-6 justify-center">
        <input
          type="text"
          placeholder={t("searchEvents")}
          value={keyword}
          onChange={(event) =>
            setKeyword(event.target.value)
          }
          className="border p-2 rounded w-80"
        />

        <button
          onClick={searchEvents}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {t("search")}
        </button>

        <button
          onClick={resetEvents}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          {t("reset")}
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-3 justify-center items-center mb-8">
        <label className="font-bold">
          {t("filterByCategory")}
        </label>

        <select
          value={selectedCategory}
          onChange={(event) =>
            setSelectedCategory(event.target.value)
          }
          className="border p-2 rounded bg-white min-w-56"
        >
          {eventCategories.map((category) => (
            <option key={category.value} value={category.value}>
              {category.value === "All" ? t("allCategories") : category.label}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => (
            <EventCard key={event._id} event={event} t={t} />
          ))
        ) : (
          <div className="md:col-span-3">
            <EmptyState title={t("noEventsFound")} />
          </div>
        )}
      </div>
    </div>
  );
}

export default HomePage;
