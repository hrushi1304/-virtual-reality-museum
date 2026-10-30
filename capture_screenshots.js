import puppeteer from 'puppeteer-core';
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml'
};

const server = http.createServer((req, res) => {
  let reqPath = req.url.split('?')[0];
  if (reqPath === '/') reqPath = '/index.html';
  const filePath = path.join(__dirname, reqPath);

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not found');
      return;
    }
    const ext = path.extname(filePath);
    res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
    res.end(data);
  });
});

const PORT = 8089;

server.listen(PORT, async () => {
  console.log(`Server running at http://localhost:${PORT}/`);

  const imagesDir = path.join(__dirname, 'assets', 'images');
  if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
  }

  const chromeCandidates = [
    process.env.CHROME_EXECUTABLE_PATH,
    process.platform === 'win32'
      ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
      : '/usr/bin/chromium',
    process.platform === 'win32'
      ? 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
      : '/usr/bin/google-chrome',
  ].filter(Boolean);
  const chromePath = chromeCandidates.find(candidate => fs.existsSync(candidate));

  try {
    if (!chromePath) throw new Error('Chrome/Chromium not found. Set CHROME_EXECUTABLE_PATH to its executable path.');
    const browser = await puppeteer.launch({
      executablePath: chromePath,
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--enable-webgl',
        '--ignore-gpu-blocklist',
        '--use-gl=angle',
        '--window-size=1280,720'
      ],
      defaultViewport: { width: 1280, height: 720 }
    });

    const page = await browser.newPage();

    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    page.on('pageerror', err => console.log('PAGE ERROR:', err.toString()));

    console.log('Navigating to app...');
    await page.goto(`http://localhost:${PORT}/index.html`, { waitUntil: 'networkidle0', timeout: 30000 });

    console.log('Waiting for welcome screen...');
    await page.waitForSelector('#welcome-screen:not(.hidden)', { timeout: 15000 });
    await new Promise(r => setTimeout(r, 1200));

    // 1. Welcome Screen
    const welcomeFile = path.join(imagesDir, 'screenshot_1_welcome.png');
    await page.screenshot({ path: welcomeFile });
    console.log('Captured 1:', welcomeFile);

    // Click Enter Virtual Museum
    console.log('Entering museum...');
    await page.click('#enter-btn');
    await new Promise(r => setTimeout(r, 2000));

    // 2. Main Lobby Entrance
    const lobbyFile = path.join(imagesDir, 'screenshot_2_lobby.png');
    await page.screenshot({ path: lobbyFile });
    console.log('Captured 2:', lobbyFile);

    // 3. Central Atrium & Planetary Showcase
    await page.evaluate(() => {
      const { camera, controls } = window.__MUSEUM__;
      camera.position.set(0, 1.7, 5.0);
      controls.getObject().rotation.y = 0; // Look towards Atrium & Earth
    });
    await new Promise(r => setTimeout(r, 1500));
    const atriumFile = path.join(imagesDir, 'screenshot_3_atrium.png');
    await page.screenshot({ path: atriumFile });
    console.log('Captured 3:', atriumFile);

    // 4. Art Gallery (West Wing)
    await page.evaluate(() => {
      const { camera, controls } = window.__MUSEUM__;
      camera.position.set(-15, 1.7, 12);
      controls.getObject().rotation.y = Math.PI / 2; // Look west at paintings
    });
    await new Promise(r => setTimeout(r, 1500));
    const artFile = path.join(imagesDir, 'screenshot_4_art_gallery.png');
    await page.screenshot({ path: artFile });
    console.log('Captured 4:', artFile);

    // 5. Historical Artifacts Gallery (East Wing)
    await page.evaluate(() => {
      const { camera, controls } = window.__MUSEUM__;
      camera.position.set(15, 1.7, 12);
      controls.getObject().rotation.y = -Math.PI / 2; // Look east at Tutankhamun & artifacts
    });
    await new Promise(r => setTimeout(r, 1500));
    const historyFile = path.join(imagesDir, 'screenshot_5_history_gallery.png');
    await page.screenshot({ path: historyFile });
    console.log('Captured 5:', historyFile);

    // 6. Science & Technology Wing
    await page.evaluate(() => {
      const { camera, controls } = window.__MUSEUM__;
      camera.position.set(-12, 1.7, -12);
      controls.getObject().rotation.y = 0; // Look south towards Bohr Atom and DNA
    });
    await new Promise(r => setTimeout(r, 1500));
    const scienceFile = path.join(imagesDir, 'screenshot_6_science_wing.png');
    await page.screenshot({ path: scienceFile });
    console.log('Captured 6:', scienceFile);

    // 7. Central Exhibition Hall (Solar System Orrery & Great Pyramid)
    await page.evaluate(() => {
      const { camera, controls } = window.__MUSEUM__;
      camera.position.set(10, 1.7, -12);
      controls.getObject().rotation.y = 0; // Look south towards Solar Orrery
    });
    await new Promise(r => setTimeout(r, 1500));
    const exhibitFile = path.join(imagesDir, 'screenshot_7_exhibition_hall.png');
    await page.screenshot({ path: exhibitFile });
    console.log('Captured 7:', exhibitFile);

    // 8. Exhibit Information Modal Dialogue
    await page.evaluate(() => {
      const { getExhibitObjects, openInfoPanel, controls } = window.__MUSEUM__;
      const exhibits = getExhibitObjects();
      // Exhibit 0 is Starry Night, let's open it or find Bohr atom
      const target = exhibits.find(e => e.userData?.exhibitData?.title?.includes('Atom')) || exhibits[0];
      if (target && target.userData?.exhibitData) {
        openInfoPanel(target.userData.exhibitData, controls);
      }
    });
    await new Promise(r => setTimeout(r, 1000));
    const modalFile = path.join(imagesDir, 'screenshot_8_info_modal.png');
    await page.screenshot({ path: modalFile });
    console.log('Captured 8:', modalFile);

    // Close modal
    await page.click('#info-close');
    await new Promise(r => setTimeout(r, 500));

    // 9. Help & Controls Guide Overlay
    await page.click('#help-btn');
    await new Promise(r => setTimeout(r, 800));
    const helpFile = path.join(imagesDir, 'screenshot_9_help_guide.png');
    await page.screenshot({ path: helpFile });
    console.log('Captured 9:', helpFile);

    console.log('All screenshots captured successfully!');
    await browser.close();
  } catch (err) {
    console.error('Error during screenshot capture:', err);
  } finally {
    server.close();
    process.exit(0);
  }
});
