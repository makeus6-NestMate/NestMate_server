const {fun1}=require('../../../config/functions');

// 마감일이 지나지않고 완료 안된 하루 할일 조회
exports.selectDayTodo=(roomId)=>{
    const query=`
    SELECT Todo.id AS todoId,todo,deadline
    FROM Todo INNER JOIN TodoTime ON Todo.id=TodoTime.todoId
    LEFT OUTER JOIN TodoUser ON Todo.id=TodoUser.todoId
    WHERE Todo.roomId=? AND isRepeat=? AND deadline>=NOW() AND TodoUser.userId is null;
    `
    const param=[roomId,'N'];
    return fun1(query,param); 
};

// 마감일이 지나지않고 완료 안된 하루 할일 조회 + 검색어 포함
exports.selectDaySearch=(roomId,keyword)=>{
    const query=`
    SELECT Todo.id AS todoId,todo,deadline
    FROM Todo INNER JOIN TodoTime ON Todo.id=TodoTime.todoId
    LEFT OUTER JOIN TodoUser ON Todo.id=TodoUser.todoId
    WHERE Todo.roomId=? AND isRepeat=? AND deadline>=NOW() AND TodoUser.userId is null AND Todo.todo LIKE '%${keyword}%'
    `
    const param=[roomId,'N'];
    return fun1(query,param); 
};

//  반복 할일 조회
exports.selectDaysTodo=(roomId)=>{
    const query=`
    SELECT Todo.id AS todoId,todo,deadline
    FROM Todo INNER JOIN TodoRepeatTime ON Todo.id=TodoRepeatTime.todoId
    WHERE Todo.roomId=? AND isRepeat=? 
    `
    const param=[roomId,'Y'];
    return fun1(query,param); 
};

//  반복 할일 조회 + 검색어 포함
exports.selectDaysSearch=(roomId,keyword)=>{
    const query=`
    SELECT Todo.id AS todoId,todo,deadline
    FROM Todo INNER JOIN TodoRepeatTime ON Todo.id=TodoRepeatTime.todoId
    WHERE Todo.roomId=? AND isRepeat=? AND Todo.todo LIKE '%${keyword}%'
    `
    const param=[roomId,'Y'];
    return fun1(query,param); 
};

// 마감일이 지나지않고 완료 안된 하루 할일 조회 + 날짜포함
exports.selectDateSearch=(roomId,year,month,day)=>{
    const query=`
    SELECT Todo.id AS todoId,todo,deadline
    FROM Todo INNER JOIN TodoTime ON Todo.id=TodoTime.todoId
    LEFT OUTER JOIN TodoUser ON Todo.id=TodoUser.todoId
    WHERE Todo.roomId=? AND isRepeat=? AND deadline>=NOW() AND TodoUser.userId is null
    AND YEAR(deadline)=? AND MONTH(deadline)=? AND DAY(deadline)=?;
    `
    const param=[roomId,'N',year,month,day];
    return fun1(query,param); 
}


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




