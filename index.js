import express from "express";
import bodyParser from "body-parser";
import https from "https";
import { fileURLToPath } from 'url';
import {dirname, join} from 'path';
import * as dotenv from 'dotenv'
// Cofigure keys from .env file so that they can be accessed by process.env
dotenv.config()

const port = 3000;
const app = express();

// Setting __dirname due to new ES Module importing

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Setting up the static files in public directory so that they can be accessed in vercel deployment

app.use("/", express.static(join(__dirname + '/public')));

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", (req, res) => {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName,
                },
            },
        ],
    };

    const jsonData = JSON.stringify(data);
    const listID = "fc32b02294";
    const url = `https://us9.api.mailchimp.com/3.0/lists/${listID}`;
    const options = {
        method: "POST",
        auth: `mohit1:${process.env.API_KEY}`, // API Key saved in .env file
    };
    const request = https.request(url, options, (response) => {
        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html");
        } else {
            res.sendFile(__dirname + "/failure.html");
        }
        response.on("data", (data) => {
            console.log(JSON.parse(data));
        });
    });
    request.write(jsonData);
    request.end();
});

app.post("/failure", (req, res) => {
    res.redirect("/");
});

app.listen(process.env.PORT || port, () => console.log(`Server running on port ${port}`));
