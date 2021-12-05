//! Express
const express = require('express')

//!Express File Uploader
const fileUpload = require('express-fileupload');


//!FIREBASE CODE STARTS --------------------- 
var firebase = require('firebase/app');
var firestore = require('firebase/firestore/lite');
var firestorage = require('firebase/storage');


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBp_GyL9SdTed56B5zDewUfBx7iXp9V7o8",
    authDomain: "music-jpg-ac824.firebaseapp.com",
    projectId: "music-jpg-ac824",
    storageBucket: "music-jpg-ac824.appspot.com",
    messagingSenderId: "48842147145",
    appId: "1:48842147145:web:958ba842554dee3d3a8698"
};

// Initialize Firebase
var firebaseApp = firebase.initializeApp(firebaseConfig);

var firestoreDB = firestore.getFirestore(firebaseApp);

const mainDataReference = firestore.collection(firestoreDB, 'maindata');

//!Get all the existing Documents
async function getAllDocuments() {

    // let myRef = firestore.collection(firestoreDB, "maindata");
    let myRef = firestore.collection(firestoreDB, "maindata");


    let docData = await firestore.getDocs(myRef)
        .then(function(snapshot) {

            let masterData = [];
            snapshot.docs.forEach(doc => {
                let dataObject = { "id": doc.id, "data": doc.data() };
                masterData.push(dataObject);
                // console.log(doc.id, doc.data());
            });

            return masterData;

        }).catch(function(error) {
            console.log("error");
        });


    return docData;
}

//!Get document with particular id
async function getDocument(id) {

    const alovelaceDocumentRef = firestore.doc(firestoreDB, 'maindata', id);
    console.log(alovelaceDocumentRef);

    const docSnap = await firestore.getDoc(alovelaceDocumentRef);

    // console.log(docSnap.data().imageSrc);

    firestore.updateDoc(alovelaceDocumentRef, { numPlayed: (docSnap.data().numPlayed) + 1 })
        .then(function() {
            console.log("Document successfully updated!");
        }).catch(function(error) {
            console.error("Error updating document: ", error);
        });

    return docSnap.data();
}
//!Update document with particular id
function updateDocument(_id, _numPlayed) {

    const alovelaceDocumentRef = firestore.doc(firestoreDB, 'maindata', _id);
    console.log(alovelaceDocumentRef);

    firestore.updateDoc(alovelaceDocumentRef, { numPlayed: _numPlayed })
        .then(function() {
            console.log("Document successfully updated!");
        }).catch(function(error) {
            console.error("Error updating document: ", error);
        });
}



//! Add a new document with a generated id in firestore
function addDocument(_musicData, _imageSrc, _numPlayed) {
    firestore.addDoc(mainDataReference, { createdAt: Date.now(), numPlayed: _numPlayed, musicData: _musicData, imageSrc: _imageSrc })
        .then(function(docRef) {
            console.log("Document written with ID: ", docRef.id);
        }).catch(function(error) {
            console.error("Error adding document: ", error);
        });
}



// updateDocument("xsvEAtrjhgppk2MXL9xm", "asdf", "asdfas", 5)

function uploadImagetoFirebaseStorage(file, fileName) {
    firestorage.getStorage().ref('images/' + Date.now()).put(file).then(function(snapshot) {
        console.log('Uploaded a blob or file!');
    });
}




//!FIREBASE CODE ENDS --------------------- 

// //!Firebase Admin Bucket Starts ---------------------
// var admin = require('firebase-admin');
// var uuid = require('uuidv4');

// let serviceAccount = require('./firebasekey/firebase-service-key.json');

// admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount),
//     storageBucket: "music-jpg-ac824.appspot.com"

// });

// var bucket = admin.storage().bucket();
// var fileName = "./public/myimages/41-The-shoes-of-Hunger-Part-2-Flat-Breads.jpg";

// async function uploadFileToBucket(fileName) {
//     const metadata = {
//         contentType: 'image/jpeg',
//         metadata: {
//             firebaseStorageDownloadTokens: uuid
//         },
//         cacheControl: 'public, max-age=31536000'
//     };

//     bucket.upload(fileName, {
//         // Support for HTTP requests made with `Accept-Encoding: gzip`
//         gzip: true,
//         metadata: metadata,
//     }).then((ref) => {
//         // console.log('Uploaded a blob or file!');
//         // console.log(ref);
//         // console.log('Uploaded a blob or file! --------');
//         // console.log(ref[0].metadata);

//         const imageUrl = 'https://firebasestorage.googleapis.com/v0/b/' +
//             ref[0].metadata.bucket +
//             '/o/' +
//             ref[0].metadata.name +
//             '?alt=media';

//         console.log(imageUrl);

//     });
// }


// //!Firebase Admin Bucket Ends ---------------------

//!nedb
// const DataStore = require('nedb');
// const { async } = require('@firebase/util');
// const database = new DataStore("database.db")
// database.loadDatabase(); //!load database



const app = express()

app.use(express.static('./public'))

// parse encoder
app.use(express.urlencoded({ extended: false }))

// parse json
app.use(express.json());

app.use(fileUpload());

app.post('/getall', (req, res) => {
    console.log(req.body);

    getAllDocuments().then(function(data) {
        // console.log(data);
        res.json(data);
    });
});

app.post('/getmusicnotes', (req, res) => {
    console.log(req.body);

    getDocument(req.body.data).then(function(data) {
        console.log(data); //[0].data.musicData);
        res.json(data);
    });
});

app.post('/getallold', (req, res) => {
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

    // database.find({}).sort({ Date: -1 }).exec((err, data) => {
    //     console.log(data);
    //     if (err) {
    //         console.log(err)
    //     } else {
    //         // console.log(data);
    //         res.json(data)
    //     }
    // });

    // getAllDocuments().then(function(data) {
    //     // console.log(data);
    //     //Create dummy array
    //     let dummyArray = ["asdf", "asdf", "sdf"];

    //     console.log(JSON.stringify(dummyArray));
    //     res.send("Sending the response here !!!");
    // });

    let dummyArray = ["asdf", "asdf", "sdf"];

    console.log(JSON.stringify(dummyArray));
    res.json([{ name: "john" }, { name: "susan" }]);

});

app.post('/getmusicnotesold', (req, res) => {

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
    uploadFile = '/Users/hiren/Desktop/600x360.jpeg';

    let fileSource = req.body.imageSrc;

    addDocument(req.body.musicData, req.body.imageSrc, 0);
    res.send('Data Uploaded');

    // console.log("MOFO ", fileSource);

    // console.log(req.files.sampleFile);
    // console.log("File to upload ", uploadFile);
    // //!FIrebase starts
    // uploadFileToBucket(fileSource).then(() => {
    //     console.log("File Uploaded");
    //     res.send('File Uploaded');
    // });

    // //!Firebase Ends

    // sampleFile.mv(uploadFile, function(err) {
    //     if (err) {
    //         return res.status(500).send(err);
    //     }

    //     console.log(req.files.sampleFile.name);
    //     console.log(req.body.musicData);

    //     //!Enter data into database
    //     const fullDate = Date();
    //     database.insert({ Date: fullDate, FileName: req.files.sampleFile.name, MusicData: req.body.musicData });


    //     console.log("YAAAY ", uploadFile);
    //     res.send('File Uploaded');
    // })
});


// app.all("*", (req, res) => {
//     res.status(404).send("NOT FOUND")
// })

app.listen(process.env.PORT || 5000, () => {
    console.log("Server is Running... ");
})