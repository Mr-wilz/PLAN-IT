const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;

const extractJson = (content: string) => {
  const trimmedContent = content.trim();

  const fencedMatch = trimmedContent.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  const jsonText = fencedMatch ? fencedMatch[1] : trimmedContent;

  const firstBrace = jsonText.indexOf("{");
  const lastBrace = jsonText.lastIndexOf("}");

  if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
    throw new Error("AI did not return valid JSON.");
  }

  return JSON.parse(jsonText.slice(firstBrace, lastBrace + 1));
};

type Attraction = {
  name: string;
  description: string;
  category: string;
  image_prompt: string;
};

const normalizeAttractions = (
  value: unknown,
  destination: string,
): Attraction[] => {
  const fallbackAttractions: Attraction[] = [
    {
      name: `${destination} Old Town`,
      description: `A historic core in ${destination} with walkable streets, local food, and classic architecture.`,
      category: "historic district",
      image_prompt: `${destination} historic old town travel landmark`,
    },
    {
      name: `${destination} Central Square`,
      description: `A lively public square that captures the pace, culture, and daily life of ${destination}.`,
      category: "city center",
      image_prompt: `${destination} central square travel landmark`,
    },
  ];

  if (!Array.isArray(value)) {
    return fallbackAttractions;
  }

  const attractions = value
    .map((item, index) => {
      const name =
        typeof item?.name === "string" && item.name.trim()
          ? item.name.trim()
          : `${destination} Attraction ${index + 1}`;
      const description =
        typeof item?.description === "string" && item.description.trim()
          ? item.description.trim()
          : `A notable place to visit in ${destination}.`;
      const category =
        typeof item?.category === "string" && item.category.trim()
          ? item.category.trim()
          : "attraction";
      const imagePrompt =
        typeof item?.image_prompt === "string" && item.image_prompt.trim()
          ? item.image_prompt.trim()
          : `${name} ${destination} travel landmark`;

      return {
        name,
        description,
        category,
        image_prompt: imagePrompt,
      };
    })
    .slice(0, 8);

  return attractions.length > 0 ? attractions : fallbackAttractions;
};

const normalizeHotelSuggestions = (
  value: unknown,
  destination: string,
  budget: string,
) => {
  if (!Array.isArray(value)) {
    return [
      {
        name: `${destination} Central Stay`,
        type: budget === "luxury" ? "Hotel" : "Lodge",
        priceRange:
          budget === "budget"
            ? "Budget-friendly"
            : budget === "luxury"
              ? "Premium"
              : "Mid-range",
        reason: `A ${budget}-friendly option near key attractions in ${destination}.`,
      },
      {
        name: `${destination} Boutique Inn`,
        type: budget === "luxury" ? "Resort" : "Hotel",
        priceRange:
          budget === "budget"
            ? "Budget-friendly"
            : budget === "luxury"
              ? "Premium"
              : "Mid-range",
        reason: `A comfortable stay aligned with your ${budget} budget and travel style.`,
      },
    ];
  }

  const hotels = value
    .map((hotel) => ({
      name:
        typeof hotel?.name === "string" ? hotel.name : `${destination} Stay`,
      type:
        typeof hotel?.type === "string"
          ? hotel.type
          : budget === "luxury"
            ? "Hotel"
            : "Lodge",
      priceRange:
        typeof hotel?.priceRange === "string"
          ? hotel.priceRange
          : budget === "budget"
            ? "Budget-friendly"
            : budget === "luxury"
              ? "Premium"
              : "Mid-range",
      reason:
        typeof hotel?.reason === "string"
          ? hotel.reason
          : `Suggested because it matches your ${budget} budget.`,
    }))
    .slice(0, 3);

  while (hotels.length < 2) {
    hotels.push({
      name: `${destination} Stay ${hotels.length + 1}`,
      type: budget === "luxury" ? "Hotel" : "Lodge",
      priceRange:
        budget === "budget"
          ? "Budget-friendly"
          : budget === "luxury"
            ? "Premium"
            : "Mid-range",
      reason: `A backup option that still fits your ${budget} travel budget.`,
    });
  }

  return hotels;
};

