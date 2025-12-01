why do we need an .env file?

because if we update our sensitive info like jwt tokens or mongodb username passwords on github, anyone can see it. so .env file does not get uploaded to github and maintain the secretiveness

also, watch https://www.youtube.com/watch?v=F9gB5b4jgOI especially the deployment part to clarify how we run this b4 really deploying

transcript on that part:

Okay. So the first thing we have done is to add the package JSON under the root so that we can add the build command. So
we need to install the dependencies for the back end as well as the front end. Now why this is the case? because in
GitHub we don't really have we don't really have those node modules right so render cannot see those so for that reason we will say hey render go ahead and install the dependencies and then just build the front- end application so that you can get the optimized version of the react app and once you have done this you can start the app by running this command under the back end and then under the back end under the server.js we have added this configuration where we said if we are in the production environment go ahead serve the react application as the static assets and then if they visit any route
other than the API just go ahead uh render the react app so that if we visit localhost 5001 instead of getting only that preety print api we will get the react app as well. Okay and then we also get rid of the CORS configuration in the production because now we have only one domain.

in .env, we hv,MONGO_URI, PORT, UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN,NODE_ENV