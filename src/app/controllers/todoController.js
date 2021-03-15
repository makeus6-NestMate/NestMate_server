const {pool} = require('../../../config/database');
const {logger} = require('../../../config/winston');

const todoDao = require('../dao/todoDao');
const authDao=require('../dao/authDao');
const roomDao = require('../dao/roomDao');


exports.createDayTodo=async(req,res)=>{
    
    const userId=req.verifiedToken.id;

    const {todo,deadline,roomId}=req.body;

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

    if(typeof(room)!='number'){
        return res.json({
            isSuccess:false,
            message:'방 아이디는 숫자입니다',
            code:434
        })
    }

    if(!deadline){
        return res.json({
            isSuccess:false,
            message:'마감날짜를 입려해주세요',
            code:438
        })
    }

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


        
        return res.json({
            isSuccess: true,
            code: 200,
            message: "하루 할일 추가 성공",
            result:{
                roomInfo:roomInfo
            }
        });


    }
    catch(err){
    
        logger.error(`하루 할일 추가 실패\n: ${err.message}`);
        return res.json({
            message:err.message,
            code:500,
            isSuccess:false
        });
    }
}