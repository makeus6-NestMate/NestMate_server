const {fun1}=require('../../../config/functions');

// 마감일이 지나지않고 완료 안된 하루 할일 조회
exports.selectDayTodo=(roomId,page)=>{
    const query=`
    SELECT Todo.id AS todoId,todo,deadline,Todo.userId
    FROM Todo INNER JOIN TodoTime ON Todo.id=TodoTime.todoId
    LEFT OUTER JOIN TodoUser ON Todo.id=TodoUser.todoId
    WHERE Todo.roomId=? AND isRepeat=? AND deadline>=NOW() AND TodoUser.userId is null
    LIMIT ${page*10},10
    `
    const param=[roomId,'N'];
    return fun1(query,param); 
};

// 마감일이 지나지않고 완료 안된 하루 할일 조회 + 검색어 포함
exports.selectDaySearch=(roomId,keyword,page)=>{
    const query=`
    SELECT Todo.id AS todoId,todo,deadline
    FROM Todo INNER JOIN TodoTime ON Todo.id=TodoTime.todoId
    LEFT OUTER JOIN TodoUser ON Todo.id=TodoUser.todoId
    WHERE Todo.roomId=? AND isRepeat=? AND deadline>=NOW() AND TodoUser.userId is null AND Todo.todo LIKE '%${keyword}%'
    LIMIT ${page*10},10
    `
    const param=[roomId,'N'];
    return fun1(query,param); 
};

//  반복 할일 조회
exports.selectDaysTodo=(roomId,page)=>{
    const query=`
    SELECT Todo.id AS todoId,todo,deadline,Todo.userId
    FROM Todo INNER JOIN TodoRepeatTime ON Todo.id=TodoRepeatTime.todoId
    WHERE Todo.roomId=? AND isRepeat=?
    LIMIT ${page*10},10 
    `
    const param=[roomId,'Y'];
    return fun1(query,param); 
};

//  반복 할일 조회 + 검색어 포함
exports.selectDaysSearch=(roomId,keyword,page)=>{
    const query=`
    SELECT Todo.id AS todoId,todo,deadline
    FROM Todo INNER JOIN TodoRepeatTime ON Todo.id=TodoRepeatTime.todoId
    WHERE Todo.roomId=? AND isRepeat=? AND Todo.todo LIKE '%${keyword}%'
    LIMIT ${page*10},10
    `
    const param=[roomId,'Y'];
    return fun1(query,param); 
};

// 마감일이 지나지않고 완료 안된 하루 할일 조회 + 날짜포함
exports.selectDateSearch=(roomId,year,month,day,page)=>{
    const query=`
    SELECT Todo.id AS todoId,todo,deadline
    FROM Todo INNER JOIN TodoTime ON Todo.id=TodoTime.todoId
    LEFT OUTER JOIN TodoUser ON Todo.id=TodoUser.todoId
    WHERE Todo.roomId=? AND isRepeat=? AND deadline>=NOW() AND TodoUser.userId is null
    AND YEAR(deadline)=? AND MONTH(deadline)=? AND DAY(deadline)=?
    LIMIT ${page*10},10
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

//할일 마친 여부
exports.selectComplete=(todoId)=>{
    const query=`
    SELECT * FROM TodoUser WHERE todoId=?
    `
    const param=[todoId];
    return fun1(query,param); 
};


//할일 마치기
exports.completeTodo=(todoId,userId)=>{
    const query=`
    INSERT INTO TodoUser(todoId,userId) VALUES(?,?)
    `
    const param=[todoId,userId];
    return fun1(query,param); 
};



//오늘 하루 할일 가져오기
exports.selectTodayTodo=(roomId,year,month,day,todoId)=>{
    const query=`
    SELECT TodoTime.todoId,todo,deadline,completeUser.profileImg,todo,completeUser.nickname,"N" AS "isRepeat"
    FROM Todo INNER JOIN TodoTime ON Todo.id=TodoTime.todoId 
    LEFT OUTER JOIN 
    (SELECT profileImg,todoId,nickname
    FROM User INNER JOIN TodoUser ON User.id=TodoUser.userId) AS completeUser
    ON TodoTime.todoId=completeUser.todoId
    WHERE Todo.roomId=? AND Todo.id=? AND Todo.isRepeat=? AND YEAR(deadline)=? AND MONTH(deadline)=? AND DAY(deadline)=?
    
    `
    const param=[roomId,todoId,'N',year,month,day];
    return fun1(query,param); 
};

//오늘 반복 할일 가져오기
exports.selectTodaysTodo=(roomId,day,todoId)=>{
    const query=`
    SELECT TodoRepeatTime.todoId,TodoRepeatTime.deadline,completeUser.profileImg,todo,completeUser.nickname,"Y" AS "isRepeat"
    FROM Todo INNER JOIN TodoRepeatTime ON Todo.id=TodoRepeatTime.todoId
    INNER JOIN TodoRepeatDay ON Todo.id=TodoRepeatDay.todoId
    LEFT OUTER JOIN 
    (SELECT profileImg,todoId,nickname
    FROM User INNER JOIN TodoUser ON User.id=TodoUser.userId) AS  completeUser
    ON TodoRepeatTime.todoId=completeUser.todoId
    WHERE Todo.roomId=? AND Todo.id=? AND Todo.isRepeat=? AND TodoRepeatDay.day=?
    
    `
    const param=[roomId,todoId,'Y',day];
    return fun1(query,param); 
};


exports.selectTodayId=(roomId,year,month,date,day,page)=>{
    const query=`
    SELECT *
    FROM (
        (SELECT TodoTime.todoId,"N" AS "isRepeat"
        FROM Todo INNER JOIN TodoTime ON Todo.id=TodoTime.todoId 
        LEFT OUTER JOIN 
        (SELECT profileImg,todoId,nickname
        FROM User INNER JOIN TodoUser ON User.id=TodoUser.userId) AS completeUser
        ON TodoTime.todoId=completeUser.todoId
        WHERE Todo.roomId=? AND Todo.isRepeat=? AND YEAR(deadline)=? AND MONTH(deadline)=? AND DAY(deadline)=?)
        UNION
        ( SELECT TodoRepeatTime.todoId,"Y" AS "isRepeat"
        FROM Todo INNER JOIN TodoRepeatTime ON Todo.id=TodoRepeatTime.todoId
        INNER JOIN TodoRepeatDay ON Todo.id=TodoRepeatDay.todoId
        LEFT OUTER JOIN 
        (SELECT profileImg,todoId,nickname
        FROM User INNER JOIN TodoUser ON User.id=TodoUser.userId) AS  completeUser
        ON TodoRepeatTime.todoId=completeUser.todoId
        WHERE Todo.roomId=? AND Todo.isRepeat=? AND TodoRepeatDay.day=?)) AS A
    LIMIT ${page*10},10;
    `
    const param=[roomId,'N',year,month,date,roomId,'Y',day];
    return fun1(query,param); 
};










