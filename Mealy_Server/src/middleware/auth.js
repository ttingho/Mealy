const lib = require('../lib/token');

const auth = async (req, res, next) => {
  const token  = req.headers['token'];
  console.log(token);
  if (!token) {
    const result = {
      status: 400,
      message: '토큰을 전송해주세요'
    };

    res.status(400).json(result);
    return;
  }

  try {
    const decodedToken = await lib.verifyToken(token);

    if(decodedToken.sub !== 'token') {
      const result = {
        status: 403,
        message: '정상적인 토큰이 아닙니다'
      };
  
      res.status(403).json(result);
      return;
    }

    req.decoded = decodedToken;
  } catch (err) {
    console.log(err);

    const result = {
      status: 500,
      message: '다시 시도해주세요'
    };

    res.status(500).json(result);
    return;
  }

  next();
}

module.exports = auth;