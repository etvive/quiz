var models = require('../models/models.js');

// Autoload - factoriza el codigo si ruta incluye :quizId
exports.load = function(req, res, next, quizId){
	models.Quiz.find(quizId).then(
		function(quiz){
			if(quiz){
				req.quiz = quiz;
				next();
			} else{ next(new Error('No existe quizId=' + quizId));}
		}
	).catch(function(error){next(error);});
}

// GET /quizes
exports.index = function(req, res){
	if(req.query.search) {
		var filtro  = (req.query.search || '').replace(" ", "%");
		models.Quiz.findAll({where:["pregunta like ?", '%'+filtro+'%'],order:'pregunta ASC'}).then(function(quizes){
		res.render('quizes/index', {quizes: quizes, search: req.query.search});
		}).catch(function(error) { next(error);});
	} else {
		models.Quiz.findAll().then(function(quizes){
		res.render('quizes/index', {quizes: quizes, search: 'texto a buscar'});
		}).catch(function(error) { next(error);});
	}
};


// GET //quizes/:id
exports.show = function(req, res){
	res.render('quizes/show', {quiz: req.quiz});
};

//GET /quizes/:id/answer
exports.answer = function(req, res){
	var resultado = 'Incorrecto';
	if (req.query.respuesta === req.quiz.respuesta){
		resultado = 'Correcto';
		res.render('quizes/answer', {quiz: req.quiz, respuesta: 'Correcto'});
	}
	res.render('quizes/answer', {quiz: req.quiz, respuesta: resultado});
};

//GET /author)
exports.author = function(req, res){
	res.render('author', {});
};

// GET /quizes/new
exports.new = function(req, res){
	var quiz = models.Quiz.build(//crea objeto quiz
		{pregunta: "Pregunta", respuesta: "Respuesta"}
	);
	res.render('quizes/new', {quiz: quiz});
};

// POST /quizes/create
exports.create = function(req, res){
	var quiz = models.Quiz.build(req.body.quiz);
	
	// guarda en DB los campos pregunta y respuesta del quiz
	quiz.save({fields:["pregunta", "respuesta"]}).then(function(){
		res.redirect('/quizes');
	}) // redirección HTTP (URL relativo) lista de preguntas
};