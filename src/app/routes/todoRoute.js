module.exports = function(app){
    const todo = require('../controllers/todoController');
    const {verify} = require('../../../config/middlewares');

    app.post('/todo/day',verify,todo.createDayTodo);
    app.post('/todo/days',verify,todo.createDaysTodo);

    app.get('/room/:roomId/todo/day',verify,todo.getDayTodo);
    //app.get('/room/:roomId/todo/days',verify,todo.getDaysTodo);

};