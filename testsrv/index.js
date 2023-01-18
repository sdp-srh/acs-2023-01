
const express = require('express')

// start express app with the port from the environment or 3000 for local development
const app = express()
const port = process.env.PORT || 3000

// enable json parsing
app.use(express.json())

app.get('/', async (req, res) => {
  res.send('<h1>Welcome to our service</h1>')
})

app.listen(port, async () => {
  console.log(`test service is running on ${port}`)
})
