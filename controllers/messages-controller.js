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
    var messageReference = firebase.database().ref("/Messages/");

    //Attach an asynchronous callback to read the data
    messageReference.on(
        "value",
        function (snapshot) {
            console.log(snapshot.val());
            res.json(snapshot.val());
            messageReference.off("value");
        },
        function (errorObject) {
            console.log("The read failed: " + errorObject.code);
            res.send("The read failed: " + errorObject.code);
        });
};

//Create new instance
exports.putRequest = (req, res) => {

    console.log("HTTP Put Request");

    var author = req.body.UserName;
    var message = req.body.Name;

    var referencePath = '/Messages/';
    var messageReference = firebase.database().ref(referencePath);
    messageReference.set({ author, message },
        function (error) {
            if (error) {
                res.send({ mensagem: "Data could not be saved.", error });
            }
            else {
                res.send({ mensagem: "Data saved successfully."});
            }
        });
};

exports.sendMessage = (messages) => {
    var author = messages.author;
    var message = messages.message;

    var referencePath = '/Messages/' + new Date().getTime() + '/';
    var messageReference = firebase.database().ref(referencePath);
    messageReference.set({ author, message },
        function (error) {
            if (error) {
                console.log("Data could not be saved.", error);
            }
            else {
                console.log("Data saved successfully.");
            }
        });
};

exports.getMessages = async () => {
    var messageReference = firebase.database().ref("/Messages/");
    var messages = {};

    await messageReference.on(
        "value",
        function (snapshot) {
            messages = snapshot.val();
        },
        function (errorObject) {
            console.log("The read failed: " + errorObject.code);
        });

    return messages;
}
