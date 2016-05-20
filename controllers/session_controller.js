var models = require('../models');
var Sequelize = require('sequelize');
var url = require('url');
var expirationTime = 2*60*1000;

// GET /session -- Formulario de login
exports.new = function(req,res,next){
	var redir = req.query.redir || (url.parse(req.headers.referer || "/").pathname);
	if (redir === '/session' || redir === '/users/new') { redir = "/"; }
	res.render('session/new', { redir: redir });
};

// POST /session -- Crear sesión si usuario ok
exports.create = function(req,res,next){
	var redir = req.body.redir || '/';
	var login = req.body.login;
	var password = req.body.password;
	authenticate(login, password).then(function(user){
		if(user){
			// Crear req.session.user y guardar campos id y username
			// La sesión se define por la existencia de: req.session.user
			req.session.user = { id:user.id, username:user.username, time:Date.now() + expirationTime };
			res.redirect("/");} // Redirección a la raíz 
		else{
			req.flash('error', 'La autenticación ha fallado. Reinténtelo otra vez.');
			res.redirect("/session?redir="+redir); }
	}).catch(function(error){
		req.flash('error', 'Se ha producido un error: ' +error);
		next(error); });
};

// DELETE /session -- Destruir sesión
exports.destroy = function(req,res,next){
	delete req.session.user;
	res.redirect("/session"); // Redirect a login
};

/* Autenticar un usuario si usuario está en tabla users
 * 
 * Devuelve promesa: busca usuario con login y password.
 * - Autenticación ok, devuelve objeto User con then(..)
 * - Autenticación falla, promesa satisfecha pero devuelve null
 */
var authenticate = function(login,password){
	return models.User.findOne({ where: { username:login }}).then(function(user){
		if (user && user.verifyPassword(password)){
			return user; }
		else{
			return null; }
	});
};

// Controlar si la sesión ha expirado y, en ese caso, borrarla
exports.deleteSession = function(req,res,next){
	if (req.session.user){
		if (req.session.user.time < Date.now()) {
			delete req.session.user; }
		else{
		req.session.user.time = Date.now() + expirationTime; } }
	next();
};

exports.loginRequired = function(req,res,next){
	if (req.session.user){
		next();}
	else{
		res.redirect('/session?redir=' + (req.param('redir') || req.url)); }
};
