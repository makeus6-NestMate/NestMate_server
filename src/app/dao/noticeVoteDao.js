const {fun1}=require('../../../config/functions');

exports.insertNotice=(roomId,userId,notice)=>{
    const query=`
    INSERT INTO Notice(roomId,userId,notice) VALUES(?,?,?);
    `
    const param=[roomId,userId,notice];
    return fun1(query,param); 
};

exports.selectNotice=(noticeId)=>{
    const query=`
    SELECT * FROM Notice WHERE id=?
    `
    const param=[noticeId];
    return fun1(query,param); 
};

exports.selectVote=(voteId)=>{
    const query=`
    SELECT * FROM Vote WHERE id=?
    `
    const param=[voteId];
    return fun1(query,param); 
};


exports.updateNotice=(noticeId,notice)=>{
    const query=`
    UPDATE Notice SET notice=? WHERE id=?
    `
    const param=[notice,noticeId];
    return fun1(query,param); 
};

exports.deleteNotice=(noticeId)=>{
    const query=`
    DELETE FROM Notice WHERE id=?
    `
    const param=[noticeId];
    return fun1(query,param); 
};