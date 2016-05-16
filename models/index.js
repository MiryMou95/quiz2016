var path = require('path');

// Cargar modelo ORM
var Sequelize = require('sequelize');

// Usar BBDD SQLite:
// DATABASE_URL = sqlite:///
// DATABASE_STORAGE = quiz.sqlite
// Usar BBDD Postgres:
// DATABASE_URL = postgres://user: passwd@host:port/database

var url, storage;

if(!process.env.DATABASE_URL){
	url = "sqlite:///";
	storage = "quiz.sqlite";}
else{
	url = process.env.DATABASE_URL;
	storage = process.env.DATABASE_STORAGE || "";}

var sequelize = new Sequelize(url, { storage: storage, omitNull: true });

// Importar la definición de la tabla Quiz de quiz.js
var Quiz = sequelize.import(path.join(__dirname, 'quiz'));

// Importar la definición de la tabla Comments de comment.js
var Comment = sequelize.import(path.join(__dirname,'comment'));

// Importar la definición de la tabla Users de user.js
var User = sequelize.import(path.join(__dirname,'user'));

// Relación 1 a N entre Quiz y Comment:
Comment.belongsTo(Quiz);
Quiz.hasMany(Comment);

// Relación 1 a N entre User y Quiz:
User.hasMany(Quiz, { foreignKey: 'AuthorId' });
Quiz.belongsTo(User, { as: 'Author', foreignKey: 'AuthorId' });


exports.Quiz = Quiz; // Exportar definición de la tabla Quiz
exports.Comment = Comment; // Exportar definición de la tabla Comments
exports.User = User; // Exportar definición de la tabla Users

