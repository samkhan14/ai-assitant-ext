function formatChatResponse(response) {

  return {
    type: "chat",
    message: response
  };
}

function formatAgentResponse(response) {

  try {

    const parsed = JSON.parse(response);

    return {
      type: "agent",
      message: parsed.message || "",
      changes: parsed.changes || []
    };

  } catch (error) {

    return {
      type: "agent",
      message: "Failed to parse agent response",
      changes: [],
      raw: response
    };
  }
}

module.exports = {
  formatChatResponse,
  formatAgentResponse
};
