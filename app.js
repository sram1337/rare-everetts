const express = require('express')
const app = express()
const port = 80

app.use(express.static('./src'))
app.use(express.static('./build/contracts'))

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
