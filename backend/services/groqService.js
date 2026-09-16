const Groq = require('groq-sdk');

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY, // This should be provided in .env
});

const classifyIncident = async (messageText) => {
  const prompt = `
You are an AI assistant for the Andhra Pradesh Police.
Analyze the following citizen report (which could be in English or Telugu).
Extract the following information and return ONLY a valid JSON object (no markdown, no extra text):
{
  "crimeType": "Short category of crime (e.g., Theft, Assault, Accident, Cybercrime, Domestic Violence, etc.)",
  "location": "The specific place, city, or town mentioned (e.g., Vijayawada, Vizag, Guntur). If none mentioned, return 'Unknown'",
  "severity": "Must be one of: 'Low', 'Medium', 'High', 'Critical'",
  "englishSummary": "A concise 1-2 sentence summary of the incident in English",
  "teluguSummary": "A concise 1-2 sentence summary of the incident in Telugu",
  "suggestedAction": "A brief recommended action for the police dispatcher"
}

Citizen Report: "${messageText}"
`;

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      model: 'openai/gpt-oss-20b', // or any other fast groq model
      temperature: 0.1,
    });

    const content = chatCompletion.choices[0]?.message?.content;

    // Attempt to parse JSON from the response
    // Sometimes LLMs wrap JSON in ```json ... ``` even when instructed not to
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    } else {
      throw new Error("Failed to parse JSON from Groq response");
    }
  } catch (error) {
    console.error('Error in Groq classification:', error);
    // Fallback response in case of error
    return {
      crimeType: "Unknown",
      location: "Unknown",
      severity: "Medium",
      englishSummary: "Could not process message details.",
      teluguSummary: "సందేశం వివరాలను ప్రాసెస్ చేయలేకపోయాము.",
      suggestedAction: "Review message manually."
    };
  }
};

module.exports = {
  classifyIncident
};
