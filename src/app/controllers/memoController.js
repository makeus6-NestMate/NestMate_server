const {pool} = require('../../../config/database');
const {logger} = require('../../../config/winston');

const todoDao = require('../dao/todoDao');
const authDao=require('../dao/authDao');
const roomDao = require('../dao/roomDao');
const memoDao =require('../dao/memoDao');
const moment=require('moment');

exports.createMemo=async(req,res)=>{
    

    const userId=req.verifiedToken.id;
    
    const {memo,memoColor,x,y}=req.body;

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
 

    
    if(x===undefined||x===null){
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
    if(y===undefined||y===null){
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

        await memoDao.insertMemo(memo,memoColor,x,y,userId,roomId);

        return res.json({
            isSuccess: true,
            code: 200,
            message: "메모 추가 성공"
        });


    }
    catch(err){

    
        logger.error(`메모 추가 실패\n: ${err.message}`);
        return res.json({
            message:err.message,
            code:500,
            isSuccess:false
        });
    }
}





exports.getMemo=async(req,res)=>{
    
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

        let memo=await memoDao.selectMemo(roomId);

        for(let _ of memo){
           

            _.createdAt=moment(_.createdAt).format('MM/DD/HH/mm');
        }

        return res.json({
            isSuccess: true,
            code: 200,
            message: "메모 가져오기 성공",
            result:{
                memo:memo
            }
        });


    }
    catch(err){

    
        logger.error(`메모 가져오기  실패\n: ${err.message}`);
        return res.json({
            message:err.message,
            code:500,
            isSuccess:false
        });
    }
}




exports.updateMemo=async(req,res)=>{
    
    const userId=req.verifiedToken.id;

    const {memo,memoColor}=req.body;

    let roomId=req.params.roomId;
    let memoId=req.params.memoId;
    
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

    if(!memoId){
        return res.json({
            isSuccess:false,
            message:'메모 아이디를 입력해주세요',
            code:458
        })
    }

    regres=memoId.search(regexp);
    if(regres!=-1){
        return res.json({
            code:459,
            isSuccess:false,
            message:"메모 아이디는 숫자입니다"
        })
    }
    memoId=Number(memoId);




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

        let memos=await memoDao.selectMemoById(memoId);

        if(memos.length<1){
            return res.json({
                isSuccess:false,
                message:'없는 메모 아이디입니다',
                code:460
            })
        }
        if(memos[0].userId!=userId){
            return res.json({
                isSuccess:false,
                message:'권한이 없습니다',
                code:458
            })
        }


        await memoDao.updateMemo(memoId,memo,memoColor);


        

        return res.json({
            isSuccess: true,
            code: 200,
            message: "메모 수정 성공"
        });


    }
    catch(err){

    
        logger.error(`메모 수정  실패\n: ${err.message}`);
        return res.json({
            message:err.message,
            code:500,
            isSuccess:false
        });
    }
}



exports.deleteMemo=async(req,res)=>{
    
    const userId=req.verifiedToken.id;

    let roomId=req.params.roomId;
    let memoId=req.params.memoId;
    
  

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

    if(!memoId){
        return res.json({
            isSuccess:false,
            message:'메모 아이디를 입력해주세요',
            code:458
        })
    }

    regexp=/[^0-9]/g;
    regres=memoId.search(regexp);
    if(regres!=-1){
        return res.json({
            code:459,
            isSuccess:false,
            message:"메모 아이디는 숫자입니다"
        })
    }
    memoId=Number(memoId);




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

        let memo=await memoDao.selectMemoById(memoId);

        if(memo.length<1){
            return res.json({
                isSuccess:false,
                message:'없는 메모 아이디입니다',
                code:460
            })
        }
        if(memo[0].userId!=userId){
            return res.json({
                isSuccess:false,
                message:'권한이 없습니다',
                code:458
            })
        }

        await memoDao.deleteMemo(memoId);


        

        return res.json({
            isSuccess: true,
            code: 200,
            message: "메모 삭제 성공"
        });


    }
    catch(err){

    
        logger.error(`메모 삭제  실패\n: ${err.message}`);
        return res.json({
            message:err.message,
            code:500,
            isSuccess:false
        });
    }
}



exports.moveMemo=async(req,res)=>{
    
    const userId=req.verifiedToken.id;

    let roomId=req.params.roomId;
    let memoId=req.params.memoId;
    
    const {x,y}=req.body;
  
      
    if(x===undefined||x===null){
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
    if(y===undefined||y===null){
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

    if(!memoId){
        return res.json({
            isSuccess:false,
            message:'메모 아이디를 입력해주세요',
            code:458
        })
    }

    regexp=/[^0-9]/g;
    regres=memoId.search(regexp);
    if(regres!=-1){
        return res.json({
            code:459,
            isSuccess:false,
            message:"메모 아이디는 숫자입니다"
        })
    }
    memoId=Number(memoId);




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

        let memo=await memoDao.selectMemoById(memoId);

        if(memo.length<1){
            return res.json({
                isSuccess:false,
                message:'없는 메모 아이디입니다',
                code:460
            })
        }
        if(memo[0].userId!=userId){
            return res.json({
                isSuccess:false,
                message:'권한이 없습니다',
                code:458
            })
        }

        await memoDao.moveMemo(memoId,x,y);


        

        return res.json({
            isSuccess: true,
            code: 200,
            message: "메모 이동 성공"
        });


    }
    catch(err){

    
        logger.error(`메모 이동  실패\n: ${err.message}`);
        return res.json({
            message:err.message,
            code:500,
            isSuccess:false
        });
    }
}
