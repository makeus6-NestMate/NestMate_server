const {pool} = require('../../../config/database');
const {logger} = require('../../../config/winston');

const todoDao = require('../dao/todoDao');
const authDao=require('../dao/authDao');
const roomDao = require('../dao/roomDao');
const memoDao =require('../dao/memoDao');


exports.createDayTodo=async(req,res)=>{
    
    const userId=req.verifiedToken.id;

    const {memo,memoColor,width,height,x,y}=req.body;

    let roomId=req.params.roomId;
    
    if(!memo){
        return res.json({
            isSuccess:false,
            message:'메모를 입력해주세요',
            code:446
        })
    }
    if(typeof(memo)!='string'){
        return res.json({
            isSuccess:false,
            message:'메모는 문자열입니다',
            code:447
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

    if(!memoColor){
        return res.json({
            isSuccess:false,
            message:'메모색을 입력해주세요',
            code:448
        })
    }
    if(typeof(memoColor)!='string'){
        return res.json({
            isSuccess:false,
            message:'메모색은 문자열입니다',
            code:449
        })
    }
    if(!width){
        return res.json({
            isSuccess:false,
            message:'가로길이를 입력해주세요',
            code:450
        })
    }
    if(typeof(width)!='number'){
        return res.json({
            isSuccess:false,
            message:'가로길이는 숫자입니다',
            code:451
        })
    }
    if(!height){
        return res.json({
            isSuccess:false,
            message:'세로길이를 입력해주세요',
            code:452
        })
    }
    if(typeof(height)!='number'){
        return res.json({
            isSuccess:false,
            message:'세로길이는 숫자입니다',
            code:453
        })
    }

    if(!x){
        return res.json({
            isSuccess:false,
            message:'위치의 x좌표를 입력해주세요',
            code:454
        })
    }
    if(typeof(x)!='number'){
        return res.json({
            isSuccess:false,
            message:'위치의 x좌표는 숫자입니다',
            code:455
        })
    }
    if(!y){
        return res.json({
            isSuccess:false,
            message:'세로길이를 입력해주세요',
            code:456
        })
    }
    if(typeof(y)!='number'){
        return res.json({
            isSuccess:false,
            message:'세로길이는 숫자입니다',
            code:457
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

        return res.json({
            isSuccess: true,
            code: 200,
            message: "하루 할일 추가 성공"
        });


    }
    catch(err){

        await connection.rollback();
        await connection.release();
    W
        logger.error(`하루 할일 추가 실패\n: ${err.message}`);
        return res.json({
            message:err.message,
            code:500,
            isSuccess:false
        });
    }
}

