const {pool} = require('../../../config/database');
const {logger} = require('../../../config/winston');

const authDao=require('../dao/authDao');
const roomDao = require('../dao/roomDao');
const ruleDao =require('../dao/ruleDao');





exports.createRule=async(req,res)=>{
    
    const userId=req.verifiedToken.id;

    const {rule}=req.body;

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

    if(!rule){
        return res.json({
            code:461,
            isSuccess:false,
            message:"규칙이 입력하세요"
        })
    }
    if(typeof(rule)!='string'){
        return res.json({
            code:462,
            isSuccess:false,
            message:"규칙은 문자열입니다"
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

        await ruleDao.insertRule(roomId,userId,rule);

        
        return res.json({
            isSuccess: true,
            code: 200,
            message: "규칙 추가 성공"
        });

    }
    catch(err){
        logger.error(`규칙 추가 실패\n: ${err.message}`);
        return res.json({
            message:err.message,
            code:500,
            isSuccess:false
        });
    }
}



exports.updateRule=async(req,res)=>{
    
    const userId=req.verifiedToken.id;

    const {rule}=req.body;

    let roomId=req.params.roomId;
    let ruleId=req.params.ruleId;

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

    if(!ruleId){
        return res.json({
            isSuccess:false,
            message:'규칙 아이디를 입력해주세요',
            code:463
        })
    }

    regexp=/[^0-9]/g;
    regres=ruleId.search(regexp);
    if(regres!=-1){
        return res.json({
            code:464,
            isSuccess:false,
            message:"규칙 아이디는 숫자입니다"
        })
    }
    ruleId=Number(ruleId);

    if(!rule){
        return res.json({
            code:461,
            isSuccess:false,
            message:"규칙이 입력하세요"
        })
    }
    if(typeof(rule)!='string'){
        return res.json({
            code:462,
            isSuccess:false,
            message:"규칙은 문자열입니다"
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

        const rules=await ruleDao.selectRuleById(ruleId);

       
        if(rules.length<1){
            return res.json({
                isSuccess:false,
                message:'없는 규칙 아이디입니다',
                code:463
            })
        }

        if(rules[0].userId!=userId){
            return res.json({
                isSuccess:false,
                message:'권한이 없습니다',
                code:458
            })
        }



        


        await ruleDao.updateRule(rule,ruleId);

        
        return res.json({
            isSuccess: true,
            code: 200,
            message: "규칙 수정 성공"
        });

    }
    catch(err){
        logger.error(`규칙 수정 실패\n: ${err.message}`);
        return res.json({
            message:err.message,
            code:500,
            isSuccess:false
        });
    }
}


exports.deleteRule=async(req,res)=>{
    
    const userId=req.verifiedToken.id;



    let roomId=req.params.roomId;
    let ruleId=req.params.ruleId;

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

    if(!ruleId){
        return res.json({
            isSuccess:false,
            message:'규칙 아이디를 입력해주세요',
            code:463
        })
    }

    regexp=/[^0-9]/g;
    regres=ruleId.search(regexp);
    if(regres!=-1){
        return res.json({
            code:464,
            isSuccess:false,
            message:"규칙 아이디는 숫자입니다"
        })
    }
    ruleId=Number(ruleId);




  
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

        const rule=await ruleDao.selectRuleById(ruleId);

       
        if(rule.length<1){
            return res.json({
                isSuccess:false,
                message:'없는 규칙 아이디입니다',
                code:463
            })
        }

        if(rule[0].userId!=userId){
            return res.json({
                isSuccess:false,
                message:'권한이 없습니다',
                code:458
            })
        }

        await ruleDao.deleteRule(ruleId);

        
        return res.json({
            isSuccess: true,
            code: 200,
            message: "규칙 삭제 성공"
        });

    }
    catch(err){
        logger.error(`규칙 삭제 실패\n: ${err.message}`);
        return res.json({
            message:err.message,
            code:500,
            isSuccess:false
        });
    }
}




exports.getRule=async(req,res)=>{
    
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

        const rule=await ruleDao.selectRule(roomId);

    

        
        return res.json({
            isSuccess: true,
            code: 200,
            message: "규칙 조회 성공",
            result:{
                rule:rule
            }
        });

    }
    catch(err){
        logger.error(`규칙 조회 실패\n: ${err.message}`);
        return res.json({
            message:err.message,
            code:500,
            isSuccess:false
        });
    }
}
