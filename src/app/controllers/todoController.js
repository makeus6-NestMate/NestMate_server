const {pool} = require('../../../config/database');
const {logger} = require('../../../config/winston');

const todoDao = require('../dao/todoDao');
const authDao=require('../dao/authDao');
const roomDao = require('../dao/roomDao');
const moment=require('moment');

exports.createDayTodo=async(req,res)=>{
    
    const userId=req.verifiedToken.id;

    const {todo,time}=req.body;

    let roomId=req.params.roomId;
    

    if(!time){
        return res.json({
            isSuccess:false,
            message:'마감날짜를 입력해주세요',
            code:438
        })
    }
    
    if(typeof(time)!='string'){
        return res.json({
            isSuccess:false,
            message:'마감날짜는 문자열입니다',
            code:439
        })
    }
    let cnt=0;
    for(let _ of time){
        if(_==='/') cnt++;
    }
    if(cnt!=4){
        return res.json({
            isSuccess:false,
            message:'년 월 일 시간 분 다 입력해주세요',
            code:440
        })
    }
    
    let times=time.split('/');

    const deadline=times[0]+'/'+times[1]+'/'+times[2]+' '+times[3]+':'+times[4];

    if(!todo){
        return res.json({
            isSuccess:false,
            message:'할일을 입력해주세요',
            code:436
        })
    }
    if(typeof(todo)!='string'){
        return res.json({
            isSuccess:false,
            message:'할일은 문자열입니다',
            code:437
        })
    }
    if(!roomId){
        return res.json({
            isSuccess:false,
            message:'방 아이디를 입력해주세요',
            code:435
        })
    }

    let regexp=/[^0-9]/g;
    let regres=roomId.search(regexp);
    if(regres!=-1){
        return res.json({
            code:434,
            isSuccess:false,
            message:"방 아이디는 숫자입니다"
        })
    }
    roomId=Number(roomId);



    const connection = await pool.getConnection(async conn => conn);

    try{

        const user=await authDao.selectUserById(userId);


        if(user.length<1){
            return res.json({
                isSuccess:false,
                message:'없는 아이디입니다',
                code:403
            })
        }
        const room=await roomDao.selectRoom(roomId);
       
        if(room.length<1){
            return res.json({
                isSuccess:false,
                message:'없는 방 아이디입니다',
                code:432
            })
        }

        await connection.beginTransaction();



        const query1= `
        INSERT INTO Todo(todo,isRepeat,roomId,userId) VALUES(?,?,?,?);
        `;
        const param1=[todo,'N',roomId,userId];
        await connection.query(
            query1,
            param1
        );

        const query2= `
        SELECT MAX(id) AS maxId FROM Todo;
        `;
        const param2=[];
        const [[todoId]]=await connection.query(
            query2,
            param2
        );


        const query3= `
        INSERT INTO TodoTime(todoId,deadline) VALUES(?,?)
        `;
        const param3=[todoId.maxId,deadline];
        await connection.query(
            query3,
            param3
        );




        

        await connection.commit();
        await connection.release();


        
        return res.json({
            isSuccess: true,
            code: 200,
            message: "하루 할일 추가 성공"
        });


    }
    catch(err){

        await connection.rollback();
        await connection.release();
    
        logger.error(`하루 할일 추가 실패\n: ${err.message}`);
        return res.json({
            message:err.message,
            code:500,
            isSuccess:false
        });
    }
}





