const statusKeys = {
  Booked: "statusBooked",
  Cancelled: "statusCancelled",
  "Checked-In": "statusCheckedIn",
};

export const getStatusLabel = (t, status) =>
  statusKeys[status] ? t(statusKeys[status]) : status || t("notAvailable");
