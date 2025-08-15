import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: "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",
});

const response = openai.responses.create({
  model: "gpt-5",
  input: "write a haiku about ai",
  store: true,
});

response.then((result) => console.log(result.output_text));
