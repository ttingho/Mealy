const moment = require('moment');
const models = require('../../models');

exports.getMeal = async (req, res) => {
  const schoolCode = 'D10';
  const type = 'today'; // today, next

  if (!type || !schoolCode) {
    res.status(400).json({
      status: 400,
      message: '급식조회 실패',
    });
    return;
  }

  try {
    let mealData; // 급식 정보

    if (type === 'today') {
      mealData = await models.Meal.getTodayByKakao(schoolCode);
    } else if (type === 'next') {
      mealData = await models.Meal.getNextByKakao(schoolCode);
    } else {
      res.status(400).json({
        status: 400,
        message: '급식조회 실패',
      });
      return;
    }

    let result; // response

    if (mealData.length <= 0) {
      result = {
        status: 200,
        message: '급식이 없어요',
        data: [],
      };
    } else {
      result = {
        status: 200,
        message: '급식 조회 성공',
        data: mealData,
      }
    }

    res.status(200).json(result);
    console.log('급식 조회 성공');
  } catch (error) {
    console.error(`급식 조회 실패 : ${error}`);
    const result = {
      status: 500,
      message: '급식 조회를 실패했어요',
    };

    res.status(500).json(result);
  }
};

exports.getMeals = async (req, res) => {
  const { date } = req.query; // YYYY-MM
  const schoolCode = 'D10';

  if (!date) {
    res.status(400).json({
      status: 400,
      message: '잘못된 날짜로 급식 요청',
    });

    return;
  }

  try {
    const mealData = await models.Meal.getMonthMeal(schoolCode, searchMonth); // 급식 정보

    res.status(200).json({
      status: 200,
      message: '급식 조회 성공',
      data: mealData,
    });
  } catch (error) {
    console.error(`급식 조회 실패 : ${error}`);
    const result = {
      status: 500,
      message: '급식 조회를 실패했어요',
    };

    res.status(500).json(result);
  }
};

exports.searchMeals = async (req, res) => {
  const { query } = req;
  console.log(query);

  if (query.date === null) {
    res.status(400).json({
      status: 400,
      message: '잘못된 날짜로 급식 검색 요청',
    });

    return;
  }

  try {
    const schoolCode = 'D10';
    const date = moment(query.date, 'YYYY-MM-DD').format('YYYY-MM-DD').toString();

    const mealData = await models.Meal.searchMeal(schoolCode, date);

    res.status(200).json({
      status: 200,
      message: '급식 검색 성공',
      data: mealData,
    });
  } catch (error) {
    console.error(`급식 검색 실패 : ${error}`);
    const result = {
      status: 500,
      message: '급식 검색를 실패했어요',
    };

    res.status(500).json(result);
  }
};