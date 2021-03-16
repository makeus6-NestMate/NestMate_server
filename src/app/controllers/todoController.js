const {pool} = require('../../../config/database');
const {logger} = require('../../../config/winston');

const todoDao = require('../dao/todoDao');
const authDao=require('../dao/authDao');
const roomDao = require('../dao/roomDao');


exports.createDayTodo=async(req,res)=>{
    
    const userId=req.verifiedToken.id;

    const {todo,roomId,year,month,day,hour,minute}=req.body;

    if(!year||!month||!day||!hour||!minute){
        return res.json({
            isSuccess:false,
            message:'마감날짜를 각각 입력해주세요',
            code:438
        })
    }
    const deadline=new Date(year,month,day,hour,minute);

    if(typeof(year)!='number'||typeof(month)!='number'||typeof(day)!='number'
    ||typeof(hour)!='number'||typeof(minute)!='number'){
        return res.json({
            isSuccess:false,
            message:'마감날짜는 각각 숫자입니다',
            code:439
        })
    }


    

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