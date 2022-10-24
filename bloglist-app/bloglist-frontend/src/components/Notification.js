const Notification = ({ notification }) => {
  if (notification === null) return null;

  return <div className={notification.status}>{notification.message}</div>;
};

export default Notification;
