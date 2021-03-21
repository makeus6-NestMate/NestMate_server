const {fun1}=require('../../../config/functions');

exports.selectDayTodo=(roomId)=>{
    const query=`
    SELECT Todo.id AS todoId,todo,deadline
    FROM Todo INNER JOIN TodoTime ON Todo.id=TodoTime.todoId
    WHERE Todo.roomId=? AND deadline>=NOW();
    `
    const param=[roomId];
    return fun1(query,param); 
};

exports.selectDaysTodo=(roomId)=>{
    const query=`
    SELECT Todo.id AS todoId,todo,deadline
    FROM Todo INNER JOIN TodoRepeatTime ON Todo.id=TodoRepeatTime.todoId
    WHERE Todo.roomId=? 
    `
    const param=[roomId];
    return fun1(query,param); 
};

exports.selectDays=(todoId)=>{
    const query=`
    SELECT day
    FROM TodoRepeatDay
    WHERE todoId=? 
    `
    const param=[todoId];
    return fun1(query,param); 
};

exports.selectTodo=(todoId)=>{
    const query=`
    SELECT *
    FROM Todo
    WHERE id=?
    `
    const param=[todoId];
    return fun1(query,param); 
};



