const {fun1}=require('../../../config/functions');

exports.updateProfile=(userId,nickname,img)=>{
    const query=`
    UPDATE User SET nickname=?,profileImg=? WHERE id=?
    `
    const param=[nickname,img,userId];
    return fun1(query,param); 
};

exports.selectProfile=(userId)=>{
    const query=`
    SELECT profileImg,nickname,prizeCount
    FROM User
    WHERE id=?
    `
    const param=[userId];
    return fun1(query,param); 
};


exports.selectComplete=(start,end,roomId)=>{
    const query=`
        SELECT TodoUser.userId,COUNT(*) AS cnt
        FROM RoomUser INNER JOIN TodoUser ON RoomUser.userId=TodoUser.userId
        WHERE RoomUser.roomId=? AND TodoUser.createdAt BETWEEN ? AND ?
        GROUP BY TodoUser.userId
        ORDER BY TodoUser.userId
    `
    const param=[roomId,start,end];
    return fun1(query,param); 
};

exports.selectMember=(roomId)=>{
    const query=`
        SELECT RoomUser.userId,profileImg,nickname
        FROM RoomUser INNER JOIN User ON RoomUser.userId=User.id
        WHERE RoomUser.roomId=?
    `
    const param=[roomId];
    return fun1(query,param); 
};



exports.selectBestMember=(userId)=>{
    const query=`
        SELECT profileImg,prizeCount,nickname
        FROM User
        WHERE id=?
        ORDER BY id;
    `
    const param=[userId];
    return fun1(query,param); 
};

exports.selectAlarm=(userId,roomId,page)=>{
    const query=`

        SELECT User.profileImg,Send.message,Send.createdAt
        FROM User INNER JOIN
        (SELECT senderId,message,Alarm.createdAt
        FROM Alarm INNER JOIN User ON Alarm.receiverId=User.id
        INNER JOIN RoomUser ON RoomUser.userId=User.id
        WHERE RoomUser.roomId=? AND User.id=?) Send
        ON User.id=Send.senderId
        LIMIT ${page*10},10
    `
    const param=[roomId,userId];
    return fun1(query,param); 
};


exports.insertClap=(userId,memberId,message)=>{
    const query=`
    INSERT INTO Alarm(senderId,receiverId,message) VALUES(?,?,?)
    `
    const param=[userId,memberId,message];
    return fun1(query,param); 
};


exports.selectAllRoom=()=>{
    const query=`
      SELECT * FROM Room
    `
    const param=[];
  
    return fun1(query,param); 
  };
  