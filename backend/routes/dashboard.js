const router = require('express').Router()

// GET dashboard data — uses the AdminDashboard VIEW from the schema
router.get('/', async (req, res) => {
  try {
    const [rows] = await req.db.query(`
      SELECT * FROM AdminDashboard
      ORDER BY AlertTimeStamp DESC
    `)
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
