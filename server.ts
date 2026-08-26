import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "50mb" }));

// Initialize GoogleGenAI client securely on the server
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// API health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// 1. Analyze product and generate ad strategy & prompts
app.post("/api/analyze-product", async (req, res) => {
  try {
    const { url, description, brandName } = req.body;

    if (!url && !description) {
      return res.status(400).json({ error: "Please provide either a URL or a product description." });
    }

    const promptText = `
Analyze the following product information and generate a complete banner ad marketing kit in JSON format.
Product URL: ${url || "N/A"}
Product Description: ${description || "N/A"}
Brand Name: ${brandName || "Auto-detect"}

Return valid JSON with the following structure:
{
  "brandName": "Brand or Product Name",
  "productTitle": "Catchy Product Title",
  "category": "Industry category",
  "targetAudience": "Target audience description",
  "headlines": ["Headline 1 (Short & punchy)", "Headline 2", "Headline 3"],
  "subheadings": ["Subheading 1", "Subheading 2"],
  "callToActions": ["Shop Now", "Learn More", "Claim Offer", "Discover"],
  "badges": ["Best Seller", "Limited Time", "New Release", "Eco-Friendly"],
  "colorPalette": {
    "primary": "#hexcode",
    "secondary": "#hexcode",
    "accent": "#hexcode",
    "background": "#hexcode",
    "text": "#hexcode"
  },
  "imagePrompt": "A highly detailed, professional commercial photography prompt for Gemini image generation representing this product, featuring lighting, studio setting, and aesthetic mood."
}
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: promptText,
      config: {
        responseMimeType: "application/json",
        systemInstruction: "You are an expert digital advertising copywriter and creative director. Output valid JSON only.",
      },
    });

    const text = response.text || "{}";
    const data = JSON.parse(text);
    res.json(data);
  } catch (error: any) {
    console.error("Error analyzing product:", error);
    res.status(500).json({ error: error.message || "Failed to analyze product." });
  }
});

// 2. Generate Banner Image using Gemini image models
app.post("/api/generate-banner-image", async (req, res) => {
  try {
    const { prompt, model, aspectRatio, imageSize } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Image prompt is required." });
    }

    // Map model name: accept gemini-3-pro-image-preview or gemini-3.1-flash-image-preview
    let selectedModel = model || "gemini-3.1-flash-image-preview";
    if (selectedModel === "gemini-3-pro-image-preview") {
      selectedModel = "gemini-3-pro-image";
    } else if (selectedModel === "gemini-3.1-flash-image-preview" || selectedModel === "gemini-3.1-flash-image") {
      selectedModel = "gemini-3.1-flash-image";
    } else {
      selectedModel = "gemini-3.1-flash-lite-image";
    }

    const validAspectRatio = aspectRatio || "1:1";
    const validImageSize = imageSize || "1K";

    const imageConfig: any = {
      aspectRatio: validAspectRatio,
    };

    if (selectedModel !== "gemini-3.1-flash-lite-image") {
      imageConfig.imageSize = validImageSize;
    }

    const response = await ai.models.generateContent({
      model: selectedModel,
      contents: {
        parts: [{ text: prompt }],
      },
      config: {
        imageConfig,
        tools: selectedModel !== "gemini-3.1-flash-lite-image" ? [{ googleSearch: { searchTypes: { webSearch: {} } } }] : undefined,
      },
    });

    let imageBase64 = "";
    let mimeType = "image/png";
    let textResponse = "";

    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          imageBase64 = part.inlineData.data;
          mimeType = part.inlineData.mimeType || "image/png";
        } else if (part.text) {
          textResponse += part.text;
        }
      }
    }

    if (!imageBase64) {
      return res.status(500).json({ error: "Model did not return an image. " + textResponse });
    }

    res.json({
      imageUrl: `data:${mimeType};base64,${imageBase64}`,
      text: textResponse,
    });
  } catch (error: any) {
    console.error("Error generating image:", error);
    res.status(500).json({ error: error.message || "Failed to generate image." });
  }
});

// 3. Generate alternative ad copy
app.post("/api/generate-copy", async (req, res) => {
  try {
    const { productTitle, description, tone } = req.body;

    const prompt = `
Generate ad copy variations for this product:
Product: ${productTitle}
Description: ${description}
Tone: ${tone || "Professional and persuasive"}

Return valid JSON:
{
  "headlines": ["Headline 1", "Headline 2", "Headline 3"],
  "subheadings": ["Subheading 1", "Subheading 2"],
  "callToActions": ["CTA 1", "CTA 2"]
}
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    res.json(JSON.parse(response.text || "{}"));
  } catch (error: any) {
    console.error("Error generating copy:", error);
    res.status(500).json({ error: error.message || "Failed to generate copy." });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, "dist");
    app.use(express.static(distPath));
    app.get("*all", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