exports.createDaysTodo=async(req,res)=>{
    
    const userId=req.verifiedToken.id;

    let roomId=req.params.roomId;
    const {todo,time,days}=req.body;
    

    if(!time){
        return res.json({
            isSuccess:false,
            message:'마감시간를 입력해주세요',
            code:438
        })
    }
    
    if(typeof(time)!='string'){
        return res.json({
            isSuccess:false,
            message:'마감시간은 문자열입니다',
            code:439
        })
    }
    let cnt=0;
    for(let _ of time){
        if(_===':') cnt++;
    }
    if(cnt!=1){
        return res.json({
            isSuccess:false,
            message:'시간 분 다 입력해주세요',
            code:440
        })
    }
    
    let times=time.split('/');

    const deadline=times[0]+':'+times[1];

    if(!todo){
        return res.json({
            isSuccess:false,
            message:'할일을 입력해주세요',
            code:436
        })
    }
    if(typeof(todo)!='string'){
        return res.json({
            isSuccess:false,
            message:'할일은 문자열입니다',
            code:437
        })
    }
    if(!roomId){
        return res.json({
            isSuccess:false,
            message:'방 아이디를 입력해주세요',
            code:435
        })
    }

    let regexp=/[^0-9]/g;
    let regres=roomId.search(regexp);
    if(regres!=-1){
        return res.json({
            code:434,
            isSuccess:false,
            message:"방 아이디는 숫자입니다"
        })
    }
    roomId=Number(roomId);

    if(!days){
        return res.json({
            isSuccess:false,
            message:'요일을 입력해주세요',
            code:441
        })
    }

    if(typeof(days)!='string'){
        return res.json({
            isSuccess:false,
            message:'요일은 문자열입니다',
            code:442
        })
    }

    if(days.length!=7){
        return res.json({
            isSuccess:false,
            message:'요일은 7자리 문자열입니다',
            code:443
        })
    }




    const connection = await pool.getConnection(async conn => conn);

    try{

        const user=await authDao.selectUserById(userId);


        if(user.length<1){
            return res.json({
                isSuccess:false,
                message:'없는 아이디입니다',
                code:403
            })
        }
        const room=await roomDao.selectRoom(roomId);
       
        if(room.length<1){
            return res.json({
                isSuccess:false,
                message:'없는 방 아이디입니다',
                code:432
            })
        }

        await connection.beginTransaction();



        const query1= `
        INSERT INTO Todo(todo,isRepeat,roomId,userId) VALUES(?,?,?,?);
        `;
        const param1=[todo,'Y',roomId,userId];
        await connection.query(
            query1,
            param1
        );

        const query2= `
        SELECT MAX(id) AS maxId FROM Todo;
        `;
        const param2=[];
        const [[todoId]]=await connection.query(
            query2,
            param2
        );


        const query3= `
        INSERT INTO TodoRepeatTime(todoId,deadline) VALUES(?,?)
        `;
        const param3=[todoId.maxId,deadline];
        await connection.query(
            query3,
            param3
        );


        for(let i=0;i<days.length;i++){
            if(days[i]!='1') continue;

            const query5= `
            INSERT INTO TodoRepeatDay(day,todoId) VALUES(?,?);
            `;
            const param5=[i,todoId.maxId];
            await connection.query(
                query5,
                param5
            );
        }


        await connection.commit();
        await connection.release();


        
        return res.json({
            isSuccess: true,
            code: 200,
            message: "반복 할일 추가 성공"
        });


    }
    catch(err){

        await connection.rollback();
        await connection.release();
    
        logger.error(`반복 할일 추가 실패\n: ${err.message}`);
        return res.json({
            message:err.message,
            code:500,
            isSuccess:false
        });
    }
}





