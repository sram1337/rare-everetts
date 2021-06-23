const express = require('express')
const app = express()
port = process.env.PORT || 80;


app.use(express.static('./src'))
app.use(express.static('./build/contracts'))

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, err => {
    if(err) throw err;
    console.log("%c Server running", "color: green");
});
