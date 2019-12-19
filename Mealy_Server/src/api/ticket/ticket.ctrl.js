const models = require('../../models');

exports.getMyTicket = async (req, res) => {
  const { memberId } = req.decoded;

  try {
    const member = await models.Member.getMember(memberId);

    if (!member) {
      res.status(404).json({
        status: 404,
        message: '없는 회원',
      });
      return;
    }

    const ticket = await models.Ticket.getMyTicket(member.idx);
    console.log(ticket);
    res.status(200).json({
      statis: 200,
      message: '요청 성공',
      data: ticket,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      status: 500,
      message: '티켓조회: 서버 에러',
    });
  }
};

exports.applyMealTicket = async (req, res) => {
  /*
  {
    "mealIdx": number // 신청할 급식 idx
  }
  */
  const { body } = req;
  const { memberId } = req.decoded;

  if (!body.mealIdx) {
    res.status(400).json({
      status: 400,
      message: '잘못된 급식 티켓 신청',
    });
    return;
  }

  try {
    const member = await models.Member.getMember(memberId);

    if (!member) {
      res.status(404).json({
        status: 404,
        message: '없는 회원',
      });
      return;
    }

    const ticket = await models.Ticket.getTicketByMemberIdx(member.idx, body.mealIdx);

    if (ticket.length > 0) {
      res.status(400).json({
        status: 400,
        message: '이미 신청한 급식입니다.',
      });
      return;
    }

    await models.Ticket.createTicket(member.idx, body.mealIdx);

    res.status(200).json({
      status: 200,
      message: '급식 티켓 신청 성공',
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      status: 500,
      message: '티켓신청: 서버 에러',
    })
  }
};

exports.cancelMealTicket = async (req, res) => {
    /*
    {
      "ticketIdx": number // 취소할 급식 idx
    }
    */
  const { query } = req;
  const { memberId } = req.decoded;
  console.log('a', query);
  if (!query.ticketIdx) {
    res.status(400).json({
      status: 400,
      message: '잘못된 급식 티켓 취소',
    });
    return;
  }

  try {
    const member = await models.Member.getMember(memberId);

    if (!member) {
      res.status(404).json({
        status: 404,
        message: '없는 회원',
      });
      return;
    }

    const getTicketByIdx = await models.Ticket.getTicketByIdx(member.idx, query.ticketIdx);

    if (getTicketByIdx.length <= 0) {
      res.status(404).json({
        status: 404,
        message: '없는 급식 티켓',
      });
      return;
    }

    await models.Ticket.destroy({
      where: {
        memberIdx: member.idx,
        mealIdx: query.ticketIdx,
      },
    });

    res.status(200).json({
      status: 200,
      message: '급식 티켓 취소 성공',
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      status: 500,
      message: '티켓취소: 서버 에러',
    })
  }
};

exports.transferTicket = async (req, res) => {
  /*
  {
    "ticketIdx": number // 티켓 idx
    "givenStudentId": string // 티켓을 받을 학생 학번
  }
  */
  const { body } = req;
  const { memberId } = req.decoded;
  console.log(body);
  if (!body.ticketIdx || !body.givenStudentId) {
    res.status(400).json({
      status: 400,
      message: '잘못된 급식 티켓 신청',
    });
    return;
  }

  try {
    const member = await models.Member.getMember(memberId);
    const [givenStudent] = await models.Member.getMemberByStudentId(body.givenStudentId);
    console.log(member, givenStudent);
    if (!member || !givenStudent) {
      res.status(404).json({
        status: 404,
        message: '없는 학생입니다',
      });
      return;
    }

    if (member.studentId === body.givenStudentId) {
      res.status(400).json({
        status: 400,
        message: '자기 자신에게 줄수 없습니다.',
      });
      return;
    }

    await models.Ticket.transferTicket(member.idx, givenStudent.idx, body.ticketIdx);

    res.status(200).json({
      status: 200,
      message: '급식 티켓 양도 성공',
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      status: 500,
      message: '티켓양도: 서버 에러',
    })
  }
};

