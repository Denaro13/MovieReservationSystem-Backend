export const calculateEndTime = (
  startTime: string,
  movieLength: number
): string => {
  // Create a Date object for today with the given start time (ignoring date parts)
  const [hours, minutes] = startTime.split(":").map(Number);
  const startDate = new Date();
  startDate.setHours(hours, minutes, 0, 0); // Set hours, minutes, seconds, milliseconds

  // Add movie length in minutes to the start date
  const endDate = new Date(startDate);
  endDate.setMinutes(startDate.getMinutes() + movieLength);

  // Format the end time as HH:mm
  const endHours = String(endDate.getHours()).padStart(2, "0");
  const endMinutes = String(endDate.getMinutes()).padStart(2, "0");

  return `${endHours}:${endMinutes}`;
};
