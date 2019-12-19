const router = require('express').Router();
const mealCtrl = require('./meal.ctrl');

router.route('/').get(mealCtrl.getMeal);
router.route('/all').get(mealCtrl.getMeals);
router.route('/search').get(mealCtrl.searchMeals);

module.exports = router;
