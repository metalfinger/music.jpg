//! Express
const express = require('express')

//!Express File Uploader
const fileUpload = require('express-fileupload');


//!nedb
const DataStore = require('nedb')
const database = new DataStore("database.db")
database.loadDatabase(); //!load database



const app = express()

app.use(express.static('./public'))

// parse encoder
app.use(express.urlencoded({ extended: false }))

// parse json
app.use(express.json())

app.use(fileUpload());

app.post('/getall', (req, res) => {
    console.log("Before");
    // console.log(database.count());
    console.log("After");

    //get all data from database
    // database.find({}, (err, data) => {
    //     console.log(data);
    //     if (err) {
    //         console.log(err)
    //     } else {
    //         console.log(data);
    //         res.json(data)
    //     }
    // });

    database.find({}).sort({ Date: -1 }).exec((err, data) => {
        console.log(data);
        if (err) {
            console.log(err)
        } else {
            console.log(data);
            res.json(data)
        }
    })
});

app.post('/getmusicnotes', (req, res) => {

    console.log("Before Notes");
    console.log(req.body.id);
    console.log("After Notes");

    //get all data from database
    database.find({ "_id": req.body.id }, (err, data) => {
        // console.log(data);
        if (err) {
            // console.log(err)
        } else {
            console.log(data);
            res.json(data)
        }
    });
});

app.post('/upload', (req, res) => {
    let sampleFile;
    let uploadFile;

    // console.log(req);


    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(404).send("No Files were Uploaded")
    }

    sampleFile = req.files.sampleFile;
    uploadFile = __dirname + "/public/myimages/" + sampleFile.name;

    sampleFile.mv(uploadFile, function(err) {
        if (err) {
            return res.status(500).send(err);
        }

        console.log(req.files.sampleFile.name);
        console.log(req.body.musicData);

        //!Enter data into database
        const fullDate = Date();
        database.insert({ Date: fullDate, FileName: req.files.sampleFile.name, MusicData: req.body.musicData });


        console.log("YAAAY ", uploadFile);
        res.send('File Uploaded');
    })
});


// app.all("*", (req, res) => {
//     res.status(404).send("NOT FOUND")
// })

app.listen(process.env.PORT || 5000, () => {
    console.log("Server is Running... ");
})