exports.getDayTodo=async(req,res)=>{
    
    const userId=req.verifiedToken.id;

    let roomId=req.params.roomId;

    if(!roomId){
        return res.json({
            isSuccess:false,
            message:'방 아이디를 입력해주세요',
            code:435
        })
    }

    let regexp=/[^0-9]/g;
    let regres=roomId.search(regexp);
    if(regres!=-1){
        return res.json({
            code:434,
            isSuccess:false,
            message:"방 아이디는 숫자입니다"
        })
    }

    roomId=Number(roomId);


    try{
        
        const user=await authDao.selectUserById(userId);


        if(user.length<1){
            return res.json({
                isSuccess:false,
                message:'없는 아이디입니다',
                code:403
            })
        }
        const room=await roomDao.selectRoom(roomId);
       
        if(room.length<1){
            return res.json({
                isSuccess:false,
                message:'없는 방 아이디입니다',
                code:432
            })
        }

        const todo=await todoDao.selectDayTodo(roomId);

        for(let _ of todo){

            let todoId=_.id;
            delete _.id;
            _.todoId=todoId;
    
            let time=moment(_.deadline).utc().format('MM/DD/HH/mm');
            delete _.deadline;
            _.deadline=time;
        }

        return res.json({
            isSuccess: true,
            code: 200,
            message: "하루 할일 조회 성공",
            todo:todo
        });


    }
    catch(err){

    
        logger.error(`하루 할일 조회 실패\n: ${err.message}`);
        return res.json({
            message:err.message,
            code:500,
            isSuccess:false
        });
    }
}




exports.getDaysTodo=async(req,res)=>{
    
    const userId=req.verifiedToken.id;

    let roomId=req.params.roomId;

    if(!roomId){
        return res.json({
            isSuccess:false,
            message:'방 아이디를 입력해주세요',
            code:435
        })
    }

    let regexp=/[^0-9]/g;
    let regres=roomId.search(regexp);
    if(regres!=-1){
        return res.json({
            code:434,
            isSuccess:false,
            message:"방 아이디는 숫자입니다"
        })
    }

    roomId=Number(roomId);


    try{
        
        const user=await authDao.selectUserById(userId);


        if(user.length<1){
            return res.json({
                isSuccess:false,
                message:'없는 아이디입니다',
                code:403
            })
        }
        const room=await roomDao.selectRoom(roomId);
       
        if(room.length<1){
            return res.json({
                isSuccess:false,
                message:'없는 방 아이디입니다',
                code:432
            })
        }

        const todo=await todoDao.selectDaysTodo(roomId);

        for(let _ of todo){
            
            let todoId=_.id;
            delete _.id;
            _.todoId=todoId;
    
            let time=_.deadline.split(':');
            _.deadline=time[0]+'/'+time[1];

            const days=await todoDao.selectDays(todoId);

            let day='0000000';
         
            for(let _ of days){
                console.log(_.day);
                if(_.day==0) day='1'+day.substr(1);
                else if(_.day==1) day=day.substr(0,1)+'1'+day.substr(2);
                else if(_.day==2) day=day.substr(0,2)+'1'+day.substr(3);
                else if(_.day==3) day=day.substr(0,3)+'1'+day.substr(4);
                else if(_.day==4) day=day.substr(0,4)+'1'+day.substr(5);
                else if(_.day==5) day=day.substr(0,5)+'1'+day.substr(6);
                else if(_.day==6) day=day.substr(0,6)+'1';
            }
            _.day=day;

        }

        return res.json({
            isSuccess: true,
            code: 200,
            message: "반복 할일 조회 성공",
            todo:todo
        });


    }
    catch(err){

    
        logger.error(`반복 할일 조회 실패\n: ${err.message}`);
        return res.json({
            message:err.message,
            code:500,
            isSuccess:false
        });
    }
}




