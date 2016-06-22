var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var db = require('./db.js')

var app = express();
var PORT = process.env.PORT || 3000;
var todos = [];
var todoNextID = 1;

app.use(bodyParser.json());

//GET /todos?completed=true
app.get('/', function(req, res) {
	res.send('TODO API Root');
});

app.get('/todos', function(req, res) {
	var query = req.query;
	var where = {};

	if (query.hasOwnProperty('completed') && query.completed ==='true') {
		where.completed = true;
	} else if (query.hasOwnProperty('completed') && query.completed === 'false') {
		where.completed = false;
	}

	if (query.hasOwnProperty('q') && query.q.length > 0) {
		where.description = {
			$like: '%' + query.q + '%'
		};
	}

	db.todo.findAll({where: where}).then(function() {
		res.json(todos);
	})
});

//GET /todos/:id
app.get('/todos/:id', function(req, res) {
	var todoID = parseInt(req.params.id, 10);
	db.todo.findByID(todoID).then(function (todo) {
		req.json(todo.toJSON());
	}, function (e) {
		req.status(400).json(e);
	});
});

app.post('/todos', function(req, res) {
	var body = _.pick(req.body, 'description', 'completed');
		db.Todo.create(body).then(function (todo) {
			if (todo) {
				res.json(todo.toJSON());
			} else {
				res.status(404).send();
			}
		}, function (e) {
			res.status(500).send();
		});
	});



app.delete('/todos/:id,', function(req, res) {
	var todoID = parseInt(req.params.id, 10);
	db.todo.destroy({
		where: {
			id: todo.id
		}
	}).then(function (rowsDeleted) {
		if (rowsDeleted === 0) {
			res.status(404).json({
				error: 'No todo with id'
			});
		} else {
			res.status(204).send();
		}
	}, function () {
		res.status(500).send();
	});
});

// PUT /todos/:id
app.put('/todos/:id', function(req, res) {
	var todoID = parseInt(req.params.id, 10);
	var body = _.pick(req.body, 'description', 'completed');
	var attributes = {};

	if (body.hasOwnProperty('completed')) {
		attributes.completed = body.completed;
	} 

	if (body.hasOwnProperty('description')) {
		attributes.description = body.description;
	}

	db.todo.findByID(todoID).then(function (todo) {
		if (todo) {
			todo.update(attributes).then(function(todo) {
				res.json(todo.tojSON());
			}, function (e) {
				res.status(400).json(e); 
			});
		} else {
			res.status(404).send();
		}
	}, function () {
		res.status(500).send();
	});
});

app.post('/users', function(req, res) {
	var body = _.pick(req.body, 'email', 'password');
	db.user.create(body).then(function (user) {
		res.json(todo.toPublicJSON());
		}, function (e) {
			res.status(400).json(e);
	});
});

db.sequelize.sync().then(function () {
		app.listen(PORT, function() {
			console.log('Express listen on port ' + PORT);
	});
});

