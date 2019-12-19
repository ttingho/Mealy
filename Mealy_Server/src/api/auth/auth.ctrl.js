const models = require('../../models');
const lib = require('../../lib/token');

/**
 * @description 로그인 처리
 */
exports.login = async (req, res) => {
  const { body } = req;

  if (!body.id || !body.pw) {
    res.status(400).json({
      status: 400,
      message: '아이디또는 비번을 입력해주세요',
    });

    return;
  }

  try {
    const member = await models.Member.findOne({
      attributes: ['id', 'name', 'studentId'],
      where: {
        id: body.id, 
        pw: body.pw,
      },
      raw: true,
    });

    if (!member) {
      res.status(404).json({
        status: 404,
        message: '없는 회원',
      });
  
      return;
    }

    const token = await lib.createToken(member.id, member.studentId);

    res.status(200).json({
      status: 200,
      message: '로그인 성공',
      data: {
        token
      },
    });
  } catch (error) {
    console.log(`[auth - login] 서버에러 : ${error}`);
    const result = {
      status: 500,
      message: '로그인에 실패했습니다'
    };

    res.status(500).json(result);
  }
};

/**
 * @description 회원가입 처리
 */
exports.signUp = async (req, res) => {
  const { body } = req;

  if (!body.id || !body.pw || !body.key) {
    res.status(400).json({
      status: 400,
      message: '아이디또는 비번을 입력해주세요',
    });

    return;
  }

  try {
    let member = await models.Member.getRegisterMember(body.key);

    if (member.length <= 0) {
      res.status(401).json({
        status: 401,
        message: '등록되지 않는 인증키',
      });

      return;
    }

    await models.Member.updateMemberInfo(body);

    res.status(200).json({
      status: 200,
      message: '회원가입 성공',
    });
  } catch (error) {
    console.log(`[auth - login] 서버에러 : ${error}`);
    const result = {
      status: 500,
      message: '로그인에 실패했습니다'
    };

    res.status(500).json(result);
  }
};