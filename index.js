// imports /////////////////////////////////////////////////////////////////////
import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config({ path: "./config.env" });

// constants ///////////////////////////////////////////////////////////////////
const app = express();
const port = 3000;
const openWeatherKey = process.env.OPEN_WEATHER_KEY;

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

// page requests ///////////////////////////////////////////////////////////////

// mount preprocessing middleware
app.use(bodyParser.urlencoded({ extended: true }));

// access static files in public folder
app.use(express.static("public"));

// render the home page
app.get("/", (req, res) => {
    res.render("index.ejs", {blogPosts, categoryFilter});
});

// render the home page by link
app.post("/", (req, res) => {
    res.render("index.ejs", {blogPosts, categoryFilter});
});

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

        res.render("weather.ejs", {temp, tempMin, tempMax, humidity, weatherMain, weatherDescription, weatherIcon});

        
    } catch (error) {
        res.render("weather.ejs", {error});
    }
});

// listening log ///////////////////////////////////////////////////////////////
app.listen(port, () => {
    console.log(`Listening on port ${port}.`);
});

////////////////////////////////////////////////////////////////////////////////