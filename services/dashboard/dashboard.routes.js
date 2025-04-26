const express = require('express');
const router = express.Router();

const { getDashboardSummary, downloadDashboardExcel, exportParticipantsExcel, getParticipantsList } = require('./dashboard.controller');
const { authMiddleware } = require('../../middleware/auth.middleware');

router.get('/export', authMiddleware, downloadDashboardExcel);
router.get('/summary', authMiddleware, getDashboardSummary);
router.get('/participants/export', authMiddleware, exportParticipantsExcel);
router.get('/participants', authMiddleware, getParticipantsList);

module.exports = router;
