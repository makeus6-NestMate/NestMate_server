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

exports.insertMember=(roomId,userId)=>{
  const query=`
  INSERT INTO RoomUser(roomId,userId) VALUES(?,?);
  `
  const param=[roomId,userId];
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