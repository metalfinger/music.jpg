const express = require('express')

const app = express()

// app.use(express.static('./public'))

app.get('/data', (req, res) => {
    res.json([{ name: "Hiren" }, { name: "Hiren" }]);
});


// app.all("*", (req, res) => {
//     res.status(404).send("NOT FOUND")
// })

app.listen(5000, () => {
    console.log("Server is Running... ");
})