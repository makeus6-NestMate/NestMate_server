const {pool} = require('../../../config/database');
const {logger} = require('../../../config/winston');

const todoDao = require('../dao/todoDao');
const authDao=require('../dao/authDao');
const roomDao = require('../dao/roomDao');



exports.updateProfile=async(req,res)=>{
    
    const userId=req.verifiedToken.id;


    try{

        const user=await authDao.selectUserById(userId);


        if(user.length<1){
            return res.json({
                isSuccess:false,
                message:'없는 아이디입니다',
                code:403
            })
        }
    

        
        return res.json({
            isSuccess: true,
            code: 200,
            message: "프로필 수정 성공"
        });


    }
    catch(err){

    
        logger.error(`프로필 수정 실패\n: ${err.message}`);
        return res.json({
            message:err.message,
            code:500,
            isSuccess:false
        });
    }
}