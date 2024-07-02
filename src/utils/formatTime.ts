import React from "react";

const formatTime = (timestamp: string, showHour = true) => {
  const date = new Date(Number(timestamp) * 1000);
  const formattedDate = date.toLocaleDateString("eu-EU", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });
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
