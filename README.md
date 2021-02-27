# Reactory #
* Full stack website: https://samd.herokuapp.com/
## Specifications: ##
* Supports user registration, login and logout.
* Salted and hashed passwords are saved into PostgreSQL database.
* Room system for playing [Okey](https://en.wikipedia.org/wiki/Okey).
* Play another Okey when current game finished.
* Points are decreased from player when the player won the game.
* Supports real-time chat system and ready player records.
* Shows active rooms to join.
## Dependencies: ##
* React
* Express
* pg
* socket.io
* jsonwebtoken
* bcrypt
* and more
## Run: ##
* `npm install && npm start` for running server, `cd client && npm install && npm start` for running client and go to http://localhost:3000/. 
* `cd client && npm install && npm run build` then `cd .. && npm start` for only running server and hosting static files and go to http://localhost:4000/.
## Environment Variables: ##
* Create `.env` file in the root directory and fill these:
   1. SESSION_SECRET
   1. DATABASE_URL
   1. TOKEN_SECRET
## Design: ##
* [@ogoregen](https://github.com/ogoregen) and me.
## Images: ##
<table>
    <tr>
        <td align="center">
            <img src="https://github.com/ssduman/reactory/blob/master/img/02_homepage-2.jpg" alt="home-page" width="384" height="216">
            <br />
            <i> rooms </i>
        </td>
        <td align="center">
            <img src="https://github.com/ssduman/reactory/blob/master/img/03_okey-1.jpg" alt="play-okey" width="384" height="216">
            <br />
            <i> started </i>
        </td>
    </tr>
    <tr>
        <td align="center">
            <img src="https://github.com/ssduman/reactory/blob/master/img/04_okey-2.jpg" alt="play-okey" width="384" height="216">
            <br />
            <i> playing </i>
        </td>
        <td align="center">
            <img src="https://github.com/ssduman/reactory/blob/master/img/05_finish-1.jpg" alt="finish-okey" width="384" height="216">
            <br />
            <i> finish first game </i>
        </td>
    </tr>
    <tr>
        <td align="center">
            <img src="https://github.com/ssduman/reactory/blob/master/img/08_gosterge-1.jpg" alt="gosterge" width="384" height="216">
            <br />
            <i> playing second game and show gosterge </i>
        </td>
        <td align="center">
            <img src="https://github.com/ssduman/reactory/blob/master/img/10_amongturrets.jpg" alt="among-turrets" width="384" height="216">
            <br />
            <i> another game </i>
        </td>
    </tr>
</table>

### Bugs and Limitations: ###
* Due to free version of Heroku, the site waking up like in 30 seconds if sleeping for the first time.
* Sometimes unexpected things happen like not joining the room again. I think this is due to delay on sockets.
* Calculating gosterge is bugged. All posibilities and finishing with cifte (see Wikipedia) are not covered. If per count is equal or higher than 9, player can finish the game. 
* If no tiles left on middle, the rules says that all tiles in the table will be shuffle and put in the middle. However, I didn't implement this.
* Home, about, blog and drawing board are placeholders. I'm planning to add real blog and drawing systems and fill sections.
* System depends on url. https://samd.herokuapp.com/# can broke the joining to room or other system.
