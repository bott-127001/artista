export const generateWhatsAppLink = (phoneNumber, message) => {
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
};

export const formatBookingConfirmationMessage = (booking, branchWhatsappNumber, isCancellation = false) => {
  const dateObj = new Date(booking.date);
  const day = dateObj.getDate();
  const month = dateObj.toLocaleString('en-US', { month: 'short' });
  const year = dateObj.getFullYear();
  const formattedDate = `${day} ${month} ${year}`;

  let message = `Hi ${booking.name},\n\n`;
  
  // Use category - subService format if both are available, otherwise fallback to service - subService
  const serviceDisplay = booking.serviceCategory && booking.subService 
    ? `${booking.serviceCategory} - ${booking.subService}`
    : booking.subService 
      ? `${booking.service} - ${booking.subService}`
      : booking.serviceCategory || booking.service;

  if (isCancellation) {
    message += `We regret to inform you that your appointment for ${serviceDisplay}`;
    message += ` on ${formattedDate} at ${booking.branch} has been cancelled.\n\n`;
    message += `Please contact us if you'd like to reschedule.\n\n`;
    message += `We apologize for any inconvenience.`;
  } else {
    message += `Your appointment for ${serviceDisplay}`;
    message += ` on ${formattedDate} at ${booking.branch} is confirmed!\n\n`;
    if (booking.expert) {
      message += `Expert: ${booking.expert}\n`;
    }
    message += `\nWe look forward to seeing you!`;
  }

  return message;
};

