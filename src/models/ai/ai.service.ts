import { prisma } from "../../lib/prisma";
import config from "../../config";

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

interface GenerateListingInput {
  prompt?: string;
  title?: string;
  location?: string;
  price?: number;
  categoryName?: string;
}

// Call Groq AI API with automatic fallback
async function callGroqAI(
  messages: ChatMessage[],
  preferredModel: string = "openai/gpt-oss-120b"
): Promise<string> {
  const apiKey = config.groq_api_key;
  if (!apiKey) {
    throw new Error("GROQ_API_KEY is not configured in environment variables.");
  }

  try {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: preferredModel,
        messages,
        temperature: 0.7,
        max_tokens: 1200,
      }),
    });

    if (!res.ok) {
      // If 120b fails or throttles, fallback to 20b
      if (preferredModel !== "openai/gpt-oss-20b") {
        return callGroqAI(messages, "openai/gpt-oss-20b");
      }
      const err = await res.text();
      throw new Error(`Groq API error (${res.status}): ${err}`);
    }

    const data = await res.json();
    return data?.choices?.[0]?.message?.content || "";
  } catch (error: any) {
    if (preferredModel !== "openai/gpt-oss-20b") {
      return callGroqAI(messages, "openai/gpt-oss-20b");
    }
    throw error;
  }
}

// 1. AI Chatbot Assistant (NestBot)
const chatAssistant = async (
  message: string,
  history: Array<{ role: "user" | "assistant"; content: string }> = []
) => {
  // Retrieve available properties from DB for live grounding
  const properties = await prisma.property.findMany({
    take: 8,
    orderBy: { createdAt: "desc" },
    include: {
      category: { select: { name: true } },
    },
  });

  const propertyContext = properties
    .map(
      (p) =>
        `- ID: "${p.id}", Title: "${p.title}", Price: ৳${Number(
          p.price
        ).toLocaleString()}/month, Location: "${p.location}", Category: "${
          p.category?.name || "Apartment"
        }", Snippet: "${p.description.slice(0, 100)}..."`
    )
    .join("\n");

  const systemPrompt = `You are "NestBot", the intelligent AI Concierge for RentNest (rentnest.com), Bangladesh's premier luxury & modern home rental platform.
You are warm, knowledgeable, professional, and genuinely helpful.
You can communicate naturally in English, Bengali (বাংলা), or Banglish depending on how the user writes.

Here are the actual live properties available right now on RentNest:
${propertyContext}

Your capabilities & rules:
1. When a user asks for property recommendations, budget options, or locations (e.g. Gulshan, Banani, Dhanmondi, Uttara, Bashundhara, Mirpur), suggest matching homes from the live list above.
2. For each recommendation, provide:
   - The property title
   - Price in BDT (৳)
   - Location
   - A clickable markdown link formatted strictly as: [View Property Details](/properties/PROPERTY_ID)
3. If the user asks about rental policies, security deposits, lease terms in Bangladesh, or RentNest features (like verified landlords, direct booking, secure payments), answer clearly and reassuringly.
4. If a landlord asks how to list their home, explain the simple steps to register as Landlord and click "Add Property".
5. Keep your tone polite, concise, structured with bullet points where appropriate, and avoid overwhelming text walls.`;

  const messages: ChatMessage[] = [
    { role: "system", content: systemPrompt },
    ...history.slice(-6).map((h) => ({
      role: h.role as "user" | "assistant",
      content: h.content,
    })),
    { role: "user", content: message },
  ];

  const reply = await callGroqAI(messages);
  return { reply };
};

