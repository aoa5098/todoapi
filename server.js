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
	var matchedTodo = _.findWhere(todos, {
		id: todoID
	});
	var body = _.pick(req.body, 'description', 'completed');
	var validAttributes = {};

	if (!matchedTodo) {
		return res.status(404).send();
	}

	if (body.hasOwnProperty('completed') && _.isBoolean(body.completed)) {
		validAttributes.completed = body.completed;
	} else if (body.hasOwnProperty('completed')) {
		return res.status(400).send();
	} else {
		console.log('No valid attribute provided');
	}

	if (body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length === 0) {
		validAttributes.description = body.description;
	} else if (body.hasOwnProperty('description')) {
		return res.status(400).send();
	} else {
		console.log('No valid attribute provided');
	}

	_.extend(matchedTodo, validAttributes);
	res.json(validAttributes);
});


db.sequelize.sync().then(function () {
		app.listen(PORT, function() {
			console.log('Express listen on port ' + PORT);
	});
});

