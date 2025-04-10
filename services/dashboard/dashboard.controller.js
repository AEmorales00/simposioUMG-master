const { getSummary } = require('./dashboard.service');
const ExcelJS = require('exceljs');
const pool = require('../../db/pool');

const getDashboardSummary = async (req, res) => {
  try {
    const summary = await getSummary();
    res.json(summary);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const downloadDashboardExcel = async (req, res) => {
  try {
    const summary = await getSummary();

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Resumen INNOVA');

    sheet.columns = [
      { header: 'Métrica', key: 'label', width: 30 },
      { header: 'Valor', key: 'value', width: 20 }
    ];

    sheet.addRow({ label: 'Total de Participantes', value: summary.total_participants });
    sheet.addRow({ label: 'Confirmados', value: summary.confirmed });
    sheet.addRow({ label: 'Pendientes', value: summary.pending });
    sheet.addRow({ label: 'Asistieron (Check-in)', value: summary.checked_in });
    sheet.addRow({ label: 'Total Recaudado (Q)', value: summary.total_collected });
    sheet.addRow({ label: 'Porcentaje de Asistencia (%)', value: summary.attendance_percent });

    sheet.addRow({});
    sheet.addRow({ label: '--- Pagos por Tipo ---' });
    summary.payments_breakdown.forEach(p => {
      sheet.addRow({ label: `Pago por ${p.payment_method}`, value: p.total });
    });

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="dashboard_innova.xlsx"'
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getDashboardSummary,
  downloadDashboardExcel
};

const exportParticipantsExcel = async (req, res) => {
    try {
      const workbook = new ExcelJS.Workbook();
      const sheet = workbook.addWorksheet('Participantes INNOVA');
  
      // Encabezados
      sheet.columns = [
        { header: 'ID', key: 'id', width: 6 },
        { header: 'Nombre', key: 'name', width: 30 },
        { header: 'Tipo', key: 'type', width: 20 },
        { header: 'Carnet/Institución', key: 'carnet', width: 30 },
        { header: 'Correo', key: 'email', width: 25 },
        { header: 'Teléfono', key: 'phone', width: 15 },
        { header: 'Estado', key: 'status', width: 15 },
        { header: 'Pago', key: 'payment', width: 15 },
        { header: 'Check-in', key: 'checkin', width: 10 }
      ];
  
      // Traer participantes + método de pago
      const result = await pool.query(`
        SELECT p.id, p.name, p.participant_type, p.carnet, p.institution, p.email, p.phone,
               p.status, p.checked_in, pay.payment_method
        FROM participants p
        LEFT JOIN payments pay ON pay.participant_id = p.id
        ORDER BY p.id ASC
      `);
  
      result.rows.forEach((row) => {
        sheet.addRow({
          id: row.id,
          name: row.name,
          type: row.participant_type,
          carnet: row.carnet || row.institution || '',
          email: row.email,
          phone: row.phone,
          status: row.status,
          payment: row.payment_method || '—',
          checkin: row.checked_in ? '✅' : '❌'
        });
      });
  
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      );
      res.setHeader(
        'Content-Disposition',
        'attachment; filename="participantes_innova.xlsx"'
      );
  
      await workbook.xlsx.write(res);
      res.end();
    } catch (error) {
      res.status(500).json({ error: 'Error al generar Excel de participantes' });
    }
  };
  
  module.exports = {
    getDashboardSummary,
    downloadDashboardExcel,
    exportParticipantsExcel // 👈 Asegúrate que esto esté exportado también
  };
  