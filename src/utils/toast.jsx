import { toast } from "react-toastify";
import { ModernToast } from "../components/ModernToast";

export const showCustomToast = (type, title, message) => {
  toast(
    ({ closeToast }) => (
      <ModernToast type={type} title={title} message={message} closeToast={closeToast} />
    ),
    { icon: false }
  );
};
