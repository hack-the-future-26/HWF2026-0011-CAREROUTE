const twilio = require('twilio');

let client = null;
if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
  client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
}

const sendWhatsAppReply = async (to, incidentData) => {
  if (!client) {
    console.warn("Twilio client not initialized. Would have sent:", { to, incidentData });
    return;
  }

  const messageBody = `🚨 *CitizenShield Report Acknowledged* 🚨\n\n` +
    `*Type:* ${incidentData.crimeType}\n` +
    `*Location:* ${incidentData.location}\n` +
    `*Severity:* ${incidentData.severity}\n\n` +
    `The authorities have been notified and are reviewing your report. Stay safe.`;

  try {
    await client.messages.create({
      body: messageBody,
      from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
      to: to
    });
    console.log(`WhatsApp reply sent to ${to}`);
  } catch (error) {
    if (error.status === 429) {
      console.error('CRITICAL: Twilio rate limit exceeded ("System busy, try again"). Please check your Twilio plan and limits.');
    } else {
      console.error('Error sending WhatsApp reply:', error);
    }
  }
};

module.exports = {
  sendWhatsAppReply
};
