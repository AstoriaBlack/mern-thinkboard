why do we need an .env file?

because if we update our sensitive info like jwt tokens or mongodb username passwords on github, anyone can see it. so .env file does not get uploaded to github and maintain the secretiveness