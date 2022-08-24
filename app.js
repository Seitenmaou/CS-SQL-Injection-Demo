
// Require
const http = require(`http`),
path = require(`path`),
express = require(`express`),
bodyParser = require(`body-parser`);
const sqlite3 = require(`sqlite3`).verbose();
const app = express();
app.use(express.static(`.`))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

//Create temp database?
//===========CONTAINES AUTH=============
const db = new sqlite3.Database(`:memory:`);
db.serialize(() => {
 db.run(`CREATE TABLE user ("username" TEXT, "password" TEXT, "title" TEXT)`);
 db.run(`INSERT INTO user VALUES ("authUser", "authPass", "Admin")`);
});

//Default page
app.get('/',  (req, res) =>  {
    res.sendFile('index.html');
});

//Login POST
app.post('/login', function (req, res) {
	var username = req.body.username;
	var password = req.body.password;

	//sends query that matches username and password
	var query = "SELECT title FROM user WHERE username = '" + username + "' AND password = '" + password + "'";

	//CONSOLE LOG
	console.log("username: " + username);
	console.log("password: " + password);
	console.log('query: ' + query);

	//redirect
	//if error, error
	//else if incorrect auth. unauth
	//else if correct, send back html
	db.get(query, (err, row) => {
		if (err) {
			console.log(`ERROR`, err);
			res.redirect(`/index.html#error`);
		} else if (!row) {
			res.redirect(`/index.html#unauthorized`);
		} else {
			res.send(`Hello <b>` + row.title + `!</b><br /> 
			This file contains all your secret data: <br /><br /> 
			SECRETS <br /><br /> MORE SECRETS <br /><br /> 
			<a href="/index.html">Go back to login</a>`);
		}
	});
	

});

app.listen(3000);