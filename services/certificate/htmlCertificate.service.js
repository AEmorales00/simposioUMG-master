const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const generateFancyCertificate = async (participantName, participantId) => {
    const templateDir = __dirname;
    const templatePath = path.join(templateDir, 'template.html');
    const imagePath = path.join(templateDir, 'base1.jpeg');

    // ✅ Convertir ruta local a ruta file:// para Puppeteer
    const imageSrc = 'file://' + imagePath.replace(/\\/g, '/');

    // Leer y reemplazar nombre e imagen
    let html = fs.readFileSync(templatePath, 'utf8');
    html = html.replace('base1.jpeg', imageSrc);
    html = html.replace('Nombre de Prueba', participantName);

    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();

    await page.setContent(html, { waitUntil: 'networkidle0' });

    const pdfPath = path.join(templateDir, `../../certificates/certificate-${participantId}.pdf`);
    await page.pdf({
        path: pdfPath, format: 'A6', printBackground: true, landsconst puppeteer = require('puppeteer');
        const path = require('path');
        const fs = require('fs');

        const generateFancyCertificate = async (participantName, participantId) => {
            const templateDir = __dirname;
            const templatePath = path.join(templateDir, 'template.html');
            const imagePath = path.join(templateDir, 'base1.jpeg');

            const imageSrc = 'file://' + imagePath.replace(/\\/g, '/');

            let html = fs.readFileSync(templatePath, 'utf8');
            html = html.replace('base1.jpeg', imageSrc);
            html = html.replace('Nombre de Prueba', participantName);

            const browser = await puppeteer.launch({
                headless: true,
                args: ['--no-sandbox', '--disable-setuid-sandbox'],
                executablePath: puppeteer.executablePath()
            });

            const page = await browser.newPage();
            await page.setContent(html, { waitUntil: 'networkidle0' });

            const pdfPath = path.join('/tmp', `certificate-${participantId}.pdf`); // ← compatible con Render
            await page.pdf({ path: pdfPath, format: 'A6', printBackground: true, landscape: true });

            await browser.close();
            return pdfPath;
        };

        module.exports = { generateFancyCertificate };
        cape: true
    });

    await browser.close();
    return pdfPath;
};

module.exports = { generateFancyCertificate };
