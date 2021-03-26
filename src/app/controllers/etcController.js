const {pool} = require('../../../config/database');
const {logger} = require('../../../config/winston');

const todoDao = require('../dao/todoDao');
const authDao=require('../dao/authDao');
const roomDao = require('../dao/roomDao');
const etcDao=require('../dao/etcDao');
const moment=require('moment');
const cron=require('node-cron');

cron.schedule('1 0 * * Mon',async()=>{

    const s=moment().startOf('week').subtract(6,'days').format('YY/MM/DD HH:mm');
    const e=moment().endOf('week').subtract(6,'days').format('YY/MM/DD HH:mm');

    const rooms=await etcDao.selectAllRoom();


    for(let _ of rooms){
        const members=await etcDao.selectComplete(s,e,_.id);

        let id,num=-1;
        for(let __ of members){
            if(__.cnt>num) id=__.user;
        }

        if(num!=-1){

            const connection = await pool.getConnection(async conn => conn);

            try{
                await connection.beginTransaction();

                const [user]=await authDao.selectUserById(id);
    
                const query1= `
                UPDATE User SET prizeCnt=prizeCount+1 WHERE id=?  
                `;
                const param1=[id];
                await connection.query(
                    query1,
                    param1
                );

                const query2= `
                INSERT INTO Alarm(senderId,receiverId,message) VALUES(?,?,?)
                `;
                const param2=[id,id,`${user.nickname}님 저번 주 최고의 메이트 축하드립니다`];
                await connection.query(
                    query2,
                    param2
                );

                await connection.commit();
                await connection.release();
    
            }
            catch(err){
                    
                await connection.rollback();
                await connection.release();
                logger.error(`업데이트 실패\n: ${err.message}`);
    
    
            }
            
        }

   




    }

    
})




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


        const s=moment().startOf('week').subtract(6,'days').format('YY/MM/DD HH:mm');
        const e=moment().endOf('week').subtract(6,'days').format('YY/MM/DD HH:mm');

        const members=await etcDao.selectComplete(s,e,roomId);

        let id,num=-1;
        for(let _ of members){
            if(_.cnt>num){
                id=_.userId;
                num=_.cnt;
            }
        }

        let bestMember={};
        if(num!=-1){
            const info=await etcDao.selectBestMember(id);
            bestMember.userId=id;
            bestMember.profileImg=info[0].profileImg;
            bestMember.prizeCount=info[0].prizeCount;
            bestMember.nickname=info[0].nickname;
        }
        




        const member=await etcDao.selectMember(roomId);

        let map=new Map();

        let chart=[];
        
        
        for(let i=1;i<=7;i++){

            let ob=[];

            for(let _ of member){
                map.set(_.userId,0);
            }

            const start=moment().startOf('week').add(i,'days').format('YY/MM/DD HH:mm');
            const end=moment().startOf('week').endOf('day').add(i,'days').format('YY/MM/DD HH:mm');

            const complete=await etcDao.selectComplete(start,end,roomId);

            for(let _ of complete){
                if(map.has(_.userId)){
                    let before=map.get(_.userId);
                    map.set(_.userId,before+_.cnt);
                }
            }

            for(let [key,value] of map){
                let obb={};
                obb.userId=key;
                obb.count=value;
                ob.push(obb);
            }
            chart.push(ob);
        }


        return res.json({
            isSuccess: true,
            code: 200,
            message: "차트 조회 성공",
            result:{
                chart:chart,
                bestMember:bestMember,
                member:member
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





exports.getAlarm=async(req,res)=>{
    
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

        const alarm=await etcDao.selectAlarm(userId,roomId); 
        
        for(let _ of alarm){
            _.createdAt=moment(_.createdAt).format('YYYY/MM/DD/HH/mm');
        }


        return res.json({
            isSuccess: true,
            code: 200,
            message: "알림 조회 성공",
            result:{
                alarm:alarm
            }
        });


    }
    catch(err){
        logger.error(`알림 조회 실패\n: ${err.message}`);
        return res.json({
            message:err.message,
            code:500,
            isSuccess:false
        });
    }
}



exports.postClap=async(req,res)=>{
    
    const userId=req.verifiedToken.id;
    let roomId=req.params.roomId;
    let memberId=req.params.memberId;

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

    if(!memberId){
        return res.json({
            isSuccess:false,
            message:'멤버 아이디를 입력해주세요',
            code:495
        })
    }

    regexp=/[^0-9]/g;
    regres=memberId.search(regexp);
    if(regres!=-1){
        return res.json({
            code:496,
            isSuccess:false,
            message:"멤버 아이디는 숫자입니다"
        })
    }
    memberId=Number(memberId);

    try{

        const user=await authDao.selectUserById(userId);


        if(user.length<1){
            return res.json({
                isSuccess:false,
                message:'없는 아이디입니다',
                code:403
            })
        }

        const member=await authDao.selectUserById(memberId);


        if(member.length<1){
            return res.json({
                isSuccess:false,
                message:'없는 아이디입니다',
                code:403
            })
        }



        await etcDao.insertClap(userId,memberId,`${user[0].nickname}님이 최고의 메이트에 박수를 보냈습니다`); 



        return res.json({
            isSuccess: true,
            code: 200,
            message: "박수 보내기 성공"
        });


    }
    catch(err){
        logger.error(`박수 보내기 실패\n: ${err.message}`);
        return res.json({
            message:err.message,
            code:500,
            isSuccess:false
        });
    }
}