// 2. AI Property Listing & Description Generator (Smart Form Auto-fill for Landlords)
const generateListing = async (input: GenerateListingInput) => {
  const systemPrompt = `You are an elite real estate copywriter and listing optimizer for RentNest, a premium property rental platform.
Your task is to take brief keywords, rough landlord notes, or partial property information, and generate a polished, compelling, high-converting property listing.

Rules:
- Generate a captivating, elegant title (under 10 words).
- Generate a descriptive, beautifully written description (2-3 paragraphs) highlighting lifestyle, comfort, space, natural lighting, and security.
- Suggest 4-6 realistic feature highlights/bullet points (e.g., "24/7 Security & CCTV", "Standby Generator Support", "Dedicated Car Parking", "Elevator Access").
- If price is missing or 0, suggest a realistic monthly rent in BDT (Bangladeshi Taka) suitable for the location and category.
- Output MUST be valid JSON only, without any markdown code fences or backticks, with the following structure:
{
  "title": "string",
  "description": "string",
  "highlights": ["string", "string", "string", "string"],
  "suggestedPrice": number
}`;

  const userContent = `Landlord notes & draft info:
- Quick keywords/notes: ${input.prompt || "Modern rental property"}
- Draft title: ${input.title || "Not specified"}
- Location: ${input.location || "Dhaka, Bangladesh"}
- Category: ${input.categoryName || "Apartment"}
- Provided Price: ${input.price ? `৳${input.price}` : "Not specified"}`;

  const messages: ChatMessage[] = [
    { role: "system", content: systemPrompt },
    { role: "user", content: userContent },
  ];

  const raw = await callGroqAI(messages, "openai/gpt-oss-120b");

  // Clean JSON response (strip markdown fences if model added them)
  let cleanJson = raw.trim();
  if (cleanJson.startsWith("```json")) {
    cleanJson = cleanJson.replace(/^```json\s*/, "").replace(/\s*```$/, "");
  } else if (cleanJson.startsWith("```")) {
    cleanJson = cleanJson.replace(/^```\s*/, "").replace(/\s*```$/, "");
  }

  try {
    const parsed = JSON.parse(cleanJson);
    return parsed;
  } catch (err) {
    // Fallback if model returned formatted prose instead of pure JSON
    return {
      title: input.title || "Modern Luxurious Living Space",
      description: raw,
      highlights: [
        "Prime Location & Secure Neighborhood",
        "Spacious Natural Lighting",
        "Modern Fittings & Amenities",
        "Dedicated Maintenance Support",
      ],
      suggestedPrice: input.price || 35000,
    };
  }
};

// 3. AI Smart Search & Matching
const smartSearch = async (query: string) => {
  const properties = await prisma.property.findMany({
    take: 20,
    include: {
      category: { select: { name: true } },
    },
  });

  const propertyContext = properties
    .map(
      (p) =>
        `- ID: "${p.id}", Title: "${p.title}", Price: ৳${Number(
          p.price
        )}, Location: "${p.location}", Category: "${
          p.category?.name || "Apartment"
        }"`
    )
    .join("\n");

  const systemPrompt = `You are a real estate search matcher. Given a user's natural language search query, match up to 5 best properties from the available list.
Properties available:
${propertyContext}

Return JSON ONLY (no markdown fences):
{
  "matchedIds": ["id1", "id2"],
  "summary": "Brief 1-2 sentence explanation of why these match"
}`;

  const messages: ChatMessage[] = [
    { role: "system", content: systemPrompt },
    { role: "user", content: `User query: "${query}"` },
  ];

  const raw = await callGroqAI(messages, "openai/gpt-oss-20b");
  let cleanJson = raw.trim();
  if (cleanJson.startsWith("```json")) {
    cleanJson = cleanJson.replace(/^```json\s*/, "").replace(/\s*```$/, "");
  } else if (cleanJson.startsWith("```")) {
    cleanJson = cleanJson.replace(/^```\s*/, "").replace(/\s*```$/, "");
  }

  try {
    const parsed = JSON.parse(cleanJson);
    const matchedProperties = properties.filter((p) =>
      parsed.matchedIds?.includes(p.id)
    );
    return {
      matches: matchedProperties,
      summary: parsed.summary,
    };
  } catch (e) {
    return {
      matches: properties.slice(0, 4),
      summary: "Here are top available properties matching your interest.",
    };
  }
};

export const aiService = {
  chatAssistant,
  generateListing,
  smartSearch,
};