exports.deleteDayTodo=async(req,res)=>{
    
    const userId=req.verifiedToken.id;

    let todoId=req.params.todoId;

    let roomId=req.params.roomId;

    if(!roomId){
        return res.json({
            isSuccess:false,
            message:'방 아이디를 입력해주세요',
            code:435
        })
    }

    let regexp=/[^0-9]/g;
    let regres=roomId.search(regexp);
    if(regres!=-1){
        return res.json({
            code:434,
            isSuccess:false,
            message:"방 아이디는 숫자입니다"
        })
    }

    if(!todoId){
        return res.json({
            isSuccess:false,
            message:'할 일 아이디를 입력해주세요',
            code:444
        })
    }

    regexp=/[^0-9]/g;
    regres=todoId.search(regexp);
    if(regres!=-1){
        return res.json({
            code:445,
            isSuccess:false,
            message:"할 일 아이디는 숫자입니다"
        })
    }

    roomId=Number(roomId);
    todoId=Number(todoId);

    
    const connection = await pool.getConnection(async conn => conn);

    try{
        
        const user=await authDao.selectUserById(userId);


        if(user.length<1){
            return res.json({
                isSuccess:false,
                message:'없는 아이디입니다',
                code:403
            })
        }
        const room=await roomDao.selectRoom(roomId);
       
        if(room.length<1){
            return res.json({
                isSuccess:false,
                message:'없는 방 아이디입니다',
                code:432
            })
        }

        const todo=await todoDao.selectTodo(todoId);
       
        if(todo.length<1){
            return res.json({
                isSuccess:false,
                message:'없는 할일 아이디입니다',
                code:445
            })
        }

        await connection.beginTransaction();



        const query1= `
        DELETE FROM Todo WHERE id=?
        `;
        const param1=[todoId];
        await connection.query(
            query1,
            param1
        );

        const query2= `
        DELETE FROM TodoTime WHERE todoId=?
        `;
        const param2=[todoId];
        await connection.query(
            query2,
            param2
        );


        await connection.commit();
        await connection.release();



        return res.json({
            isSuccess: true,
            code: 200,
            message: "하루 할일 삭제 성공",
            todo:todo
        });


    }
    catch(err){

        await connection.rollback();
        await connection.release();
    
        logger.error(`하루 할일 삭제 실패\n: ${err.message}`);
        return res.json({
            message:err.message,
            code:500,
            isSuccess:false
        });
    }
}



exports.deleteDaysTodo=async(req,res)=>{
    
    const userId=req.verifiedToken.id;

    let todoId=req.params.todoId;

    let roomId=req.params.roomId;

    if(!roomId){
        return res.json({
            isSuccess:false,
            message:'방 아이디를 입력해주세요',
            code:435
        })
    }

    let regexp=/[^0-9]/g;
    let regres=roomId.search(regexp);
    if(regres!=-1){
        return res.json({
            code:434,
            isSuccess:false,
            message:"방 아이디는 숫자입니다"
        })
    }

    if(!todoId){
        return res.json({
            isSuccess:false,
            message:'할 일 아이디를 입력해주세요',
            code:444
        })
    }

    regexp=/[^0-9]/g;
    regres=todoId.search(regexp);
    if(regres!=-1){
        return res.json({
            code:445,
            isSuccess:false,
            message:"할 일 아이디는 숫자입니다"
        })
    }

    roomId=Number(roomId);
    todoId=Number(todoId);

    
    const connection = await pool.getConnection(async conn => conn);

    try{
        
        const user=await authDao.selectUserById(userId);


        if(user.length<1){
            return res.json({
                isSuccess:false,
                message:'없는 아이디입니다',
                code:403
            })
        }
        const room=await roomDao.selectRoom(roomId);
       
        if(room.length<1){
            return res.json({
                isSuccess:false,
                message:'없는 방 아이디입니다',
                code:432
            })
        }

        const todo=await todoDao.selectTodo(todoId);
       
        if(todo.length<1){
            return res.json({
                isSuccess:false,
                message:'없는 할일 아이디입니다',
                code:445
            })
        }



        await connection.beginTransaction();



        const query1= `
        DELETE FROM Todo WHERE id=?
        `;
        const param1=[todoId];
        await connection.query(
            query1,
            param1
        );

        const query2= `
        DELETE FROM TodoRepeatTime WHERE todoId=?
        `;
        const param2=[todoId];
        await connection.query(
            query2,
            param2
        );

        const query3= `
        DELETE FROM TodoRepeatDay WHERE todoId=?
        `;
        const param3=[todoId];
        await connection.query(
            query3,
            param3
        );


        await connection.commit();
        await connection.release();



        return res.json({
            isSuccess: true,
            code: 200,
            message: "반복 할일 삭제 성공",
            todo:todo
        });


    }
    catch(err){

        await connection.rollback();
        await connection.release();
    
        logger.error(`반복 할일 삭제 실패\n: ${err.message}`);
        return res.json({
            message:err.message,
            code:500,
            isSuccess:false
        });
    }
}




