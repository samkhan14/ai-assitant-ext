const { generateLLMResponse } = require("../services/llm/llmService");

const { buildAskPrompt } = require("../services/prompts/askPrompt");

const {
  formatChatResponse,
} = require("../services/response/responseFormatter");

async function handleChatRequest(req, res) {
  try {
    const { message, context = {} } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        error: "Message is required",
      });
    }

    /**
     * BUILD PROMPT
     */
    const prompt = buildAskPrompt({
      message,
      context,
    });

    /**
     * LLM RESPONSE
     */
    const llmResponse = await generateLLMResponse(prompt);

    /**
     * FORMAT RESPONSE
     */
    const formatted = formatChatResponse(llmResponse);

    return res.json({
      success: true,
      data: formatted,
    });
  } catch (error) {
    console.error("CHAT CONTROLLER ERROR:", error);

    return res.status(500).json({
      success: false,
      error: "Failed to process chat request",
    });
  }
}

module.exports = {
  handleChatRequest,
};
