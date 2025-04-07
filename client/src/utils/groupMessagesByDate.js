import formatDateTime from './formatDateTime';

export default function groupMessagesByDate(messages) {
  const grouped = {};

  messages.forEach((msg) => {
    const dateKey = new Date(msg.createdAt).toDateString();
    if (!grouped[dateKey]) {
      grouped[dateKey] = [];
    }
    grouped[dateKey].push(msg);
  });

  return grouped;
}
