const {fun1}=require('../../../config/functions');

exports.selectDayTodo=(roomId)=>{
    const query=`
    SELECT Todo.id,todo,deadline
    FROM Todo INNER JOIN TodoTime ON Todo.id=TodoTime.todoId
    WHERE deadline>=NOW();
    `
    const param=[roomId];
    return fun1(query,param); 
};
