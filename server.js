var express = require('express');
var bodyParser = require('body-parser');

var app = express();
var PORT = process.env.PORT || 3000;
//add body to todos array, add id to todo array 
var todos = [];
var todoNextID = 1;

app.use(bodyParser.json());

app.get('/', function (req, res) {
	res.send('TODO API Root');
});

app.get('/todos', function (req, res) {
	res.json(todos);
});

app.get('/todos/:id', function (req, res) {
	var todoID = parseInt(req.params.id, 10);
	var matchedTodo;

	todos.forEach(function(todo) {
	if (todoID === todo.id) {
		matchedTodo = todo;
	} 
});

	if (matchedTodo) {
		res.json(matchedTodo);
	} else {
		res.status(404).send();
	}
});

app.post('/todos', function (req, res) {
	var body = req.body;

	body.id = todoNextID++;

	todos.push(body);

	//add id field
	//push body into array

	res.json(body);
});


app.listen(PORT, function () {
	console.log('Express listen on port ' + PORT);
})