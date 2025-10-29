
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import OpenAI from "openai";


const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/ai", async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: "Missing prompt" });

    const response = await openai.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-5",
      input: prompt,
    });

    
    res.json({ output: response.output_text ?? response.output ?? response });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || String(err) });
  }
});

app.post("/search", async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) return res.status(400).json({ error: "Missing query" });

    const serpKey = process.env.SERPAPI_KEY;
    if (!serpKey) return res.status(500).json({ error: "SERPAPI_KEY not configured" });

    const url =
      "https://serpapi.com/search.json?q=" +
      encodeURIComponent(query) +
      "&api_key=" +
      encodeURIComponent(serpKey);

    const fetchFn = global.fetch ?? (await import("node-fetch")).default;
    const serpResp = await fetchFn(url);
    const data = await serpResp.json();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || String(err) });
  }
});

const PORT = parseInt(process.env.PORT, 10) || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
