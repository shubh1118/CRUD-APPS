import { NextApiRequest, NextApiResponse } from "next";
import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";
import fetch from "node-fetch";

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

if (!GOOGLE_API_KEY) {
  console.error(
    "Missing GOOGLE_API_KEY environment variable. Please get one from aistudio.google.com/app/apikey"
  );
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { imageUrl, title, artist_name, description } = req.body;

  if (!imageUrl) {
    return res
      .status(400)
      .json({ message: "Image URL is required for AI review generation." });
  }

  try {
    const genAI = new GoogleGenerativeAI(GOOGLE_API_KEY as string);

  const generativeModel = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    let imageBase64: string | undefined;
    let mimeType = "image/jpeg";

    try {
      const imageResponse = await fetch(imageUrl);
      if (!imageResponse.ok) {
        throw new Error(
          `Failed to fetch image from URL: ${imageUrl}, status: ${imageResponse.status}`
        );
      }
      const arrayBuffer = await imageResponse.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      imageBase64 = buffer.toString("base64");
      mimeType = imageResponse.headers.get("content-type") || "image/jpeg";
    } catch (fetchError: any) {
      console.warn(
        `Warning: Could not fetch or convert image from URL: ${imageUrl}. Error: ${fetchError.message}. AI review will be generated based on text description only.`
      );
      imageBase64 = undefined;
    }

    const textPart = {
      text: `Analyze the following artwork.
      Title: ${title || "N/A"}
      Artist: ${artist_name || "N/A"}
      Description: ${description || "N/A"}

      Based on the image and the provided information, provide a concise but insightful review (around 100-150 words) focusing on its visual aspects, style, potential message, and overall impact. Avoid generic phrases.`,
    };

    const parts: any[] = [textPart];

    if (imageBase64) {
      parts.unshift({
        inlineData: {
          mimeType: mimeType,
          data: imageBase64,
        },
      });
    }

    const request = {
      contents: [
        {
          role: "user",
          parts: parts,
        },
      ],
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
      ],
    };

    console.log("Sending request to Gemini 1.5 Flash...");
    const resp = await generativeModel.generateContent(request);
    const responseText =
      resp.response.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!responseText) {
      throw new Error("No review text received from Gemini 1.5 Flash.");
    }

    return res.status(200).json({ review: responseText });
  } catch (error: any) {
    console.error("Error generating AI review:", error);
    if (error.status === 429) {
      return res
        .status(500)
        .json({
          message:
            "AI review generation failed: Too many requests. Please try again later (rate limit).",
        });
    }
    if (error.status === 403) {
      return res
        .status(500)
        .json({
          message:
            "AI review generation failed: Permission denied. Ensure your API key is valid and not tied to a project requiring billing.",
        });
    }
    return res.status(500).json({
      message: "Internal server error while generating AI review.",
      error: error.message || "Unknown error",
    });
  }
}
