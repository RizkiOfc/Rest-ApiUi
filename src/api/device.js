module.exports = function (app) {

  function runtime(seconds) {
    const pad = s => (s < 10 ? '0' + s : s);
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
  }

  app.get('/api/device', (req, res) => {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'];
    const language = req.headers['accept-language'];

    res.json({
      status: true,
      serverData: {
        ip,
        userAgent,
        language,
        platform: process.platform,
        arch: process.arch,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        now: new Date().toLocaleString(),
        uptime: runtime(process.uptime())
      }
    });
  });

  app.post('/api/device', (req, res) => {
    const { battery, location } = req.body;

    console.log('[DEVICE INFO]');
    console.log('Baterai:', battery);
    console.log('Lokasi:', location);

    res.json({
      status: true,
      message: 'Data device dari client diterima',
      received: { battery, location }
    });
  });
}
