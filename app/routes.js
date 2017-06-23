module.exports = function (app, passport) {

	//Debug
	var util = require('util');

	//Pagina inicial
	app.get('/', function (req, res) {
		res.render('index.ejs');
	});

	// mostra formulario de login
	app.get('/login', function (req, res) {

		res.render('login.ejs', { message: req.flash('loginMessage') });
	});

	// login form
	app.post('/login', passport.authenticate('local-login', {
		successRedirect: '/profile',
		failureRedirect: '/login',
		failureFlash: true
	}));

	// registro login local
	app.get('/signup', function (req, res) {
		res.render('signup.ejs', { message: req.flash('signupMessage') });
	});


	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect: '/profile',
		failureRedirect: '/signup',
		failureFlash: true
	}));


	app.get('/profile', isLoggedIn, function (req, res) {


		var request = require('request');

		// Set the headers
		var headers = {
			'User-Agent': 'Super Agent/0.0.1',
			'Content-Type': 'application/x-www-form-urlencoded'
		}

		// Configure the request
		var options = {
			url: 'http://localhost:5000/spotteds',
			method: 'GET',
			headers: headers,
			//form: { 'key1': 'xxx', 'key2': 'yyy' }
		}



		// Start the request
		request(options, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				console.log(body);
				res.render('profile.ejs', {
					user: req.user,
					spotteds: JSON.parse(body)
				});
			}
		});



	});

	app.post('/profile/spotted/new', isLoggedIn, function (req, res) {
		var request = require('request');
		console.log(req);
		// Set the headers
		var headers = {
			'User-Agent': 'Super Agent/0.0.1',
			'Content-Type': 'application/x-www-form-urlencoded'
		}

		// Configure the request
		var options = {
			url: 'http://localhost:5000/spotteds',
			method: 'POST',
			headers: headers,
			form: req.body
		}

		request(options, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				console.log(response);
			}
		});

	});

	app.post('/profile', isLoggedIn, function (req, res) {





		res.render('profile.ejs', {
			user: req.user,
			//	spotteds: req.spotted
		});
	});


	app.get('/auth/facebook', passport.authenticate('facebook', { scope: 'email' }));

	app.get('/auth/facebook/callback',
		passport.authenticate('facebook', {
			successRedirect: '/profile',
			failureRedirect: '/'
		}));

	app.get('/logout', function (req, res) {
		req.logout();
		res.redirect('/');
	});
};

function isLoggedIn(req, res, next) {

	if (req.isAuthenticated())
		return next();

	res.redirect('/');
}
