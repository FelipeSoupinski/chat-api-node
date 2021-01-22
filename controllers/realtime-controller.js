const firebase = require('firebase');

const firebaseConfig = {
    apiKey: "AIzaSyAELFrZuXgf2LfZKn8EJ8hdDAek6sYfQlw",
    authDomain: "api-unienergia.firebaseapp.com",
    databaseURL: "https://api-unienergia-default-rtdb.firebaseio.com",
    projectId: "api-unienergia",
    storageBucket: "api-unienergia.appspot.com",
    messagingSenderId: "589392041583",
    appId: "1:589392041583:web:baaa4c62c25b4c69805f9a",
    measurementId: "G-RK2GFTHHT3"
};

firebase.initializeApp(firebaseConfig);

exports.getRequest = (req, res) => {
    console.log("HTTP Get Request");
    var userReference = firebase.database().ref("/Users/");

    //Attach an asynchronous callback to read the data
    userReference.on(
        "value",
        function (snapshot) {
            console.log(snapshot.val());
            res.json(snapshot.val());
            userReference.off("value");
        },
        function (errorObject) {
            console.log("The read failed: " + errorObject.code);
            res.send("The read failed: " + errorObject.code);
        });
};

//Create new instance
exports.putRequest = (req, res) => {

    console.log("HTTP Put Request");

    var userName = req.body.UserName;
    var name = req.body.Name;
    var age = req.body.Age;

    var referencePath = '/Users/' + userName + '/';
    var userReference = firebase.database().ref(referencePath);
    userReference.set({ Name: name, Age: age },
        function (error) {
            if (error) {
                res.send({ mensagem: "Data could not be saved.", error });
            }
            else {
                res.send({ mensagem: "Data saved successfully."});
            }
        });
};

//Update existing instance
exports.postRequest = (req, res) => {

    console.log("HTTP POST Request");

    var userName = req.body.UserName;
    var name = req.body.Name;
    var age = req.body.Age;

    var referencePath = '/Users/' + userName + '/';
    var userReference = firebase.database().ref(referencePath);
    userReference.update({ Name: name, Age: age },
        function (error) {
            if (error) {
                res.send("Data could not be updated." + error);
            }
            else {
                res.send("Data updated successfully.");
            }
        });
};

//Delete an instance
exports.deleteRequest = (req, res) => {

    console.log("HTTP DELETE Request");
    //todo
};