exports.updateDayTodo=async(req,res)=>{
    
    const userId=req.verifiedToken.id;
    let roomId=req.params.roomId;
    const {todo,time,todoId}=req.body;
    

    if(!time){
        return res.json({
            isSuccess:false,
            message:'마감날짜를 입력해주세요',
            code:438
        })
    }
    
    if(typeof(time)!='string'){
        return res.json({
            isSuccess:false,
            message:'마감날짜는 문자열입니다',
            code:439
        })
    }
    let cnt=0;
    for(let _ of time){
        if(_==='/') cnt++;
    }
    if(cnt!=4){
        return res.json({
            isSuccess:false,
            message:'년 월 일 시간 분 다 입력해주세요',
            code:440
        })
    }

    
    let times=time.split('/');

    const deadline=times[0]+'/'+times[1]+'/'+times[2]+' '+times[3]+':'+times[4];

    if(!todo){
        return res.json({
            isSuccess:false,
            message:'할일을 입력해주세요',
            code:436
        })
    }
    if(typeof(todo)!='string'){
        return res.json({
            isSuccess:false,
            message:'할일은 문자열입니다',
            code:437
        })
    }
    if(!roomId){
        return res.json({
            isSuccess:false,
            message:'방 아이디를 입력해주세요',
            code:435
        })
    }

    let regexp=/[^0-9]/g;
    let regres=roomId.search(regexp);
    if(regres!=-1){
        return res.json({
            code:434,
            isSuccess:false,
            message:"방 아이디는 숫자입니다"
        })
    }
    roomId=Number(roomId);

    if(!todoId){
        return res.json({
            isSuccess:false,
            message:'할 일 아이디를 입력해주세요',
            code:444
        })
    }
    if(typeof(todoId)!='number'){
        return res.json({
            code:445,
            isSuccess:false,
            message:"할 일 아이디는 숫자입니다"
        })
    }



    const connection = await pool.getConnection(async conn => conn);

    try{

        const user=await authDao.selectUserById(userId);


        if(user.length<1){
            return res.json({
                isSuccess:false,
                message:'없는 아이디입니다',
                code:403
            })
        }
        const room=await roomDao.selectRoom(roomId);
       
        if(room.length<1){
            return res.json({
                isSuccess:false,
                message:'없는 방 아이디입니다',
                code:432
            })
        }

        const todos=await todoDao.selectTodo(todoId);
       
        if(todos.length<1){
            return res.json({
                isSuccess:false,
                message:'없는 할일 아이디입니다',
                code:445
            })
        }


        await connection.beginTransaction();


        const query1= `
        UPDATE Todo SET todo=? WHERE id=?
        `;
        const param1=[todo,todoId];
        await connection.query(
            query1,
            param1
        );



        const query2= `
        UPDATE TodoTime SET deadline=? WHERE todoId=?
        `;
        const param2=[deadline,todoId];
        await connection.query(
            query2,
            param2
        );

        await connection.commit();
        await connection.release();


        
        return res.json({
            isSuccess: true,
            code: 200,
            message: "하루 할일 수정 성공"
        });


    }
    catch(err){

        await connection.rollback();
        await connection.release();
    
        logger.error(`하루 할일 수정 실패\n: ${err.message}`);
        return res.json({
            message:err.message,
            code:500,
            isSuccess:false
        });
    }
}




