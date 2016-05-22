var express = require('express');
var router = express.Router();
var quizController = require('../controllers/quiz_controller');
var commentController = require('../controllers/comment_controller');
var userController = require('../controllers/user_controller');
var sessionController = require('../controllers/session_controller');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

// Autoload de parametros
router.param('quizId', quizController.load); // autoload :quizId
router.param('userId', userController.load); // autoload :userId
router.param('commentId', commentController.load); // autoload :commentId

router.get('/author', function(req, res, next){
  res.render('author',{author: 'Miriam Mouriño Fernández'});
});


// Definición de rutas de /quizzes
router.get('/quizzes.:format?', quizController.index);
router.get('/quizzes/:quizId(\\d+).:format?', quizController.show);
router.get('/quizzes/:quizId(\\d+)/check', quizController.check);
router.get('/quizzes/new', sessionController.loginRequired, quizController.new);
router.post('/quizzes', sessionController.loginRequired, quizController.create);
router.get('/quizzes/:quizId(\\d+)/edit', sessionController.loginRequired, quizController.ownershipRequired, quizController.edit);
router.put('/quizzes/:quizId(\\d+)', sessionController.loginRequired, quizController.ownershipRequired, quizController.update);
router.delete('/quizzes/:quizId(\\d+)', sessionController.loginRequired, quizController.ownershipRequired, quizController.destroy);

// Definición de rutas de comentarios
router.get('/quizzes/:quizId(\\d+)/comments/new', sessionController.loginRequired, commentController.new);
router.post('/quizzes/:quizId(\\d+)/comments', sessionController.loginRequired, commentController.create);
router.put('/quizzes/:quizId(\\d+)/comments/:commentId(\\d+)/accept', sessionController.loginRequired, quizController.ownershipRequired, commentController.accept);

// Definición de rutas de cuenta
router.get('/users', userController.index); // Listado usuarios
router.get('/users/:userId(\\d+)', userController.show); // Ver un usuario
router.get('/users/new', userController.new); // Formulario sign in
router.post('/users', userController.create); // Registrar usuario
router.get('/users/:userId(\\d+)/edit', sessionController.loginRequired, sessionController.adminOrMyselfRequired, userController.edit);
router.put('/users/:userId(\\d+)', sessionController.loginRequired, sessionController.adminOrMyselfRequired, userController.update);
router.delete('/users/:userId(\\d+)', sessionController.loginRequired, sessionController.adminAndNotMyselfRequired, userController.destroy);

router.get('/session', sessionController.new); // Formulario login
router.post('/session', sessionController.create); // Crear sesión
router.delete('/session', sessionController.destroy); // Destruir sesión

module.exports = router;
