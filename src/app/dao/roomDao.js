const {fun1}=require('../../../config/functions');


/*
exports.selectMaxRoom=()=>{
    const query= `
      SELECT MAX(id) AS maxId FROM Room;
    `;
    const param=[];
  
    return fun1(query,param);
}

exports.insertRoom=async (name,color)=>{
  const query= `
    INSERT INTO Room(name,color) VALUES(?,?);
  `;
  const param=[name,color];
 
  return fun1(query,param);
}

exports.insertRoomUser=async(roomId,userId)=>{
    const query= `
      INSERT INTO RoomUser(roomId,userId) VALUES(?,?);
    `;
    const param=[roomId,userId];
  
    return fun1(query,param);
}*/

exports.selectRoom=(roomId)=>{
  const query=`
    SELECT * FROM Room WHERE id=?
  `
  const param=[roomId];

  return fun1(query,param); 
};

exports.insertMember=(roomId,userId,isPresident)=>{
  const query=`
  INSERT INTO RoomUser(roomId,userId,isPresident) VALUES(?,?,?);
  `
  const param=[roomId,userId,isPresident];
  return fun1(query,param); 
};

exports.selectRoomUser=(roomId,userId)=>{
  const query=`
  SELECT * FROM RoomUser WHERE roomId=? AND userId=?;
  `
  const param=[roomId,userId];
  return fun1(query,param); 
}

exports.selectRoomByUser=(userId)=>{
  const query=`
  SELECT Room.id,Room.color,Room.name
  FROM RoomUser INNER JOIN Room ON RoomUser.roomId=Room.id
  WHERE RoomUser.userId=?;
  `
  const param=[userId];
  return fun1(query,param); 
}


exports.selectUserInfo=(roomId)=>{
  const query=`
  SELECT User.profileImg,User.nickname
  FROM RoomUser INNER JOIN User ON RoomUser.userId=User.id
  WHERE RoomUser.roomId=?;
  `
  const param=[roomId];
  return fun1(query,param); 
}

// 방에 있는 멤버 가져오기
exports.selectCock=(roomId)=>{
  const query=`
  SELECT userId AS memberId,nickname
  FROM User INNER JOIN RoomUser ON User.id=RoomUser.userId
  WHERE RoomUser.roomId=?
  `
  const param=[roomId];
  return fun1(query,param); 
}

exports.updateRoom=(color,name,roomId)=>{
  const query=`
  UPDATE Room SET color=?,name=? WHERE id=?
  `
  const param=[color,name,roomId];
  return fun1(query,param); 
}

exports.getMember=(roomId)=>{
  const query=`
  SELECT profileImg,nickname,RoomUser.userId
  FROM RoomUser INNER JOIN User ON RoomUser.userId=User.id
  WHERE roomId=?
  `
  const param=[roomId];
  return fun1(query,param); 
}