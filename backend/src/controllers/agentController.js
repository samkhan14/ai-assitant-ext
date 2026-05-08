const {
  generateLLMResponse
} = require("../services/llm/llmService");

const {
  buildAgentPrompt
} = require("../services/prompts/agentPrompt");

const {
  formatAgentResponse
} = require("../services/response/responseFormatter");

async function handleAgentRequest(req, res) {
  try {

    const {
      task,
      currentFile,
      selectedCode,
      relatedFiles = [],
      context = {}
    } = req.body;

    if (!task) {
      return res.status(400).json({
        success: false,
        error: "Task is required"
      });
    }

    /**
     * BUILD PROMPT
     */
    const prompt = buildAgentPrompt({
      task,
      currentFile,
      selectedCode,
      relatedFiles,
      context
    });

    /**
     * CALL LLM
     */
    const llmResponse = await generateLLMResponse(prompt);

    /**
     * FORMAT RESPONSE
     */
    const formatted = formatAgentResponse(llmResponse);

    return res.json({
      success: true,
      data: formatted
    });

  } catch (error) {

    console.error("AGENT CONTROLLER ERROR:", error);

    return res.status(500).json({
      success: false,
      error: "Failed to process agent request"
    });
  }
}

module.exports = {
  handleAgentRequest
};
