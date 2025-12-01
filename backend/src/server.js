import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path'; //this is a build-in node module
//no need to install it
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
const __dirname = path.resolve();
//?this is used to get the current directory name in ES modules
//since __dirname is not available in ES modules by default
//we use path.resolve() to get the absolute path of the current directory

//middleware to parse json bodies
//it allows us to get access to req.body in controllers
app.use(express.json()); 
//?this middleware will parse json bodies: req.body basically

//?using cors middleware this shud be placed before the rateLimiter middleware
//because we want to handle CORS before rate limiting

//lets check if it's in development mode
if (process.env.NODE_ENV !== "production") {
    app.use(
        cors({
             origin: "http://localhost:5173",
}));
}


//!important note, when we r deploying this, and get frintend and backend on a same domain,
//we will need to change the cors origin to that domain
//since cors errors basically happen when the frontend and backend r on different domains
//so when deploying make sure to update the origin accordingly

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

//?we are use a different middleware to serve static files in production

//the if condition checks if we are in production mode
//by checking the NODE_ENV environment variable is set to "production"
if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname,"../frontend/dist")));
    //this serves the static asset from the frontend's dist folder
    //serve out optimized react application
    //path.join is used to create a path that works across different operating systems
    
    //TODO, in simple terms, this says to go to frontend's dist folder and serve the static files there
    
    //*if there is anything that does not match the api routes, we will serve the frontend application
    //this is for handling client side routing in react
    //?so basically if the user tries to access a route like /note/123, the backend will serve the react app
    //?and then react router will take over and render the correct page based on the route
    //since we only have api routes defined in the backend
    //any other route should serve the react app
    
    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
        //this will send the index.html file for any route not handled by the api routes
        //so react router can handle the routing on the client side
    });
}

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


