const {pool} = require('../../../config/database');
const {logger} = require('../../../config/winston');

const todoDao = require('../dao/todoDao');
const authDao=require('../dao/authDao');
const roomDao = require('../dao/roomDao');
const moment=require('moment');

exports.createDayTodo=async(req,res)=>{
    
    const userId=req.verifiedToken.id;

    const {todo,roomId,time}=req.body;
    

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

    if(typeof(roomId)!='number'){
        return res.json({
            isSuccess:false,
            message:'방 아이디는 숫자입니다',
            code:434
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
        INSERT INTO Todo(todo,isRepeat,roomId) VALUES(?,?,?);
        `;
        const param1=[todo,'N',roomId];
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



        const query4= `
        INSERT INTO TodoUser(userId,todoId) VALUES(?,?);
        `;
        const param4=[userId,todoId.maxId];
        await connection.query(
            query4,
            param4
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

    const {todo,roomId,time,days}=req.body;
    

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

    if(typeof(roomId)!='number'){
        return res.json({
            isSuccess:false,
            message:'방 아이디는 숫자입니다',
            code:434
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
            code:442
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
        INSERT INTO Todo(todo,isRepeat,roomId) VALUES(?,?,?);
        `;
        const param1=[todo,'Y',roomId];
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
        INSERT INTO TodoRepeatTime(todoId,day,deadline) VALUES(?,?,?)
        `;
        const param3=[todoId.maxId,days,deadline];
        await connection.query(
            query3,
            param3
        );



        const query4= `
        INSERT INTO TodoUser(userId,todoId) VALUES(?,?);
        `;
        const param4=[userId,todoId.maxId];
        await connection.query(
            query4,
            param4
        );

        

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

       
        console.log(moment(todo[0].deadline).utc().format('MM/DD/YYYY/hh/mm'));

        console.log(todo);

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