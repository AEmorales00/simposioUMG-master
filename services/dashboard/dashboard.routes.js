const express = require('express');
const router = express.Router();
const { getDashboardSummary } = require('./dashboard.controller');
const authMiddleware = require('../../middleware/auth.middleware');
const { downloadDashboardExcel } = require('./dashboard.controller');
const { exportParticipantsExcel } = require('./dashboard.controller');


router.get('/export', authMiddleware, downloadDashboardExcel);
router.get('/summary', authMiddleware, getDashboardSummary);
router.get('/participants/export', authMiddleware, exportParticipantsExcel);


module.exports = router;
