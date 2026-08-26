const lienChi = require('../backend/data/lien-chi.json');

module.exports = function lienChiHandler(request, response) {
  if (request.method !== 'GET') {
    response.setHeader('Allow', 'GET');
    response.statusCode = 405;
    return response.end(JSON.stringify({ error: 'Chỉ hỗ trợ GET.' }));
  }

  const payload = [...lienChi].sort((left, right) => left.sortOrder - right.sortOrder);

  response.setHeader('Content-Type', 'application/json; charset=utf-8');
  response.setHeader('Cache-Control', 'no-store');
  response.statusCode = 200;
  return response.end(JSON.stringify(payload));
};
