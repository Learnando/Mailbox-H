import "../styles/NotificationBanner.css";

interface Props {
  message: string;
}

const NotificationBanner = ({ message }: Props) => {
  return <div className="notification-banner">{message}</div>;
};

export default NotificationBanner;
