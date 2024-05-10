const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");

const app = express();
dotenv.config();

const port = process.env.PORT || 3000;

const username = process.env.MONGODB_USERNAME;
const password = process.env.MONGODB_PASSWORD;

mongoose.connect(`mongodb+srv://${username}:${password}@cluster0.kph1xcf.mongodb.net/registrationFromDb`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// registration schema
const registrationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

// model of registration schema
const Registration = mongoose.model("Registration", registrationSchema);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/pages/index.html");
});

app.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await Registration.findOne({ email: email });
        if (existingUser) {
            // User already exists, so redirect to error page
            console.log("User already exists");
            res.redirect("/error");
        } else {
            // User does not exist, so proceed with registration
            const registrationData = new Registration({
                name,
                email,
                password
            });
            await registrationData.save();
            res.redirect("/success");
        }
    } catch (error) {
        // Handle the error appropriately, for example:
        console.error(error);
        res.status(500).send("An error occurred while registering.");
    }
});

app.get("/success", (req,res)=>{
    res.sendFile (__dirname+"/pages/success.html");
});

app.get("/error", (req,res)=>{
    res.sendFile (__dirname+"/pages/error.html");
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
