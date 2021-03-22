const {pool} = require('../../../config/database');
const {logger} = require('../../../config/winston');

const authDao=require('../dao/authDao');
const roomDao = require('../dao/roomDao');
const noticeVoteDao=require('../dao/noticeVoteDao');




exports.postNotice=async(req,res)=>{
    
    const userId=req.verifiedToken.id;

    const {notice}=req.body;

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

    if(!notice){
        return res.json({
            code:463,
            isSuccess:false,
            message:"공지를  입력하세요"
        })
    }
    if(typeof(notice)!='string'){
        return res.json({
            code:464,
            isSuccess:false,
            message:"공지는 문자열입니다"
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

        await noticeVoteDao.insertNotice(roomId,userId,notice);

        
        return res.json({
            isSuccess: true,
            code: 200,
            message: "공지 추가 성공"
        });

    }
    catch(err){
        logger.error(`공지 추가 실패\n: ${err.message}`);
        return res.json({
            message:err.message,
            code:500,
            isSuccess:false
        });
    }
}





exports.postVote=async(req,res)=>{
    
    const userId=req.verifiedToken.id;

    const {title,choiceArr}=req.body;

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

    if(!title){
        return res.json({
            code:464,
            isSuccess:false,
            message:"제목을 입력하세요"
        })
    }
    if(typeof(title)!='string'){
        return res.json({
            code:465,
            isSuccess:false,
            message:"제목은 문자열입니다"
        })
    }

    if(!choiceArr){
        return res.json({
            code:466,
            isSuccess:false,
            message:"투표내용을 입력해주세요"
        })
    }

    for(let _ of choiceArr){
        if(typeof(_)!='string'){
            return res.json({
                code:467,
                isSuccess:false,
                message:"투표내용은 문자열입니다"
            })
        }
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
        INSERT INTO Vote(roomId,userId,isFinished,title) VALUES(?,?,?,?);
        `;
        const param1=[roomId,userId,'N',title];
        await connection.query(
            query1,
            param1
        );

        const query2= `
        SELECT MAX(id) AS maxId FROM Vote;
        `;
        const param2=[];
        const [[voteId]] = await connection.query(
            query2,
            param2
        );

        for(let _ of choiceArr){
            const query3= `
            INSERT INTO VoteChoice(voteId,choice) VALUES(?,?);
            `;
            const param3=[voteId.maxId,_];
            await connection.query(
                query3,
                param3
            );
        }



        await connection.commit();
        await connection.release();
        
        return res.json({
            isSuccess: true,
            code: 200,
            message: "투표 추가 성공"
        });

    }
    catch(err){

        await connection.rollback();
        await connection.release();
     
        logger.error(`투표 추가 실패\n: ${err.message}`);
        return res.json({
            message:err.message,
            code:500,
            isSuccess:false
        });
    }
}


exports.updateNotice=async(req,res)=>{
    
    const userId=req.verifiedToken.id;

    const {notice}=req.body;

    let roomId=req.params.roomId;
    let noticeId=req.params.noticeId;
    

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

    if(!notice){
        return res.json({
            code:463,
            isSuccess:false,
            message:"공지를  입력하세요"
        })
    }
    if(typeof(notice)!='string'){
        return res.json({
            code:464,
            isSuccess:false,
            message:"공지는 문자열입니다"
        })
    }

    

    if(!noticeId){
        return res.json({
            isSuccess:false,
            message:'공지아이디를 입력해주세요',
            code:468
        })
    }

    regexp=/[^0-9]/g;
    regres=noticeId.search(regexp);
    if(regres!=-1){
        return res.json({
            code:469,
            isSuccess:false,
            message:"공지 아이디는 숫자입니다"
        })
    }
    noticeId=Number(noticeId);




  
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

        const notices=await noticeVoteDao.selectNotice(noticeId);
       
        if(notices.length<1){
            return res.json({
                isSuccess:false,
                message:'없는 공지 아이디입니다',
                code:470
            })
        }

        if(notices[0].userId!=userId){
            return res.json({
                isSuccess:false,
                message:'권한이 없습니다',
                code:458
            })
        }

        await noticeVoteDao.updateNotice(noticeId,notice);


        return res.json({
            isSuccess: true,
            code: 200,
            message: "공지 수정 성공"
        });

    }
    catch(err){
        logger.error(`공지 수정 실패\n: ${err.message}`);
        return res.json({
            message:err.message,
            code:500,
            isSuccess:false
        });
    }
}



exports.updateVote=async(req,res)=>{
    
    const userId=req.verifiedToken.id;

    const {title,choiceArr}=req.body;

    let roomId=req.params.roomId;
    let voteId=req.params.voteId;
    

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

    if(!title){
        return res.json({
            code:464,
            isSuccess:false,
            message:"제목을 입력하세요"
        })
    }
    if(typeof(title)!='string'){
        return res.json({
            code:465,
            isSuccess:false,
            message:"제목은 문자열입니다"
        })
    }

    if(!choiceArr){
        return res.json({
            code:466,
            isSuccess:false,
            message:"투표내용을 입력해주세요"
        })
    }

    for(let _ of choiceArr){
        if(typeof(_)!='string'){
            return res.json({
                code:467,
                isSuccess:false,
                message:"투표내용은 문자열입니다"
            })
        }
    }

    

    if(!voteId){
        return res.json({
            isSuccess:false,
            message:'투표아이디를 입력해주세요',
            code:471
        })
    }

    regexp=/[^0-9]/g;
    regres=voteId.search(regexp);
    if(regres!=-1){
        return res.json({
            code:472,
            isSuccess:false,
            message:"투표 아이디는 숫자입니다"
        })
    }
    voteId=Number(voteId);


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

        const vote=await noticeVoteDao.selectVote(voteId);
       
        if(vote.length<1){
            return res.json({
                isSuccess:false,
                message:'없는 투표 아이디입니다',
                code:473
            })
        }

        if(vote[0].userId!=userId){
            return res.json({
                isSuccess:false,
                message:'권한이 없습니다',
                code:458
            })
        }


        
        await connection.beginTransaction();

        const query1= `
        UPDATE Vote SET title=? WHERE id=?
        `;
        const param1=[title,voteId];
        await connection.query(
            query1,
            param1
        );
        
        const query2= `
        DELETE FROM VoteChoice WHERE voteId=?;
        `;
        const param2=[voteId];
        await connection.query(
            query2,
            param2
        );

        for(let _ of choiceArr){
            const query3= `
            INSERT INTO VoteChoice(voteId,choice) VALUES(?,?);
            `;
            const param3=[voteId,_];
            await connection.query(
                query3,
                param3
            );
        }



        await connection.commit();
        await connection.release();




        return res.json({
            isSuccess: true,
            code: 200,
            message: "투표 수정 성공"
        });

    }
    catch(err){

        
        await connection.rollback();
        await connection.release();
        logger.error(`투표 수정 실패\n: ${err.message}`);
        return res.json({
            message:err.message,
            code:500,
            isSuccess:false
        });
    }
}
