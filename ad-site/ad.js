const express = require('express');
const app = express();
const port = 8001;
var path = require('path');
const cookieParser = require('cookie-parser');
const fs = require('fs');

app.use(cookieParser());
app.use(express.json());
const userBehaviors = [];

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

// API to get a session ID
app.get('/api/get-session-id', (req, res) => {
   
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
app.get('/api/get-personalized-ads', function (req, res) {
    
    if (!req.cookies['sessionID']) {
        console.log("Session ID not available and setting a new one");
        const sessionID = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        res.setHeader('Set-Cookie', 'sessionID=' + sessionID + '; SameSite=None; Secure; Path=/;');
    } else {
        console.log("Session ID is available");
    }
        
    // Specify the directory containing your files
    const directoryPath = __dirname + 'general-ads';
    const randomFileName = 'salesforce.png';
    fs.readdir(directoryPath, (err, files) => {
        
        if (err) {
            console.error('Error reading directory:', err);
        } else {
            // Filter out any subdirectories, leaving only file names
            const fileNames = files.filter(file => fs.statSync(`${directoryPath}/${file}`).isFile());
    
            // Pick a random file name
            const randomIndex = Math.floor(Math.random() * fileNames.length);
            randomFileName = fileNames[randomIndex];
    
            console.log('Randomly selected file:', randomFileName);
        }
    });
    res.sendFile(path.join(directoryPath + "/" + randomFileName));
});

//on getting a GET request, a cookie will be set if it does not exist yet, otherwise it will be logged
app.get('/banner', function (req, res) {
    
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
