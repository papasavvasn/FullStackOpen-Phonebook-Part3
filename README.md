The app is deployed at:  https://fullstack-open-part-3.herokuapp.com/ 

The code of the client is at: ../Parts_0-2/exercises/part2/phonebook
or https://github.com/papasavvasn/FullStackOpenParts0-2

You can run the app in dev mode with `npm run dev` or in normal local mode with `npm start`

To build production bundles of the client and server: `npm run build:all`  
To do a simple deploy to Heroku: `npm run deploy`
The command `npm run deploy:full` builds the client and server, commits to github with the message `build client and server' and deploy to heroku` and deploys to Heroku

Notes: to set an env variable to HEROKU do: `heroku config set:"url of database"`
