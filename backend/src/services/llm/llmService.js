const axios = require("axios");

const {
  OLLAMA_URL,
  MODEL,
  TEMPERATURE
} = require("../../config/aiConfig");

async function generateLLMResponse(prompt) {

  try {

    const response = await axios.post(
      OLLAMA_URL,
      {
        model: MODEL,
        prompt,
        stream: false,
        options: {
          temperature: TEMPERATURE
        }
      },
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

    return response.data.response;

  } catch (error) {

    console.error("LLM SERVICE ERROR:", error.message);

    throw new Error("LLM request failed");
  }
}

module.exports = {
  generateLLMResponse
};
