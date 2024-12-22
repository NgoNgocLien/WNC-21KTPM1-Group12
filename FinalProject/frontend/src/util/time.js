import { format } from "date-fns";

export const formatTime = (time) => {
  const date = new Date(time);
  return format(date, "dd/MM/yyyy - HH:mm");
}