const Joi = require("joi");
const express = require("express");
const app = express();
const serviceAccount = require("./firebase.json");
const admin = require("firebase-admin");

app.use(express.json());

const persons = [];


admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://workshop2019-eea4b.firebaseio.com"
});

app.get("/", (req, res) => {
    res.send("hello word!!!")
});

snapshotToArray = (snapshot) => {
    const returnArrya = [];
    snapshot.forEach(childSnapShot => {
        const item = childSnapShot.data();
        item.id = childSnapShot.id;

        returnArrya.push(item);
    });
    return returnArrya;
};

function getData(res) {
    return admin.firestore()
        .collection("attendance")
        .get()
        .then((snapshot) => {
            const product = snapshotToArray(snapshot);
            res.status(200).send(product);
        })
        .catch((er) => {
            console.log(er + " ")
        })
}

function addData(person) {
    return admin.firestore()
        .collection("attendance").add(person)
        .then(function (docRef) {
            console.log("Document written with ID: ", docRef.id);
        })
        .catch(function (error) {
            console.error("Error adding document: ", error);
        });
};

app.get('/data', (req, res) => {
    getData(res);
});

app.post("/post", (req, res) => {

    const person = {
        name: req.body.name,
        Comments:req.body.comments,
        Email:req.body.email,
    };
    persons.push(person);
    addData(person);
    res.send(person);
});

//PORT
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`listening on port ${port}`)
});