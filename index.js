// imports /////////////////////////////////////////////////////////////////////

import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config({ path: "./config.env" });
import pg from "pg";

// constants ///////////////////////////////////////////////////////////////////

const app = express();
const port = 3000;
const openWeatherKey = process.env.OPEN_WEATHER_KEY;

const db = new pg.Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});


// structures //////////////////////////////////////////////////////////////////

function BlogPost(author, title, category, content) {
    this.author = author;
    this.title = title;
    this.category = category;
    this.content = content
    this.time = new Date().toLocaleString("en-US");
}

let blogPosts = [];
let categoryFilter = "None";
let user = null;
// ERROR: there can only be one user per session

// middleware //////////////////////////////////////////////////////////////////

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
db.connect();

// page requests ///////////////////////////////////////////////////////////////

// render the home page
app.get("/", (req, res) => {

    res.render("index.ejs", {blogPosts, categoryFilter, user});

});

// render the home page by link
app.post("/", (req, res) => {

    res.render("index.ejs", {blogPosts, categoryFilter, user});

});

// render sign in page
app.get("/signin", (req, res) => {

    res.render("signin.ejs", {user});

});

// render sign up page
app.get("/signup", (req, res) => {

    res.render("signup.ejs", {user});

});

// render account page
app.get("/manage-account", (req, res) => {

    res.render("account.ejs", {user});

});

// account functions ///////////////////////////////////////////////////////////

// creates an new account and checks for duplicate usernames
app.post("/create-account", async (req, res) => {

    const username = req.body["username"];
    const password = req.body["password"];
    const displayName = req.body["disp-name"];

    try {

        // check if username already taken
        const existingUsers = await db.query("SELECT user_id FROM users WHERE user_id = $1", [username]);

        if (existingUsers.rows.length > 0) {
            return res.render("signup.ejs", { error: "Username already taken", user });
        }

        // TODO: encrypt the password

        // add user data to db
        var query = "INSERT INTO users (user_id, password, name) VALUES ($1, $2, $3)";
        var values = [username, password, displayName];

        await db.query(query, values);

        res.render("signin.ejs", {user}); 

    } catch (err) {

        console.error("error executing query", err.stack);
        res.render("signup.ejs", {user});
    }

});

// logs the user in when entering correct username and password
app.post("/access-account", async (req, res) => {

    const username = req.body["username"];
    const password = req.body["password"];

    // TODO: unencrypt the password

    // check if valid username and password
    var correctInformation = await db.query("SELECT user_id FROM users where user_id = $1 AND password = $2", [username, password]);

    if(correctInformation.rows.length === 0){
        return res.render("signin.ejs", { error: "Incorrect username or password", user });
    }

    // set user account and render blog page
    user = username;
    res.render("index.ejs", {blogPosts, categoryFilter, user})
});

// sign the user out of the account
app.post("/signout", (req, res) => {

    user = null;
    res.render("index.ejs", {blogPosts, categoryFilter, user});

});

// modify the display name and password
app.post("/change-account", (req, res) => {

    //TODO: change the display name and password (cannot change username)

});

// delete current account and all related posts
app.post("/delete-account", (req, res) => {

    // TODO: delete the account on the DB and their posts

});

// blog functions //////////////////////////////////////////////////////////////

// make a new blog post
app.post("/new", (req, res) => {

    var blogPost = new BlogPost(req.body["author"], req.body["title"],
                                     req.body["category"], req.body["content"]);
    blogPosts.push(blogPost);
    res.redirect("/");

});

// delete a blog post
app.post("/delete", (req, res) => {

    blogPosts.splice(Number(req.body["blogNum"]), 1);
    res.redirect("/");

});

// edit a blog post
app.post("/edit", (req, res) => {

    var blogIndex = Number(req.body["blogNum"]);
    res.render("edit.ejs", {blogPosts, blogIndex});

});

// update the blog post from edit
app.post("/update", (req, res) => {

    blogPosts.splice(Number(req.body["blogNum"]), 1);
    var blogPost = new BlogPost(req.body["author"], req.body["title"],
                                     req.body["category"], req.body["content"]);
    blogPosts.push(blogPost);
    res.redirect("/");

});

// filter blog based on sections
app.post("/filter", (req, res) => {

    categoryFilter = req.body["category"];
    res.redirect("/");

});

// API requests ////////////////////////////////////////////////////////////////

// request current weather via openweathermap
app.post("/weather", async (req, res) => {

    try {
        const lat = req.body.lat;
        const lon = req.body.lon;
        
        if(lat == null) {
            throw new Error("Missing lat or lon");
        }

        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${openWeatherKey}`);
        const result = response.data;
        const temp = result.main.temp;
        const tempMin = result.main.temp_min;
        const tempMax = result.main.temp_max;
        const humidity = result.main.humidity;
        const weatherMain = result.weather[0].main;
        const weatherDescription = result.weather[0].description;
        const weatherIcon = result.weather[0].icon;

        res.render("weather.ejs", {temp, tempMin, tempMax, humidity, weatherMain, weatherDescription, weatherIcon, user});
        
    } catch (error) {
        res.render("weather.ejs", {error, user});
    }

});

// listening log ///////////////////////////////////////////////////////////////

app.listen(port, () => {

    console.log(`Listening on http://localhost:${port}`);

});

////////////////////////////////////////////////////////////////////////////////