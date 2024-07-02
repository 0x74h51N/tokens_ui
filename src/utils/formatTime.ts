const formatTime = (timestamp: string, showHour = true) => {
  const date = new Date(Number(timestamp) * 1000);
  const formattedDate = date.toLocaleDateString("eu-EU");
  if (showHour) {
    const formattedTime = date.toLocaleTimeString("eu-EU", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    return `${formattedDate} ${formattedTime}`;
  }
  return formattedDate;
};

export default formatTime;
