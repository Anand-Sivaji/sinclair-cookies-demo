const express = require('express');
const app = express();
const port = 8001;
var path = require('path');
const cookieParser = require('cookie-parser');
const fs = require('fs');
const cors = require('cors');

app.use(cookieParser());
app.use(express.json());


// Define an array of allowed origins
const allowedOrigins = [
    'http://localhost:3001',
    'http://54.226.245.143:3001',
    'http://54.226.245.143:3002',
    'http://54.158.247.205:3002'
];

// Enable CORS with the array of allowed origins
app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));

let userBehaviors = [];

app.get('/', (req, res) => res.send('Hello World!'))

// API to get a session ID
app.post('/api/get-session-id', (req, res) => {
   
    if (!req.cookies['partitionedSessionID']) {

        // Generate a session ID (you can replace this with a more robust method)
        const sessionID = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        res.setHeader('Set-Cookie', 'partitionedSessionID=' + sessionID + '; SameSite=None; Secure; Path=/; Partitioned;');
        res.json({ partitionedSessionID });
    }
});

// API to post user behavior data
app.post('/api/track-user-behavior', (req, res) => {
    
    console.log("Request Body");
    console.log(req.body);
    
    var sessionID;
    if (!req.cookies['partitionedSessionID']) {
        console.log("Session ID is not available");
        return res.json({ message: 'User behavior data received and stored.' });
    }

    console.log("Storing the user behavior for Session ID" + req.cookies['partitionedSessionID']);
    const behaviorData = {
        sessionID: req.cookies['partitionedSessionID'],
        behaviorData: req.body
    }
    console.log("User Behavior");
    console.log(behaviorData)
    // Store user behavior data in memory
    userBehaviors.push(behaviorData);
    console.log("Added User Behavior");
    console.log(userBehaviors);

    res.json({ message: 'User behavior data received and stored.' });
});

// API to get personalized ads based on the session ID
app.get('/api/get-personalized-ads', function (req, res) {
    
    var directoryPath = __dirname + '/General Ads';
    var randomFileName = 'salesforce.png';

    // Specify the directory containing your files
    if (!req.cookies['partitionedSessionID']) {
        console.log("Session ID not available and setting a new one");
        const sessionID = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        res.setHeader('Set-Cookie', 'partitionedSessionID=' + sessionID + '; SameSite=None; Secure; Max-Age=86400; Path=/; Partitioned;');
    } else {
        const sessionID = req.cookies['partitionedSessionID'];
        console.log("Session ID is available" + sessionID);
        const productNames = getProductNamesForSessionIDs(sessionID);
        const randomIndex = Math.floor(Math.random() * productNames.length);
        directoryPath = (productNames.length == 0) ? directoryPath : __dirname + '/' + productNames[randomIndex];
    }
        
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

            res.sendFile(path.join(directoryPath + "/" + randomFileName));
        }
    });
    
});

// Function to filter and extract product IDs
function getProductNamesForSessionIDs(sessionID) {

    const currentTime = new Date(); // Get the current time
    const twentyFourHoursAgo = new Date(currentTime - 24 * 60 * 60 * 1000); // Calculate 24 hours ago
  
    const filteredData = userBehaviors.filter((entry) => {
      return (
        entry.sessionID === sessionID &&
        new Date(entry.behaviorData.timestamp) >= twentyFourHoursAgo
      );
    });
  
    const productNames = [...new Set(filteredData.map((item) => item.behaviorData.productName))];

    console.log(productNames);
    return productNames;
  }

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
