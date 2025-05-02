const { generateFancyCertificate } = require('./services/certificate/htmlCertificate.service');

generateFancyCertificate('Kevin Augusto Rene Escobar Cifuentes', 999)
    .then(pdfPath => console.log('✅ PDF generado en:', pdfPath))
    .catch(err => console.error('❌ Error:', err));
