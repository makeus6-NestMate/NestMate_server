module.exports = function(app){
    const todo = require('../controllers/todoController');
    const {verify} = require('../../../config/middlewares');

    app.post('/todo/day',verify,todo.createDayTodo);
};