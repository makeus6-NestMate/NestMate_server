const {pool} = require('../../../config/database');
const {logger} = require('../../../config/winston');

const authDao=require('../dao/authDao');
const roomDao = require('../dao/roomDao');
const noticeVoteDao=require('../dao/noticeVoteDao');
const moment=require('moment');



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


exports.deleteNotice=async(req,res)=>{
    
    const userId=req.verifiedToken.id;


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

        await noticeVoteDao.deleteNotice(noticeId);


        return res.json({
            isSuccess: true,
            code: 200,
            message: "공지 삭제 성공"
        });

    }
    catch(err){
        logger.error(`공지 삭제 실패\n: ${err.message}`);
        return res.json({
            message:err.message,
            code:500,
            isSuccess:false
        });
    }
}




exports.deleteVote=async(req,res)=>{
    
    const userId=req.verifiedToken.id;


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
        DELETE FROM Vote WHERE id=?
        `;
        const param1=[voteId];
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


        await connection.commit();
        await connection.release();




        return res.json({
            isSuccess: true,
            code: 200,
            message: "투표 삭제 성공"
        });

    }
    catch(err){

        
        await connection.rollback();
        await connection.release();
        logger.error(`투표 삭제 실패\n: ${err.message}`);
        return res.json({
            message:err.message,
            code:500,
            isSuccess:false
        });
    }
}





exports.getNoticeVote=async(req,res)=>{
    
    const userId=req.verifiedToken.id;


    let roomId=req.params.roomId;
    let page=req.query.page;
 
    

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

    if(!page){
        return res.json({
            code:497,
            isSuccess:false,
            message:"페이지 번호를 입력해주세요"
        })
    }

    regexp=/[^0-9]/g;
    regres=page.search(regexp);
    if(regres!=-1){
        return res.json({
            code:498,
            isSuccess:false,
            message:"페이지 번호는 숫자입니다"
        })
    }
    page=Number(page);
  
  
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


        let result=[];

        let notice=await noticeVoteDao.getNotice(roomId,page);
        let vote=await noticeVoteDao.getVote(roomId,page);
        
        for(let _ of notice){
            let ob=_;
            ob.isNotice='Y';
            ob.createdAt=moment(ob.createdAt).format('YY/MM/DD/HH/mm');
            result.push(ob);
        }

        for(let _ of vote){
            let ob=_;
            ob.createdAt=moment(ob.createdAt).format('YY/MM/DD/HH/mm');
            ob.isNotice='N';
            ob.isFinished=_.isFinished;
            result.push(ob);
        }


        

        return res.json({
            isSuccess: true,
            code: 200,
            message: "투표/공지 조회 성공",
            result:{
                noticeVote:result
            }
        });

    }
    catch(err){

        
        logger.error(`투표/공지 조회 실패\n: ${err.message}`);
        return res.json({
            message:err.message,
            code:500,
            isSuccess:false
        });
    }
}








exports.patchVote=async(req,res)=>{
    
    const userId=req.verifiedToken.id;

    const {choiceId}=req.body;

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



    if(choiceId==undefined||choiceId===null){
        return res.json({
            code:490,
            isSuccess:false,
            message:"선택지 아이디를 입력해주세요"
        })
    }
    if(typeof(choiceId)!='number'){
        return res.json({
            code:491,
            isSuccess:false,
            message:"선택지 아이디는 숫자입니다"
        })
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

        const choice1=await noticeVoteDao.selectVoteChoice(choiceId);
        if(choice1.length<1){
            return res.json({
                isSuccess:false,
                message:'없는 선택지 아이디입니다',
                code:492
            })
        }

        
        const choice2=await noticeVoteDao.selectVoteChoiceUser(voteId,userId);
        if(choice2.length>0){
            return res.json({
                isSuccess:false,
                message:'이미 투표를 하셨습니다.',
                code:493
            })
        }

        
        await connection.beginTransaction();


        const query1= `
        INSERT INTO VoteChoiceUser(choiceId,userId) VALUES(?,?)
        `;
        const param1=[choiceId,userId];
        await connection.query(
            query1,
            param1
        );
        
        const query2= `
        SELECT (SELECT COUNT(DISTINCT userId) FROM RoomUser WHERE roomId=?) AS roomMemberCnt,
        (SELECT COUNT(DISTINCT userId) FROM VoteChoice INNER JOIN VoteChoiceUser
        ON VoteChoice.id=VoteChoiceUser.choiceId WHERE voteId=? ) AS voteMemberCnt
        `;

        const param2=[roomId,voteId];
        const [[result]]=await connection.query(
            query2,
            param2
        );


        if(result.roomMemberCnt===result.voteMemberCnt){
            const query3= `
            UPDATE Vote SET isFinished='Y' WHERE id=?
            `;
    
            const param3=[voteId];
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
            message: "투표 하기 성공"
        });

    }
    catch(err){

        
        await connection.rollback();
        await connection.release();
        logger.error(`투표 하기 실패\n: ${err.message}`);
        return res.json({
            message:err.message,
            code:500,
            isSuccess:false
        });
    }
}







//투표 조회하기
exports.getVote=async(req,res)=>{
    
    const userId=req.verifiedToken.id;


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

    if(!voteId){
        return res.json({
            isSuccess:false,
            message:'투표아이디를 입력해주세요',
            code:471
        })
    }

    regres=voteId.search(regexp);
    if(regres!=-1){
        return res.json({
            code:472,
            isSuccess:false,
            message:"투표 아이디는 숫자입니다"
        })
    }
    voteId=Number(voteId);


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

        const choice=await noticeVoteDao.selectVoteChoices(voteId);
        const [unVoteMember]=await noticeVoteDao.selectUnVoteMember(roomId,voteId);

        const choices=await noticeVoteDao.selectVoteChoicess(voteId,userId);
        
        
        return res.json({
            isSuccess: true,
            code: 200,
            message: "투표 조회 성공",
            result:{
                choiceId:(choices.length<1?-1:choices[0].choiceId),
                isOwner:(vote[0].userId===userId?true:false),
                isFinished:vote[0].isFinished,
                voteTitle:vote[0].title,
                choice:choice,
                unVoteMemeberCnt:unVoteMember.roomMemberCnt-unVoteMember.voteMemberCnt
            }
        });

    }
    catch(err){

        
        logger.error(`투표 조회 실패\n: ${err.message}`);
        return res.json({
            message:err.message,
            code:500,
            isSuccess:false
        });
    }
}


exports.getVoteUser=async(req,res)=>{
    
    const userId=req.verifiedToken.id;


    let roomId=req.params.roomId;
    let voteId=req.params.voteId;
    let choiceId=req.params.choiceId;
    

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


    if(!choiceId){
        return res.json({
            isSuccess:false,
            message:'선택지 아이디를 입력해주세요',
            code:490
        })
    }

    regexp=/[^0-9]/g;
    regres=choiceId.search(regexp);
    if(regres!=-1){
        return res.json({
            code:491,
            isSuccess:false,
            message:"선택지 아이디는 숫자입니다"
        })
    }
    choiceId=Number(choiceId);



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


        const choice1=await noticeVoteDao.selectVoteChoice(choiceId);
        if(choice1.length<1){
            return res.json({
                isSuccess:false,
                message:'없는 선택지 아이디입니다',
                code:492
            })
        }

        const voteMember=await noticeVoteDao.selectVoteMember(choiceId);




        return res.json({
            isSuccess: true,
            code: 200,
            message: "투표 멤버 조회 성공",
            result:{
                voteMember:voteMember
            }
        });

    }
    catch(err){

        
        logger.error(`투표 멤버 조회 실패\n: ${err.message}`);
        return res.json({
            message:err.message,
            code:500,
            isSuccess:false
        });
    }
}



//투표 마감하기
exports.completeVote=async(req,res)=>{
    
    const userId=req.verifiedToken.id;


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


    if(!voteId){
        return res.json({
            isSuccess:false,
            message:'투표아이디를 입력해주세요',
            code:471
        })
    }

    regres=voteId.search(regexp);
    if(regres!=-1){
        return res.json({
            code:472,
            isSuccess:false,
            message:"투표 아이디는 숫자입니다"
        })
    }
    voteId=Number(voteId);


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

        await noticeVoteDao.completeVote(voteId);


        return res.json({
            isSuccess: true,
            code: 200,
            message: "투표 마치기 성공"
        });

    }
    catch(err){

        
        logger.error(`투표 마치기 실패\n: ${err.message}`);
        return res.json({
            message:err.message,
            code:500,
            isSuccess:false
        });
    }
}