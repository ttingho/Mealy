const router = require('express').Router();
const models = require('../models');

router.get('/:id', async (req, res) => {
  const { id } = req.params;

  if (!id) {
    res.status(400).json({
      status: 400,
      message: 'id를 보내주세요',
    });

    return;
  }

  try {
    const member = await models.Member.getMember(id);

    res.status(200).json({
      status: 200,
      message: '회원 조회',
      data: member,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 500,
      message: '서버 에러',
    });
  }
});

module.exports = router;
