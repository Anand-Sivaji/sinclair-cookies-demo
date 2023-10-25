const express = require('express');
const app = express();
const port = 8001;
var path = require('path');
var cookieParser = require('cookie-parser');

app.use(cookieParser());
app.use(express.json());
const userBehaviors = [];
var hits = 0;

app.get('/', (req, res) => res.send('Hello World!'))

// API to get a session ID
app.post('/api/get-session-id', (req, res) => {
   
    if (!req.cookies['sessionID']) {

        // Generate a session ID (you can replace this with a more robust method)
        const sessionID = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        res.setHeader('Set-Cookie', 'sessionID=' + sessionID + '; SameSite=None; Secure; Path=/; Partitioned;');
        res.json({ sessionID });
    }
});

// API to post user behavior data
app.post('/api/track-user-behavior', (req, res) => {
    const behaviorData = req.body;

    // Store user behavior data in memory
    userBehaviors.push(behaviorData);

    res.json({ message: 'User behavior data received and stored.' });
});

// API to get personalized ads based on the session ID
app.get('/api/get-personalized-ads', (req, res) => {
    
    const ad = 'This is a general ad for you!';
    // Retrieve the session ID from the request query or headers
    if (!req.cookies['sessionID']) {
        const sessionID = req.cookies['sessionID'];

        // In a real system, you would analyze user behavior data to serve personalized ads
        // Here, we'll just return a dummy ad
        const ad = 'This is a personalized ad for you!';
    } 
    res.json({ ad });
});

//on getting a GET request, a cookie will be set if it does not exist yet, otherwise it will be logged
app.get('/banner', function (req, res) {
    
    hits++;
    if (!req.cookies['ad-site-cookie']) {

        var cookievalue = req.query.location ? req.query.location : "default";
        res.setHeader('Set-Cookie', 'ad-site-cookie=' + cookievalue + '; SameSite=None; Secure; Path=/; Partitioned;');
        
        const sessionID = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        res.setHeader('Set-Cookie', 'sessionID=' + sessionID + '; SameSite=None; Secure; Path=/; Partitioned;');

        if (req.query.location == 'default') {
            res.sendFile(path.join(__dirname + "/default.png"))
        } else {
            res.sendFile(path.join(__dirname + "/sponser.png"));
        }
    } else {
        
        if (req.query.location != 'default') {
            var cookievalue = req.query.location ? req.query.location : "default";
            res.setHeader('Set-Cookie', 'ad-site-cookie=' + cookievalue + '; SameSite=None; Secure; Path=/; Partitioned;');
        }
        if (req.cookies['ad-site-cookie'] == 'default') {
            res.sendFile(path.join(__dirname + "/default.png"))
        } else {
            res.sendFile(path.join(__dirname + "/sponser.png"));
        }
        
        console.log(req.cookies);
    }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
