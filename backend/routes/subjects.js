const router = require('express').Router()

// GET all subjects
router.get('/', async (req, res) => {
  try {
    const [rows] = await req.db.query('SELECT * FROM Subject ORDER BY SubjectCode')
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST add subject (calls AddSubject procedure)
router.post('/', async (req, res) => {
  const { code, name } = req.body
  if (!code || !name) return res.status(400).json({ error: 'Code and name are required' })
  try {
    await req.db.query('CALL AddSubject(?, ?)', [code, name])
    res.status(201).json({ message: 'Subject added successfully' })
  } catch (err) {
    res.status(400).json({ error: err.sqlMessage || err.message })
  }
})

// GET subject report (calls GetSubjectReport procedure)
router.get('/:code/report', async (req, res) => {
  try {
    const [rows] = await req.db.query('CALL GetSubjectReport(?)', [req.params.code])
    res.json(rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
