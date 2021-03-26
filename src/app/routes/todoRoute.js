module.exports = function(app){
    const todo = require('../controllers/todoController');
    const {verify} = require('../../../config/middlewares');

    app.post('/room/:roomId/todo/day',verify,todo.createDayTodo);
    app.post('/room/:roomId/todo/days',verify,todo.createDaysTodo);

    app.get('/room/:roomId/todo/day',verify,todo.getDayTodo);
    app.get('/room/:roomId/todo/days',verify,todo.getDaysTodo);

    app.put('/room/:roomId/todo/day',verify,todo.updateDayTodo);
    app.put('/room/:roomId/todo/days',verify,todo.updateDaysTodo);

    app.delete('/room/:roomId/todo/:todoId/day',verify,todo.deleteDayTodo);
    app.delete('/room/:roomId/todo/:todoId/days',verify,todo.deleteDaysTodo);

    app.delete('/room/:roomId/todo/day',verify,todo.deleteAllDayTodo);
    app.delete('/room/:roomId/todo/days',verify,todo.deleteAllDaysTodo);


    app.get('/room/:roomId/todo/day/search',verify,todo.getDaySearch);
    app.get('/room/:roomId/todo/days/search',verify,todo.getDaysSearch);

    app.get('/room/:roomId/todo/day/calendar',verify,todo.getDateSearch);

    app.post('/room/:roomId/todo/:todoId/complete',verify,todo.completeTodo);

    //오늘 할일 가져오기
    app.get('/room/:roomId/todo/today',verify,todo.getTodayTodo);

    // 콕찌를 멤버 가져오기
    app.get('/room/:roomId/todo/member',verify,todo.getCock);

    // 콕찌르기
    app.post('/room/:roomId/todo/:todoId/member/:memberId',verify,todo.postCock);
};