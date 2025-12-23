export const config = {
  port: process.env.PORT || 3000,
  openRouterApiKey: process.env.OPENROUTER_API_KEY || '',
  openRouterModel: process.env.OPENROUTER_MODEL || 'mistralai/mistral-7b-instruct',
};
