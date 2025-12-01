import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import notesRoutes from './routes/notesRoutes.js';
import { connectDB } from './config/db.js';

//const express = require("express") this and the above line are the same
//they are just different syntaxes
//if we wannna use the import syntax we need to add "type": "module" in package.json

import rateLimiter from './middleware/rateLimiter.js';

//?this is used to load environment variables from a .env file into process.env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;
//what this port line does is if there is a port defined in the environment variable use that otherwise use 5001

//middleware to parse json bodies
//it allows us to get access to req.body in controllers
app.use(express.json()); 
//?this middleware will parse json bodies: req.body basically

//?using cors middleware this shud be placed before the rateLimiter middleware
//because we want to handle CORS before rate limiting
app.use(cors({
    origin: "http://localhost:5173",
}));

//?our custom middleware to log request method and url
//* app.use((req, res, next) => {
//*    console.log(`Req method is ${req.method} & Req URL is ${req.url}`);
//*    next(); 
    // this is used to pass control to the next middleware function
    //in this case it will pass control to the route handler
    //so after sending a request this will occur b4 the said request in routes
//});
//TODO: famous middleware usecase is authentication, when we try to log, its actually middleware that checks if we are logged in or not
//TODO: Rate limiting is controlling how often someone can do something like making requests to our api
//*as in making api requesting too much, or refreshing too much like that
//for this project we use upstash library for rate limiting

//?using our rate limiter middleware
app.use(rateLimiter);

//?since /api/notes appears in all routes we can create a middleware
app.use("/api/notes", notesRoutes);

//*creating a route
// app.get("/api/notes", (req, res) => {
    //*send the notes
    // res.status(200).send("You got 25 ~notes");
    //?this is an endpoint
    //?an endpoint is a combination of a url and an http method 
    //?that lets a client interact with a specific resource on a server
// });

// app.post("/api/notes", (req, res) => {
//     res.status(201).json({message:"post created succesfully"});
// });
//?if we use get it means we are fetching something  
//?if we use post it means we are creating something
// app.put("/api/notes/:id", (req, res) => {
//     res.status(200).json({message:"post updated succesfully"});
// });

// app.delete("/api/notes/:id", (req, res) => {
//     res.status(200).json({message:"note deleted succesfully"});
// });
//!since this method is generating not reusable long lines, we can use express router
//*go to noteRoutes file to find these


//once database is connected start the server
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server started on PORT: ${PORT}`);
    });
});


