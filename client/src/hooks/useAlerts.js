import {useState} from "react";
import {v4 as uuidv4} from "uuid";

export const useAlerts = () => {

  const [alerts, setAlerts] = useState([])

  const setAlert = (msg, alertType, timeout = 5000) => {
    const id = uuidv4();
    setAlerts([...alerts, {msg, alertType, id}])

    setTimeout(() => removeAlert(id), timeout);
  };

  function removeAlert(id) {
    setAlerts(alerts => alerts.filter((alert) => alert.id !== id));
  }

  return { alerts, setAlert }
}
