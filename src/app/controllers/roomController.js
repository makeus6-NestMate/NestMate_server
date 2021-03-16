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
        INSERT INTO RoomUser(roomId,userId) VALUES(?,?);
        `;
        const param3=[roomId.maxId,userId];
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
        roomId
    } = req.body;

    const userId=req.verifiedToken.id;

    if(!roomId){
        return res.json({
            isSuccess:false,
            message:'방 아이디를 입력해주세요',
            code:435
        })
    }

    if(typeof(room)!='number'){
        return res.json({
            isSuccess:false,
            message:'방 아이디는 숫자입니다',
            code:434
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
  
        const roomUser=await roomDao.selectRoomUser(roomId,userId);
        if(roomUser.length>0){
            return res.json({
                isSuccess:false,
                message:'이미 방에 있는 멤버입니다',
                code:433
            })
        }
        



        await roomDao.insertMember(roomId,userId);
        
        return res.json({
            isSuccess: true,
            code: 200,
            message: "둥지 입장 성공"
        });


    }
    catch(err){
    
        logger.error(`둥지 입장 실패\n: ${err.message}`);
        return res.json({
            message:err.message,
            code:500,
            isSuccess:false
        });
    }

};


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

        var roomInfo=[];
        
        const rooms=await roomDao.selectRoomByUser(userId);
        for(var _ of rooms){
            var ob={};
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