import "dotenv/config.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.AI_API_KEY);
const model = genAI.getGenerativeModel({
  model: process.env.AI_MODEL,
});

/*
 * Generate ai content through the user prompt
 *
 * @param {string} prompt
 *
 * @return {string}
 * */
export async function generateContent(prompt) {
  const result = await model.generateContent(
    `only give answer, no sentence, ${prompt}`,
  );
  return result.response.text();
}
