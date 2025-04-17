import twilio from 'twilio';
import { log } from '../vite';

// Create Twilio client instance with environment variables
const createTwilioClient = () => {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

  if (!accountSid || !authToken || !twilioPhoneNumber) {
    log('Missing Twilio credentials for WhatsApp notifications', 'whatsapp');
    return null;
  }

  try {
    return twilio(accountSid, authToken);
  } catch (error) {
    log(`Error creating Twilio client: ${error}`, 'whatsapp');
    return null;
  }
};

/**
 * Send a WhatsApp notification to a vendor
 * 
 * @param to Recipient's WhatsApp number with country code (e.g., +27XXXXXXXXX)
 * @param message Message content to send
 * @returns Promise resolving to success boolean
 */
export const sendWhatsAppNotification = async (to: string, message: string): Promise<boolean> => {
  const client = createTwilioClient();
  const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
  
  if (!client || !twilioPhoneNumber) {
    log('Cannot send WhatsApp notification: Twilio client not configured', 'whatsapp');
    return false;
  }

  try {
    // Format the 'to' number to ensure it has the correct WhatsApp format
    // Twilio requires WhatsApp numbers to be prefixed with "whatsapp:"
    const formattedTo = to.startsWith('whatsapp:') ? to : `whatsapp:${to}`;
    const formattedFrom = twilioPhoneNumber.startsWith('whatsapp:') ? 
      twilioPhoneNumber : `whatsapp:${twilioPhoneNumber}`;

    await client.messages.create({
      body: message,
      from: formattedFrom,
      to: formattedTo
    });

    log(`WhatsApp notification sent to ${to}`, 'whatsapp');
    return true;
  } catch (error) {
    log(`Error sending WhatsApp notification to ${to}: ${error}`, 'whatsapp');
    return false;
  }
};

/**
 * Send a WhatsApp notification to multiple vendors
 * 
 * @param numbers Array of recipient WhatsApp numbers with country code
 * @param message Message content to send
 * @returns Promise resolving to array of results (success/failure for each number)
 */
export const sendBulkWhatsAppNotifications = async (
  numbers: string[], 
  message: string
): Promise<{ number: string; success: boolean }[]> => {
  // Process notifications in parallel
  const results = await Promise.all(
    numbers.map(async (number) => {
      const success = await sendWhatsAppNotification(number, message);
      return { number, success };
    })
  );

  const successCount = results.filter(r => r.success).length;
  log(`Bulk WhatsApp notification sent to ${successCount}/${numbers.length} recipients`, 'whatsapp');
  
  return results;
};

/**
 * Notify vendors about a new event opportunity
 * 
 * @param vendorPhoneNumbers Array of vendor WhatsApp numbers
 * @param eventTitle Title of the posted event
 * @param eventDate Date of the event
 * @param eventLocation Location of the event
 * @param plannerName Name of the event planner
 * @param eventUrl URL to view event details and apply
 * @returns Promise resolving to notification results
 */
export const notifyVendorsAboutEvent = async (
  vendorPhoneNumbers: string[],
  eventTitle: string,
  eventDate: string,
  eventLocation: string,
  plannerName: string,
  eventUrl: string
): Promise<{ number: string; success: boolean }[]> => {
  const message = `
🎉 *New Event Opportunity on HowzEventz!*

*${eventTitle}*
📅 ${eventDate}
📍 ${eventLocation}
👤 Posted by: ${plannerName}

This event is seeking vendor applications. Tap the link below to view details and apply:
${eventUrl}

Reply "INFO" for more information.
`;

  return sendBulkWhatsAppNotifications(vendorPhoneNumbers, message);
};