const axios = require('axios');


const checkRateLimit = async (token) => {
  const headers = {
    Authorization: `token ${token}`,
    Accept: 'application/vnd.github.v3+json'
  };

  try {
    const rateLimitResponse = await axios.get('https://api.github.com/rate_limit', { headers });
    const rateLimit = rateLimitResponse.data.rate;

    const remainingRequests = rateLimit.remaining;
    const resetTime = new Date(rateLimit.reset * 1000); // Converte o timestamp do reset para uma data
    const limitRequests = rateLimit.limit
    const currentTime = new Date();
    const timeUntilReset = Math.ceil((resetTime.getTime() - currentTime.getTime()) / (1000 * 60)); // Calcula o tempo até o reset em minutos
    console.log(`Número de consultas disponíveis na API do GIT: ${remainingRequests}/${limitRequests}`);
    console.log(`Limite de requisições resetará em: ${timeUntilReset} minutos`);
  } catch (error) {
    console.error('Limite de consultar a api do GITHUB excedido:', error.message);
    throw error;
  }
};

module.exports = { checkRateLimit };