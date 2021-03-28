const {fun1}=require('../../../config/functions');

exports.selectUserByEmail=(email)=>{
  const query= `
    SELECT * FROM User WHERE email=?;
  `;
  const param=[email];
  return fun1(query,param);
}

exports.selectUserById=(id)=>{
  const query=`
    SELECT * FROM User WHERE id=?
  `;
  const param=[id];
  return fun1(query,param);
}


exports.insertUserInfo=(email,hashedPassword,name,phoneNumber,profileImg,nickname)=>{
  const query= `
    INSERT INTO User(email,password,name,phoneNumber,profileImg,nickname,prizeCount) VALUES(?,?,?,?,?,?,0);
  `;
  const param=[email,hashedPassword,name,phoneNumber,profileImg,nickname];
  return fun1(query,param);
}

exports.selectUserByPhone=(phoneNumber)=>{
  const query=`
    SELECT * FROM User WHERE phoneNumber=?;
  `;
  const param=[phoneNumber];
  return fun1(query,param);
}