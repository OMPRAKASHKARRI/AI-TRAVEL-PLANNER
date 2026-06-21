const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const generateTravelPlan = async ({
  destination,
  durationDays,
  budgetTier,
  interests,
}) => {

  const prompt = `
Create a travel itinerary.

Destination: ${destination}
Duration: ${durationDays} days
Budget: ${budgetTier}
Interests: ${interests.join(", ")}

Return ONLY valid JSON.

Structure:

{
  "itinerary":[
    {
      "dayNumber":1,
      "activities":[
        {
          "title":"string",
          "description":"string",
          "estimatedCostUSD":10,
          "timeOfDay":"Morning"
        }
      ]
    }
  ],

  "hotels":[
    {
      "name":"string",
      "tier":"Budget",
      "estimatedCostNightUSD":50,
      "rating":"4.5"
    }
  ],

  "estimatedBudget":{
    "transport":100,
    "accommodation":200,
    "food":150,
    "activities":120,
    "total":570
  },

  "packingList":[
    {
      "item":"Passport",
      "category":"Documents",
      "isPacked":false
    }
  ]
}
`;

  const completion =
    await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",

      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],

      temperature: 0.7,
    });

  const content =
    completion.choices[0].message.content;
console.log(content);
console.log("Ai Response:")
const cleanContent = content
  .replace(/```json/g, "")
  .replace(/```/g, "")
  .trim();

return JSON.parse(cleanContent);};

module.exports = {
  generateTravelPlan,
};
// regenearte day plan
const regenerateDayPlan = async ({
  destination,
  budgetTier,
  interests,
  dayNumber,
  instruction,
}) => {

  const prompt = `
Destination: ${destination}
Budget: ${budgetTier}
Interests: ${interests.join(", ")}

Generate ONLY Day ${dayNumber} itinerary.

Special instruction:
${instruction}

Return ONLY valid JSON:

{
  "dayNumber": ${dayNumber},
  "activities": [
    {
      "title":"string",
      "description":"string",
      "estimatedCostUSD":10,
      "timeOfDay":"Morning"
    }
  ]
}
`;

  const completion =
    await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

  const content =
    completion.choices[0].message.content;

  const cleanContent = content
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  return JSON.parse(cleanContent);
};

module.exports = {
  generateTravelPlan,
  regenerateDayPlan,
};