const {pool} = require('../../../config/database');
const {logger} = require('../../../config/winston');

const roomDao = require('../dao/roomDao');
const authDao=require('../dao/authDao');


exports.createRoom = async(req, res)=> {
    const {
        color,name
    } = req.body;

    const userId=req.verifiedToken.id;

    if(!name){
        return res.json({
            isSuccess:false,
            message:'둥지이름을 입력해수제요',
            code:428
        })
    }
    
    if(typeof(name)!='string'){
        return res.json({
            isSuccess:false,
            message:'둥지이름은 문자열입니다',
            code:429
        })
    }

    if(!color){
        return res.json({
            isSuccess:false,
            message:'둥지색을 입력해수제요',
            code:430
        })
    }

    if(typeof(color)!='string'){
        return res.json({
            isSuccess:false,
            message:'둥지색은 문자열입니다',
            code:431
        })
    }
    
    const connection = await pool.getConnection(async conn => conn);
    
    try {

    
        const user=await authDao.selectUserById(userId);

        if(!user){
            return res.json({
                isSuccess:false,
                message:'없는 아이디입니다',
                code:432
            })
        }

        await connection.beginTransaction();

        await roomDao.insertRoom(name,color);
        const room=await roomDao.selectMaxRoom();

        await roomDao.insertRoomUser(room.maxId,userId);


        await connection.commit();
        connection.release();
        return res.json({
            isSuccess: true,
            code: 200,
            message: "둥지만들기 성공"
        });

    } catch (err) {
        await connection.rollback();
        connection.release();
        logger.error(`둥지만들기 실패\n: ${err.message}`);
        return res.json({
            message:err.message,
            code:500,
            isSuccess:false
        });
    }
};