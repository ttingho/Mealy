const router = require('express').Router();
const ticketCtrl = require('./ticket.ctrl');

router.get('/', ticketCtrl.getMyTicket);
router.post('/', ticketCtrl.applyMealTicket);
router.delete('/', ticketCtrl.cancelMealTicket);
router.put('/', ticketCtrl.transferTicket);

module.exports = router;