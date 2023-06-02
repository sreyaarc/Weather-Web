import * as dotenv from "dotenv";
import {fileURLToPath} from "url";
import {dirname} from "path";
import path from "path";
import https from "https";

const __fileName = fileURLToPath(import.meta.url);
const __dirname = dirname(__fileName);

dotenv.config({path: path.resolve(__dirname+"/.env")});

import express from "express";
const app = express();

app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
    res.sendFile(__dirname+"/index.html")
})

const apiKey = process.env.API_KEY;
const baseUrl = "https://api.openweathermap.org/data/2.5/weather?";


app.post("/", (req, res) => {
    const url = `${baseUrl}q=${req.body.inputCity}&appid=${apiKey}&units=metric`
    
    https.get(url, (response) => {
        response.on("data", (d) => {
            const parsedData = JSON.parse(d);
            // res.send(parsedData);
            const imgURL = `https://openweathermap.org/img/wn/${parsedData.weather[0].icon}@2x.png`

            res.render("weather", {
                location: parsedData.name,
                country: parsedData.sys.country,
                imgSrc: imgURL,
                temperature: parsedData.main.temp,
                mainDesc: parsedData.weather[0].main,
                subDesc: parsedData.weather[0].description,
                humidityCond: parsedData.main.humidity,
                windCond: parsedData.wind.speed 
            })
        })
    })

})

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log("Server started running at "+port)
})