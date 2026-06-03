const jwt = require('jsonwebtoken');

function verifyAuthentication(req, res, next) {

  const authHeader = req.headers.authorization;
  const customHeader = req.headers['x-auth-token']; 

  let token = null;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1]; // Extrai a string após o espaço de "Bearer <TOKEN>"
  } else if (customHeader) {
    token = customHeader;
  }

  // Se nenhum token for enviado barra imediatamente a requisição
  if (!token) {
    return res.status(401).json({ error: "Acesso negado. Token não fornecido." });
  }

  try {
    // REGRA: Verificar se o token é válido usando a chave secreta
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = { id: decoded.id };

    return next(); 

  } catch (error) {
    // Se o token estiver expirado ou adulterado, invalida o acesso
    return res.status(401).json({ error: "Token inválido ou expirado." });
  }
}

module.exports = { verifyAuthentication };