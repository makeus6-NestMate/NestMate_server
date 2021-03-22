const {fun1}=require('../../../config/functions');

exports.insertNotice=(roomId,userId,notice)=>{
    const query=`
    INSERT INTO Notice(roomId,userId,notice) VALUES(?,?,?);
    `
    const param=[roomId,userId,notice];
    return fun1(query,param); 
};