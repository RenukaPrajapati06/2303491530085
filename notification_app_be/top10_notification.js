const API_URL = "http://4.224.186.213/evolution-service/notifications";

const PRIORITY = {
  Placements: 3,
  Result: 2,
  Event: 1,
};

async function getTopNotifications(limit = 10) {
  const response = await fetch(API_URL);
  const notifications = await response.json();

  const unread = notifications.filter(
    (notification) => notification.isRead === false
  );

  unread.sort((a, b) => {
    const priorityDifference =
      (PRIORITY[b.notification_type] || 0) -
      (PRIORITY[a.notification_type] || 0);

    if (priorityDifference !== 0) {
      return priorityDifference;
    }

    return (
      new Date(b.createdAt).getTime() -
      new Date(a.createdAt).getTime()
    );
  });

  const topNotifications = unread.slice(0, limit);

  console.log(`Top ${limit} Notifications`);
  console.table(topNotifications);

  return topNotifications;
}

getTopNotifications(10);