exports.updateDaysTodo=async(req,res)=>{
    
    const userId=req.verifiedToken.id;

    const roomId=req.params.roomId;
    const {todo,time,todoId,days}=req.body;
    

    if(!time){
        return res.json({
            isSuccess:false,
            message:'마감날짜를 입력해주세요',
            code:438
        })
    }
    
    if(typeof(time)!='string'){
        return res.json({
            isSuccess:false,
            message:'마감날짜는 문자열입니다',
            code:439
        })
    }
    let cnt=0;
    for(let _ of time){
        if(_==='/') cnt++;
    }
    if(cnt!=4){
        return res.json({
            isSuccess:false,
            message:'년 월 일 시간 분 다 입력해주세요',
            code:440
        })
    }

    
    let times=time.split('/');

    const deadline=times[0]+':'+times[1];

    if(!todo){
        return res.json({
            isSuccess:false,
            message:'할일을 입력해주세요',
            code:436
        })
    }
    if(typeof(todo)!='string'){
        return res.json({
            isSuccess:false,
            message:'할일은 문자열입니다',
            code:437
        })
    }
    if(!roomId){
        return res.json({
            isSuccess:false,
            message:'방 아이디를 입력해주세요',
            code:435
        })
    }

    let regexp=/[^0-9]/g;
    let regres=roomId.search(regexp);
    if(regres!=-1){
        return res.json({
            code:434,
            isSuccess:false,
            message:"방 아이디는 숫자입니다"
        })
    }
    roomId=Number(roomId);

    if(!todoId){
        return res.json({
            isSuccess:false,
            message:'할 일 아이디를 입력해주세요',
            code:444
        })
    }
    if(typeof(todoId)!='number'){
        return res.json({
            code:445,
            isSuccess:false,
            message:"할 일 아이디는 숫자입니다"
        })
    }

    if(!days){
        return res.json({
            isSuccess:false,
            message:'요일을 입력해주세요',
            code:441
        })
    }

    if(typeof(days)!='string'){
        return res.json({
            isSuccess:false,
            message:'요일은 문자열입니다',
            code:442
        })
    }

    if(days.length!=7){
        return res.json({
            isSuccess:false,
            message:'요일은 7자리 문자열입니다',
            code:443
        })
    }




    const connection = await pool.getConnection(async conn => conn);

    try{

        const user=await authDao.selectUserById(userId);


        if(user.length<1){
            return res.json({
                isSuccess:false,
                message:'없는 아이디입니다',
                code:403
            })
        }
        const room=await roomDao.selectRoom(roomId);
       
        if(room.length<1){
            return res.json({
                isSuccess:false,
                message:'없는 방 아이디입니다',
                code:432
            })
        }

        const todos=await todoDao.selectTodo(todoId);
       
        if(todos.length<1){
            return res.json({
                isSuccess:false,
                message:'없는 할일 아이디입니다',
                code:445
            })
        }


        await connection.beginTransaction();


        const query1= `
        UPDATE Todo SET todo=? WHERE id=?
        `;
        const param1=[todo,todoId];
        await connection.query(
            query1,
            param1
        );



        const query2= `
        UPDATE TodoRepeatTime SET deadline=? WHERE todoId=?
        `;
        const param2=[deadline,todoId];
        await connection.query(
            query2,
            param2
        );

        
        const query3= `
        DELETE TodoRepeatDay WHERE todoId=?
        `;
        const param3=[todoId];
        await connection.query(
            query3,
            param3
        );

              
        for(let i=0;i<days.length;i++){
            if(days[i]!='1') continue;

            const query5= `
            INSERT INTO TodoRepeatDay(day,todoId) VALUES(?,?);
            `;
            const param5=[i,todoId.maxId];
            await connection.query(
                query5,
                param5
            );
        }

        await connection.commit();
        await connection.release();


        
        return res.json({
            isSuccess: true,
            code: 200,
            message: "반복 할일 수정 성공"
        });


    }
    catch(err){

        await connection.rollback();
        await connection.release();
    
        logger.error(`반복 할일 수정 실패\n: ${err.message}`);
        return res.json({
            message:err.message,
            code:500,
            isSuccess:false
        });
    }
}