export const generateItinerary = async (params: {
  destination: string;
  budget: string;
  duration: number;
  interests: string[];
}) => {
  if (!OPENROUTER_API_KEY) {
    throw new Error("Missing OpenRouter API key.");
  }

  const prompt = `
You are an expert travel planner. Create a detailed day-by-day itinerary for a trip to ${params.destination}.
Recommend suitable hotels or lodges, sport activities, recreational venues, meals, and tips for each day based on the following traveler profile:
Destination: ${params.destination}.
Budget: ${params.budget}
Duration: ${params.duration} days
Interests: ${params.interests.join(", ")}
  Return ONLY valid JSON with this exact structure:
{
  "title": "string",
  "summary": "string",
  "hotels": [
    { "name": "string", "type": "string", "priceRange": "string", "reason": "string" }
  ],
  "days": [
    { "day": number, "title": "string", "activities": ["string"], "meals": ["string"], "tips": "string" }
  ]
}
`;

  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENROUTER_API_KEY}`,
      "HTTP-Referer": window.location.origin,
      "X-Title": "Plan-It",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "openai/gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      response_format: { type: "json_object" },
    }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`OpenRouter request failed (${res.status}): ${errorText}`);
  }

  const data = await res.json();
  const content = data?.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error("AI response did not contain itinerary content.");
  }

  const parsed = extractJson(content);

  return {
    title:
      typeof parsed.title === "string"
        ? parsed.title
        : `Trip to ${params.destination}`,
    summary: typeof parsed.summary === "string" ? parsed.summary : "",
    hotels: normalizeHotelSuggestions(
      parsed.hotels,
      params.destination,
      params.budget,
    ),
    days: Array.isArray(parsed.days) ? parsed.days : [],
  };
};

// services/ai.ts

export const generateBlogPost = async (topic: string) => {
  const prompt = `
You are a professional travel blogger for Plan-It.
Write a beautiful, engaging 800–1200 word blog post about: "${topic}".
Style: Warm, inspiring, practical, with a premium tone.
Structure:
- Catchy title
- Short intro (2-3 sentences)
- 4-6 clear sections with subheadings
- Practical tips
- End with a call-to-action to use Plan-It
Return ONLY valid JSON:
{
  "title": "string",
  "excerpt": "string",
  "category": "string",
  "content": "full markdown content here",
  "image_prompt": "short description for unsplash/unsplash image"
}
`;

  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
      "HTTP-Referer": window.location.origin,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "meta-llama/llama-3.3-70b-instruct:free",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.8,
    }),
  });

  const data = await res.json();
  return JSON.parse(data.choices[0].message.content);
};

// services/ai.ts

export const generateDestinationFacts = async (destination: string) => {
  if (!OPENROUTER_API_KEY) {
    throw new Error("Missing OpenRouter API key.");
  }

  const prompt = `
You are a travel expert. Provide 8 interesting, lesser-known facts about traveling to ${destination} in 2026.

Return ONLY valid JSON in this exact format:

{
  "iconicImageQuery": "eiffel tower paris" or "statue of liberty new york" or "sydney opera house",
  "facts": [
    {"fact": "Short interesting fact", "category": "culture"}
  ]
}`;

  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENROUTER_API_KEY}`,
      "HTTP-Referer": window.location.origin,
      "X-Title": "Plan-It",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "openai/gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      response_format: { type: "json_object" },
    }),
  });

  if (!res.ok) throw new Error(`API Error: ${res.status}`);

  const data = await res.json();
  const content = data?.choices?.[0]?.message?.content;
  if (!content) throw new Error("No content from AI");

  const parsed = extractJson(content);

  const factsArray =
    parsed.facts && Array.isArray(parsed.facts) ? parsed.facts : [];
  return {
    iconicImageQuery: parsed.iconicImageQuery || destination,
    facts: factsArray,
  };
};

export const generateDestinationAttractions = async (destination: string) => {
  if (!OPENROUTER_API_KEY) {
    throw new Error("Missing OpenRouter API key.");
  }

  const prompt = `
You are a travel guide curating the most visited attractions for ${destination}.
Return ONLY valid JSON in this exact format:

{
  "destination": "${destination}",
  "summary": "string",
  "attractions": [
    {
      "name": "string",
      "description": "string",
      "category": "string",
      "image_prompt": "short visual prompt for fetching/generating an image of this destination"
    }
  ]
}

Rules:
- Return up to 8 attractions.
- Focus on the most visited tourist attraction centers, landmarks, and must-see areas.
- Use concise but vivid descriptions.
- Make the image prompts specific enough to generate or fetch a matching image.
`;

  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENROUTER_API_KEY}`,
      "HTTP-Referer": window.location.origin,
      "X-Title": "Plan-It",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "openai/gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      response_format: { type: "json_object" },
    }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`OpenRouter request failed (${res.status}): ${errorText}`);
  }

  const data = await res.json();
  const content = data?.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error("AI response did not contain attraction content.");
  }

  const parsed = extractJson(content);

  return {
    destination:
      typeof parsed.destination === "string" && parsed.destination.trim()
        ? parsed.destination.trim()
        : destination,
    summary:
      typeof parsed.summary === "string" && parsed.summary.trim()
        ? parsed.summary.trim()
        : `Top attractions and visitor highlights in ${destination}.`,
    attractions: normalizeAttractions(parsed.attractions, destination),
  };
};
