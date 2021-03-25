const {pool} = require('../../../config/database');
const {logger} = require('../../../config/winston');

const todoDao = require('../dao/todoDao');
const authDao=require('../dao/authDao');
const roomDao = require('../dao/roomDao');
const etcDao=require('../dao/etcDao');


exports.updateProfile=async(req,res)=>{
    
    const userId=req.verifiedToken.id;

    const {nickname}=req.body;

    if(!req.file||!req.file.location){
        return res.json({
            isSuccess:false,
            message:'사진을 입력해주세요',
            code:425
        })
    }

    if(!nickname){
        return res.json({
            isSuccess:false,
            message:'닉네임을 입력해주세요',
            code:426
        })
    }

    if(typeof(nickname)!='string'){
        return res.json({
            isSuccess:false,
            message:'닉네임은 문자열입니다',
            code:427
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
        let img;
        if(!req.file.location) img=user[0].profileImg;
        else img=req.file.location;

        await etcDao.updateProfile(userId,nickname,img);
    

        
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





exports.getProfile=async(req,res)=>{
    
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
    

        const [users]=await etcDao.selectProfile(userId);
    

        
        return res.json({
            isSuccess: true,
            code: 200,
            message: "프로필 조회 성공",
            result:{
                user:users
            }
        });


    }
    catch(err){

    
        logger.error(`프로필 조회 실패\n: ${err.message}`);
        return res.json({
            message:err.message,
            code:500,
            isSuccess:false
        });
    }
}




exports.getChart=async(req,res)=>{
    
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


        const best=await etcDao.selectBestUser(roomId)

    
        
        return res.json({
            isSuccess: true,
            code: 200,
            message: "차트 조회 성공",
            result:{

            }
        });


    }
    catch(err){

    
        logger.error(`차트 조회 실패\n: ${err.message}`);
        return res.json({
            message:err.message,
            code:500,
            isSuccess:false
        });
    }
}