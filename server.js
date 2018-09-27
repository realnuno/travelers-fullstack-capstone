"use strict";
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const morgan = require("morgan");
const passport = require("passport");
const config = require('./config');
const jwtAuth = passport.authenticate('jwt', {session: false});
const { router: usersRouter } = require("./users/users-router");
const { router: mylistRouter } = require("./mylist/mylist-router");
const { localStrategy, jwtStrategy } = require("./auth/auth-strategies");
const { router: authRouter } = require("./auth/auth-router");
const { PORT, DATABASE_URL } = require("./config");


mongoose.Promise = global.Promise;
const app = express();
app.use(morgan("common")); // Logging


app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type,Authorization");
    res.header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE");
    if (req.method === "OPTIONS") {
        return res.send(204);
    }
    next();
});

app.use(express.static("public"));


passport.use(localStrategy);
passport.use(jwtStrategy);


app.use("/api/users/", usersRouter);
app.use("/api/auth/", authRouter);
app.use("/api/mylist/", mylistRouter);





//============= external API ======================================


const foursquare = require('node-foursquare-venues')(
    'OYGYB2BAY34FJBJQFNDJXFJC3YYRSZJCS5HKOQZAUT1ZFKU3',
    'QC3ZYQ2HCMCQOBLJV0RCL0B5ST0KBNIXHAJQ54ADI53XCDXA',
    '20180606')


app.get('/api/search', jwtAuth, (req, res) => {



    const input = req.query.q;


    foursquare.venues.explore({
        near: input,
        limit: 4
    }, function (err, data) {
        if (err) {
            console.error('Error: ' + err);
        }
        if (data) {
            console.log(data);
            res.json(data)
        }
    });
});

app.get('/api/search-more', jwtAuth, (req, res) => {



    const input = req.query.venueId;


    foursquare.venues.venue(
        input,
        {
        limit: 2
        }, function (err, data) {
        if (err) {
            console.error('Error: ' + err);
        }
        if (data) {
            console.log(data);
            res.json(data)
        }
    });
});

app.get('/api/search-photos', jwtAuth, (req, res) => {



    const input = req.query.venueId;


    foursquare.venues.photos(
        input,
        {
        limit: 20
        }, function (err, data) {
        if (err) {
            console.error('Error: ' + err);
        }
        if (data) {
            console.log(data);
            res.json(data)
        }
    });
});






app.use("*", (req, res) => {
    return res.status(404).json({ message: "Not Found" });
});

// Referenced by both runServer and closeServer. closeServer
// assumes runServer has run and set `server` to a server object
let server;

function runServer(databaseUrl, port = PORT) {
    return new Promise((resolve, reject) => {
        mongoose.connect(
            databaseUrl,
            err => {
                if (err) {
                    return reject(err);
                }
                server = app
                    .listen(port, () => {
                    console.log(`Your app is listening on port ${port}`);
                    resolve();
                })
                    .on("error", err => {
                    mongoose.disconnect();
                    reject(err);
                });
            }
        );
    });
}

function closeServer() {
    return mongoose.disconnect().then(() => {
        return new Promise((resolve, reject) => {
            console.log("Closing server");
            server.close(err => {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
        });
    });
}

if (require.main === module) {
    runServer(DATABASE_URL).catch(err => console.error(err));
}

module.exports = { app, runServer, closeServer };