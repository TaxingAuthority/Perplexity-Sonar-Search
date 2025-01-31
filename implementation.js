function search_via_perplexity_sonar(params, userSettings) {
  const keyword = params.keyword;
  const model = userSettings.model || 'sonar';
  const systemMessage = userSettings.systemMessage || 'Be precise and concise.';
  const key = userSettings.apiKey;
 
  if (!key) {
    throw new Error(
      'Please set the Perplexity API Key in the plugin settings.'
    );
  }
 
  return fetch('https://api.perplexity.ai/chat/completions', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      accept: 'application/json',
      authorization: 'Bearer ' + key,
    },
    body: JSON.stringify({
      model: model,
      messages: [
        {
          role: 'system',
          content: systemMessage,
        },
        {
          role: 'user',
          content: keyword,
        },
      ],
    }),
  })
    .then((r) => r.json())
    .then((response) => {
      const content = response.choices.map((c) => c.message.content).join(' ');
      const citations = response.citations;
 
      const citationsText = citations
        ? '\\n\\n Citations:\\n' + citations.map((c, index) => `[${index + 1}] ${c}`).join('\\n')
        : '';

      return (
        content +
        citationsText +
        '\\n\\nIMPORTANT: When using this information in your response, you must include the citations provided above. Place citation numbers [X] immediately after the information they support and include the complete Citations section at the end of your response.'
      );
    });
}
