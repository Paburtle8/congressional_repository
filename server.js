import express from "express";
import cors from "cors";
import OpenAI from "openai";
import fetch from "node-fetch";


const app = express();
app.use(cors()); 
app.use(express.json());

const openai = new OpenAI({
  apiKey: "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", // Keep this secret!
});

app.post("/ai", async (req, res) => {
  try {
    const { prompt } = req.body;

    const response = await openai.responses.create({
      model: "gpt-5",
      input: prompt,
      store: true,
    });

    res.json({ output: response.output_text });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => console.log("Server running on port 3000"));



app.post("/search", async (req, res) => {
  try {
    const { query } = req.body;

    const serpAns = await fetch(`https://serpapi.com/search.json?q=${encodeURIComponent(query)}&api_key=207e8884fd908b80ffaf530bcccecbcb0593fc649ab8bf86a29fb7ba60379911`);
    const data = await serpAns.json();

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});







