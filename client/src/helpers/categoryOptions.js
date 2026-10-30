export const normalizeCategory = (category) =>
  String(category || "").trim().toLowerCase();

export const formatCategory = (category) => {
  const normalized = normalizeCategory(category);

  return normalized
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export const getUniqueCategories = (events) => {
  const categories = new Map();

  events.forEach((event) => {
    const normalized = normalizeCategory(event.category);

    if (normalized && !categories.has(normalized)) {
      categories.set(normalized, formatCategory(event.category));
    }
  });

  return [
    { value: "All", label: "All" },
    ...Array.from(categories, ([value, label]) => ({ value, label })),
  ];
};
