import "dotenv/config.js";
import { createResponse, createTxtAnswer, startUdpServer } from "denamed";
import { generateContent } from "./ai/generate.js";
import { db } from "./db/db.js";

startUdpServer(
  async (query) => {
    const question = query.questions[0];

    if (question.type !== "TXT") {
      return createResponse(query, [
        createTxtAnswer(question, "Type must be TXT"),
      ]);
    }

    if (question.name.startsWith("ai:")) {
      const createPrompt = question.name.split(".").join(" ");
      const result = await generateContent(createPrompt);
      return createResponse(query, [createTxtAnswer(question, result)]);
    }

    if (!db[question.name]) {
      return createResponse(query, [
        createTxtAnswer(question, "Please re-check your domain!"),
      ]);
    }

    return createResponse(query, [
      createTxtAnswer(question, db[question.name].data),
    ]);
  },
  { port: process.env.PORT || 5300 },
);
