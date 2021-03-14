const {fun1}=require('../../../config/functions');

exports.selectMaxRoom=()=>{
    const query= `
      SELECT MAX(id) AS maxId FROM Room;
    `;
    const param=[];
  
    return fun1(query,param);
}

exports.insertRoom=(name,color)=>{
  const query= `
    INSERT INTO Room(name,color) VALUES(?,?);
  `;
  const param=[name,color];

  return fun1(query,param);
}

exports.insertRoomUser=(roomId,userId)=>{
    const query= `
      INSERT INTO RoomUser(roomId,userId) VALUES(?,?);
    `;
    const param=[roomId,userId];
  
    return fun1(query,param);
}