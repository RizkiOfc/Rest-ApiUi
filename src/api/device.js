module.exports = function (app) {
  app.post('/api/device', (req, res) => {
  try {
    const { battery, timezone } = req.body;
    const userAgent = req.headers['user-agent'];

    res.status(200).json({
      status: true,
      creator: "Rizki",
      result: {
        userAgent,
        timezone,
        battery
      }
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: 'Gagal menerima data: ' + err.message
    });
  }
});
}
