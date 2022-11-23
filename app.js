const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");

const port = 3000;
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

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
    const apiKey = "7c47d451300fc0a76be853d4c9459966-us9";
    const url = `https://us9.api.mailchimp.com/3.0/lists/${listID}`;
    const options = {
        method: "POST",
        auth: `mohit1:${apiKey}`,
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
