const functions = require("firebase-functions");
var admin = require("firebase-admin");

var serviceAccount = require("/Users/gsymmy/Desktop/ncr-unify/ncr-unify-firebase-adminsdk-tnjc9-702d396dd3.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});


const express = require("express");
const cors = require("cors");
const app = express();
const db = admin.firestore();
app.use(cors({ origin:true}));

//Routes

app.get('/hello-world', (req, res) => {
    return res.status(200).send('Hello World!');
});

//Create
//Post
app.post('/api/create', (req,res) => {
    (async () => {
        try{
            await db.collection('creators').doc('/' + req.body.id + '/')
            .create({
                name: req.body.name,
                location: req.body.location,
                revenueYTD: req.body.revenueYTD,
                currentBal: req.body.currentBal,
                followers: req.body.followers,
                impressions: req.body.impressions,
                role: req.body.role
            })
            return res.status(200).send();
        }
        catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    })();
});

//Read

app.get('/api/read/:id', (req,res) => {
    (async () => {
        try{
            const document = db.collection('creators').doc(req.params.id);
            let creator = await document.get();
            let response = creator.data();
            return res.status(200).send(response);
        }
        catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    })();
});

app.get('/api/read', (req,res) => {
    (async () => {
        try{
            let query = db.collection('creators');
            let response = [];

            await query.get().then(querySnapshot => {
                let docs = querySnapshot.docs;
                for(let doc of docs){
                    const selectedItem = {
                        id: doc.id,
                        name: doc.data().name,
                        location: doc.data().location,
                        revenueYTD: doc.data().revenueYTD,
                        currentBal: doc.data().currentBal,
                        followers: doc.data().followers,
                        impressions: doc.data().impressions,
                        role: doc.data().role
                    };
                    response.push(selectedItem);
                }
                return response;
            })
            return res.status(200).send(response);
        }
        catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    })();
});

//Update

app.put('/api/update/:id', (req,res) => {
    (async () => {
        try{
            const document = db.collection('creators').doc(req.params.id);
            await document.update({
                name: req.body.name,
                location: req.body.location,
                revenueYTD: req.body.revenueYTD,
                currentBal: req.body.currentBal,
                followers: req.body.followers,
                impressions: req.body.impressions,
                role: req.body.role
            });
            return res.status(200).send();
        }
        catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    })();
});

//Delete

app.delete('/api/delete/:id', (req,res) => {
    (async () => {
        try{
            const document = db.collection('creators').doc(req.params.id);
            await document.delete();
            return res.status(200).send();
        }
        catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    })();
});

//Export API

exports.app = functions.https.onRequest(app);

 