const {pool} = require('../../../config/database');
const {logger} = require('../../../config/winston');

const authDao=require('../dao/authDao');
const roomDao = require('../dao/roomDao');
const calendarDao=require('../dao/calendarDao');
const moment=require('moment');



exports.postCalendar=async(req,res)=>{
    
    const userId=req.verifiedToken.id;

    const {category,title,categoryIdx}=req.body;
    let {content}=req.body;
    let {time}=req.body;
    let roomId=req.params.roomId;
    
    if(categoryIdx===null||categoryIdx===undefined){
        return res.json({
            isSuccess:false,
            message:'카테고리 아이디를 입력해주세요',
            code:488
        })
    }
    if(typeof(categoryIdx)!='number'){
        return res.json({
            isSuccess:false,
            message:'카테고리 아이디는 숫자입니다',
            code:489
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

    if(!category){
        return res.json({
            code:474,
            isSuccess:false,
            message:"카테고리를 입력해주세요"
        })
    }

    if(typeof(category)!='string'){
        return res.json({
            code:475,
            isSuccess:false,
            message:"카테고리는 문자열입니다"
        })
    }

    if(!time){
        return res.json({
            isSuccess:false,
            message:'시간을 입력해주세요',
            code:476
        })
    }
    
    if(typeof(time)!='string'){
        return res.json({
            isSuccess:false,
            message:'시간은 문자열입니다',
            code:477
        })
    }
    let cnt=0;
    for(let _ of time){
        if(_==='/') cnt++;
    }
    if(cnt!=4){
        return res.json({
            isSuccess:false,
            message:'년 월 일 시간 분 다 입력해주세요',
            code:478
        })
    }

    let times=time.split('/');

    time=times[0]+'/'+times[1]+'/'+times[2]+' '+times[3]+':'+times[4];
    
    if(!title){
        return res.json({
            isSuccess:false,
            message:'제목을 입력해주세요',
            code:479
        })
    }
    
    if(typeof(title)!='string'){
        return res.json({
            isSuccess:false,
            message:'제목은 문자열입니다',
            code:480
        })
    }
    if(!content) content="";
    



  
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

        await calendarDao.insertCalendar(roomId,userId,title,content,time,category,categoryIdx);

        
        
        return res.json({
            isSuccess: true,
            code: 200,
            message: "일정 추가 성공"
        });

    }
    catch(err){
        logger.error(`일정 추가 실패\n: ${err.message}`);
        return res.json({
            message:err.message,
            code:500,
            isSuccess:false
        });
    }
}





exports.updateCalendar=async(req,res)=>{
    
    const userId=req.verifiedToken.id;

    const {category,title,categoryIdx}=req.body;

    let {time,content}=req.body;
    let roomId=req.params.roomId;
    let calendarId=req.params.calendarId;

    if(!categoryIdx){
        return res.json({
            isSuccess:false,
            message:'카테고리 아이디를 입력해주세요',
            code:488
        })
    }
    if(typeof(categoryIdx)!='number'){
        return res.json({
            isSuccess:false,
            message:'카테고리 아이디는 숫자입니다',
            code:489
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

    if(!category){
        return res.json({
            code:474,
            isSuccess:false,
            message:"카테고리를 입력해주세요"
        })
    }

    if(typeof(category)!='string'){
        return res.json({
            code:475,
            isSuccess:false,
            message:"카테고리는 문자열입니다"
        })
    }

    if(!time){
        return res.json({
            isSuccess:false,
            message:'시간을 입력해주세요',
            code:476
        })
    }
    
    if(typeof(time)!='string'){
        return res.json({
            isSuccess:false,
            message:'시간은 문자열입니다',
            code:477
        })
    }
    let cnt=0;
    for(let _ of time){
        if(_==='/') cnt++;
    }
    if(cnt!=4){
        return res.json({
            isSuccess:false,
            message:'년 월 일 시간 분 다 입력해주세요',
            code:478
        })
    }

    let times=time.split('/');

    time=times[0]+'/'+times[1]+'/'+times[2]+' '+times[3]+':'+times[4];
    
    if(!title){
        return res.json({
            isSuccess:false,
            message:'제목을 입력해주세요',
            code:479
        })
    }
    
    if(typeof(title)!='string'){
        return res.json({
            isSuccess:false,
            message:'제목은 문자열입니다',
            code:480
        })
    }

    if(!content) content="";
    
    if(!calendarId){
        return res.json({
            isSuccess:false,
            message:'일정 아이디를 입력해주세요',
            code:483
        })
    }

    regexp=/[^0-9]/g;
    regres=calendarId.search(regexp);
    if(regres!=-1){
        return res.json({
            code:484,
            isSuccess:false,
            message:"일정 아이디는 숫자입니다"
        })
    }
    calendarId=Number(calendarId);


  
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

        const calendar=await calendarDao.selectCalendar(calendarId);

        if(calendar.length<1){
            return res.json({
                isSuccess:false,
                message:'없는 일정아이디입니다',
                code:485
            })
        }
        if(calendar[0].userId!=userId){
            return res.json({
                isSuccess:false,
                message:'권한이 없습니다',
                code:458
            })
        }

        
        await calendarDao.updateCalendar(calendarId,title,content,time,category,categoryIdx);

        
        return res.json({
            isSuccess: true,
            code: 200,
            message: "일정 수정 성공"
        });

    }
    catch(err){
        logger.error(`일정 수정 실패\n: ${err.message}`);
        return res.json({
            message:err.message,
            code:500,
            isSuccess:false
        });
    }
}




exports.deleteCalendar=async(req,res)=>{
    
    const userId=req.verifiedToken.id;

   
    let roomId=req.params.roomId;
    let calendarId=req.params.calendarId;

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


    
    if(!calendarId){
        return res.json({
            isSuccess:false,
            message:'일정 아이디를 입력해주세요',
            code:483
        })
    }

    regexp=/[^0-9]/g;
    regres=calendarId.search(regexp);
    if(regres!=-1){
        return res.json({
            code:484,
            isSuccess:false,
            message:"일정 아이디는 숫자입니다"
        })
    }
    calendarId=Number(calendarId);


  
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

        const calendar=await calendarDao.selectCalendar(calendarId);

        if(calendar.length<1){
            return res.json({
                isSuccess:false,
                message:'없는 일정아이디입니다',
                code:485
            })
        }
        if(calendar[0].userId!=userId){
            return res.json({
                isSuccess:false,
                message:'권한이 없습니다',
                code:458
            })
        }

        await calendarDao.deleteCalendar(calendarId);

        
        return res.json({
            isSuccess: true,
            code: 200,
            message: "일정 삭제 성공"
        });

    }
    catch(err){
        logger.error(`일정 삭제 실패\n: ${err.message}`);
        return res.json({
            message:err.message,
            code:500,
            isSuccess:false
        });
    }
}




exports.getCalendar=async(req,res)=>{
    
    const userId=req.verifiedToken.id;

    let roomId=req.params.roomId;
    let date=req.query.date;

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


    if(!date){
        return res.json({
            isSuccess:false,
            message:'날짜를 입력해주세요',
            code:486
        })
    }
    
    let cnt=0;
    for(let _ of date){
        if(_==='/') cnt++;
    }
    if(cnt!=1){
        return res.json({
            isSuccess:false,
            message:'년 월 다 입력해주세요',
            code:487
        })
    }

    date=date.split('/');

  


  
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

        const calendar=await calendarDao.selectCalendarByDate(roomId,Number(date[0]),Number(date[1]));

        for(let _ of calendar){
            _.time=moment(_.time).format('YYYY/MM/DD/HH/mm');

            const times=_.time.split('/');
            const categories=await calendarDao.selectCalendarByDate1(roomId,times[0],times[1],times[2]);
            _.categories=categories;

        }

        






        
        return res.json({
            isSuccess: true,
            code: 200,
            message: "일정 조회 성공",
            result:{
                calendar:calendar
            }
        });

    }
    catch(err){
        logger.error(`일정 조회 실패\n: ${err.message}`);
        return res.json({
            message:err.message,
            code:500,
            isSuccess:false
        });
    }
}



exports.getDetailCalendar=async(req,res)=>{
    
    const userId=req.verifiedToken.id;

    let roomId=req.params.roomId;
    let date=req.query.date;
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


    if(!date){
        return res.json({
            isSuccess:false,
            message:'날짜를 입력해주세요',
            code:486
        })
    }
    
    let cnt=0;
    for(let _ of date){
        if(_==='/') cnt++;
    }
    if(cnt!=2){
        return res.json({
            isSuccess:false,
            message:'년 월 일 다 입력해주세요',
            code:488
        })
    }

    date=date.split('/');

  


  
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

        const calendar=await calendarDao.selectCalendarByDetailDate(roomId,Number(date[0]),Number(date[1]),Number(date[2]),page);


        for(let _ of calendar){
            _.time=moment(_.time).format('YYYY/MM/DD/HH/mm');
        }
        
        return res.json({
            isSuccess: true,
            code: 200,
            message: "일정 상세 조회 성공",
            result:{
                calendar:calendar
            }
        });

    }
    catch(err){
        logger.error(`일정 상세 조회 실패\n: ${err.message}`);
        return res.json({
            message:err.message,
            code:500,
            isSuccess:false
        });
    }
}




