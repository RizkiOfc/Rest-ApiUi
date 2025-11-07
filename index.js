const express = require('express');
const chalk = require('chalk');
const fs = require('fs');
const cors = require('cors');
const path = require('path');
const serverStartTime = Date.now();

require("./function.js");

const app = express();
const PORT = process.env.PORT || 8000;

app.enable("trust proxy");
app.set("json spaces", 2);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.use('/', express.static(path.join(__dirname, '/')));
app.use('/', express.static(path.join(__dirname, 'api-page')));
app.use('/src', express.static(path.join(__dirname, 'src')));

const settingsPath = path.join(__dirname, './settings.json');
let settings = {};
try {
  settings = JSON.parse(fs.readFileSync(settingsPath, 'utf-8'));
} catch (err) {
  console.error(chalk.red(`Error loading settings.json: ${err.message}`));
  process.exit(1);
}

global.apikey = settings.apikey || null;
global.apikeyprem = settings.apikeyprem || null;
global.totalreq = 0;

app.use((req, res, next) => {
  console.log(chalk.bgHex('#FFFF99').hex('#333').bold(` Request Route: ${req.path} `));
  global.totalreq += 1;

  const originalJson = res.json;
  res.json = function (data) {
    if (data && typeof data === 'object') {
      const responseData = {
        status: data.status,
        creator: settings.creator || "Created Using Skyzo",
        ...data
      };
      return originalJson.call(this, responseData);
    }
    return originalJson.call(this, data);
  };

  next();
});

let totalRoutes = 0;
const apiFolder = path.join(__dirname, './src');

fs.readdirSync(apiFolder).forEach((subfolder) => {
  const subfolderPath = path.join(apiFolder, subfolder);
  if (fs.statSync(subfolderPath).isDirectory()) {
    fs.readdirSync(subfolderPath).forEach((file) => {
      const filePath = path.join(subfolderPath, file);
      if (path.extname(file) === '.js') {
        require(filePath)(app);
        totalRoutes++;
        console.log(chalk.bgHex('#FFFF99').hex('#333').bold(` Loaded Route: ${path.basename(file)} `));
      }
    });
  }
});

console.log(chalk.bgHex('#90EE90').hex('#333').bold(' Load Complete! ✓ '));
console.log(chalk.bgHex('#90EE90').hex('#333').bold(` Total Routes Loaded: ${totalRoutes} `));

// Home page route - tampilkan home.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'api-page', 'home.html'));
});

// API Documentation page - tampilkan api.html
app.get('/api', (req, res) => {
  res.sendFile(path.join(__dirname, 'api-page', 'api.html'));
});

// Monitoring page
app.get('/monitoring', (req, res) => {
  res.json({
    status: 'success',
    message: 'All systems operational',
    uptime: process.uptime(),
    totalRequests: global.totalreq,
    endpoints: totalRoutes,
    timestamp: new Date().toISOString()
  });
});

// Uploader page
app.get('/uploader', (req, res) => {
  res.json({
    status: 'success',
    message: 'Uploader service is running',
    uploadUrl: 'https://tech-upload.onrender.com'
  });
});

// Tambahkan di bagian atas file index.js


// Tambahkan route untuk real-time stats
app.get('/api/stats', (req, res) => {
    try {
        const settingsPath = path.join(__dirname, './settings.json');
        const settings = JSON.parse(fs.readFileSync(settingsPath, 'utf-8'));
        
        let totalEndpoints = 0;
        const categories = Object.keys(settings.endpoints || {});
        
        // Hitung total endpoints
        categories.forEach(category => {
            totalEndpoints += settings.endpoints[category].length;
        });

        // Calculate uptime
        const uptimeMs = Date.now() - serverStartTime;
        const uptimeDays = Math.floor(uptimeMs / (1000 * 60 * 60 * 24));
        const uptimeHours = Math.floor((uptimeMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const uptimeMinutes = Math.floor((uptimeMs % (1000 * 60 * 60)) / (1000 * 60));
        
        // For Vercel, we'll show current session uptime
        const uptimeString = `${uptimeDays}d ${uptimeHours}h ${uptimeMinutes}m`;

        res.json({
            status: 'success',
            totalEndpoints: totalEndpoints,
            totalCategories: categories.length,
            totalRequests: global.totalreq,
            uptime: uptimeString,
            uptimeMs: uptimeMs,
            timestamp: new Date().toISOString(),
            environment: process.env.VERCEL ? 'Vercel' : 'Local'
        });
        
    } catch (error) {
        console.error('Error loading stats:', error);
        res.json({
            status: 'error',
            totalEndpoints: 0,
            totalCategories: 0,
            totalRequests: global.totalreq,
            uptime: '0d 0h 0m',
            environment: process.env.VERCEL ? 'Vercel' : 'Local'
        });
    }
});

// Health check endpoint untuk monitor uptime external
app.get('/api/health', (req, res) => {
    res.json({
        status: 'healthy',
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        version: '2.0'
    });
});

// Feedback page
app.get('/feedback', (req, res) => {
  res.json({
    status: 'success',
    message: 'Feedback system is active',
    contact: 'https://wa.me/6287794585528'
  });
});

// Status page route
app.get('/status', (req, res) => {
  res.json({
    status: 'success',
    message: 'All systems operational',
    uptime: process.uptime(),
    totalRequests: global.totalreq
  });
});

// Contact page route
app.get('/contact', (req, res) => {
  res.json({
    status: 'success',
    contact: {
      whatsapp: 'https://wa.me/6287794585528',
      channel: null
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'api-page', '404.html'));
});

// 500 error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).sendFile(path.join(__dirname, 'api-page', '500.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(chalk.bgHex('#90EE90').hex('#333').bold(` Server is running on port ${PORT} `));
});

module.exports = app;
