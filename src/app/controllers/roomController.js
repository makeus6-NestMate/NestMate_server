const {pool} = require('../../../config/database');
const {logger} = require('../../../config/winston');

const roomDao = require('../dao/roomDao');
const authDao=require('../dao/authDao');
const regexEmail = require('regex-email');
const { RoomContext } = require('twilio/lib/rest/insights/v1/room');

exports.createRoom = async(req, res)=> {
    const {
        color,name
    } = req.body;

    const userId=req.verifiedToken.id;

    if(!name){
        return res.json({
            isSuccess:false,
            message:'둥지이름을 입력해주세요',
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

        if(user.length<1){
            return res.json({
                isSuccess:false,
                message:'없는 아이디입니다',
                code:403
            })
        }

        await connection.beginTransaction();

        //await roomDao.insertRoom(name,color);        
        //const room=await roomDao.selectMaxRoom();
        //await roomDao.insertRoomUser(room.maxId,userId);

        const query1= `
        INSERT INTO Room(name,color) VALUES(?,?);
        `;
        const param1=[name,color];
        await connection.query(
            query1,
            param1
        );


        const query2= `
        SELECT MAX(id) AS maxId FROM Room;
        `;
        const param2=[];
        const [[roomId]] = await connection.query(
            query2,
            param2
        );

        



        const query3= `
        INSERT INTO RoomUser(roomId,userId,isPresident) VALUES(?,?,?);
        `;
        const param3=[roomId.maxId,userId,'Y'];
        await connection.query(
            query3,
            param3
        );



        await connection.commit();
        await connection.release();
        
        return res.json({
            isSuccess: true,
            code: 200,
            message: "둥지만들기 성공"
        });

    } catch (err) {
        await connection.rollback();
        await connection.release();
     
        logger.error(`둥지만들기 실패\n: ${err.message}`);
        return res.json({
            message:err.message,
            code:500,
            isSuccess:false
        });
    }
};



exports.enterRoom = async(req, res)=> {
    const {
        email
    } = req.body;

    let roomId=req.params.roomId;
    const userId=req.verifiedToken.id;

    if (!email){
        return res.json({
            isSuccess: false, 
            code: 416, 
            message: "이메일을 입력해주세요."
        });
    }

    if (!regexEmail.test(email)){
        return res.json({
            isSuccess: false,
            code:417,
            message: "이메일을 형식을 지켜주세요"
        });
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

        const userEmail=await authDao.selectUserByEmail(email);
        if(userEmail.length<1){
            return res.json({
                isSuccess:false,
                message:'없는 유저입니다',
                code:436
            })
        }

        const roomUser=await roomDao.selectRoomUser(roomId,userEmail[0].id);
        if(roomUser.length>0){
            return res.json({
                isSuccess:false,
                message:'이미 방에 있는 멤버입니다',
                code:433
            })
        }
        
 


        await roomDao.insertMember(roomId,userEmail[0].id,'N');
        
        return res.json({
            isSuccess: true,
            code: 200,
            message: "둥지 초대 성공"
        });


    }
    catch(err){
    
        logger.error(`둥지 초대 실패\n: ${err.message}`);
        return res.json({
            message:err.message,
            code:500,
            isSuccess:false
        });
    }

};


exports.leaveRoom=async(req,res)=>{
    
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

        await connection.beginTransaction();

        const query1= `
        DELETE FROM RoomUser WHERE roomId=? AND userId=?
        `;
        const param1=[roomId,userId];
        await connection.query(
            query1,
            param1
        );

        const query2= `
        SELECT * FROM RoomUser WHERE roomId=?
        `;
        const param2=[roomId];
        const [room]=await connection.query(
            query2,
            param2
        );

        if(room.length<1){

            const query3= `
            DELETE FROM Room WHERE id=?
            `;
            const param3=[roomId];
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
            message: "둥지 나가기 성공",
        });


    }
    catch(err){
        await connection.rollback();
        await connection.release();
    
        logger.error(`둥지 나가기 실패\n: ${err.message}`);
        return res.json({
            message:err.message,
            code:500,
            isSuccess:false
        });
    }
}



exports.getRoom=async(req,res)=>{
    
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

        let roomInfo=[];
        
        const rooms=await roomDao.selectRoomByUser(userId);
        for(let _ of rooms){
            let ob={};
            ob.roomId=_.id;
            ob.roomName=_.name;
            ob.roomColor=_.color;
            const users=await roomDao.selectUserInfo(_.id);
            ob.members=users;
            roomInfo.push(ob);
        }






        
        
        return res.json({
            isSuccess: true,
            code: 200,
            message: "둥지 조회 성공",
            result:{
                roomInfo:roomInfo,
                userName:user[0].nickname
            }
        });


    }
    catch(err){
    
        logger.error(`둥지 조회 실패\n: ${err.message}`);
        return res.json({
            message:err.message,
            code:500,
            isSuccess:false
        });
    }
}




exports.updateRoom = async(req, res)=> {
    const {
        color,name
    } = req.body;

    let roomId=req.params.roomId;
    const userId=req.verifiedToken.id;

  

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

  
        const roomUser=await roomDao.selectRoomUser(roomId,userId);
        if(roomUser.length<1){
            return res.json({
                isSuccess:false,
                message:'권한이 없습니다',
                code:458
            })
        }

        await roomDao.updateRoom(color,name,roomId);
        

        
        return res.json({
            isSuccess: true,
            code: 200,
            message: "둥지 수정 성공"
        });


    }
    catch(err){
    
        logger.error(`둥지 수정 실패\n: ${err.message}`);
        return res.json({
            message:err.message,
            code:500,
            isSuccess:false
        });
    }

};




exports.getMember = async(req, res)=> {
 

    let roomId=req.params.roomId;
    const userId=req.verifiedToken.id;

  

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

  

        const member=await roomDao.getMember(roomId);
        

        
        return res.json({
            isSuccess: true,
            code: 200,
            message: "초대한 인원들 가져오기 성공",
            result:{
                member:member
            }
        });


    }
    catch(err){
    
        logger.error(`초대한 인원들 가져오기 실패\n: ${err.message}`);
        return res.json({
            message:err.message,
            code:500,
            isSuccess:false
        });
    }

};
