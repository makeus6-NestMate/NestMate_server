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


exports.getNotice=(roomId)=>{
    const query=`
    SELECT profileImg,Notice.id AS noticeId , notice , Notice.createdAt
    FROM Notice INNER JOIN User ON Notice.userId=User.id
    `
    const param=[roomId];
    return fun1(query,param); 
};


exports.getVote=(roomId)=>{
    const query=`
    SELECT profileImg,Vote.id AS voteId , title , Vote.createdAt, isFinished
    FROM Vote INNER JOIN User ON Vote.userId=User.id
    `
    const param=[roomId];
    return fun1(query,param); 
};

exports.getVoteChoice=(voteId)=>{
    const query=`
    SELECT choice,id AS choiceId
    FROM VoteChoice
    WHERE voteId=?
    `
    const param=[voteId];
    return fun1(query,param); 
};

exports.selectVoteChoice=(choiceId)=>{
    const query=`
   SELECT *
   FROM VoteChoice
   WHERE id=?
    `
    const param=[choiceId];
    return fun1(query,param); 
};

exports.insertVoteChoiceUser=(choiceId,userId)=>{
    const query=`
    INSERT INTO VoteChoiceUser(choiceId,userId) VALUES(?,?)
    `
    const param=[choiceId,userId];
    return fun1(query,param); 
};

exports.selectVoteChoiceUser=(choiceId,userId)=>{
    const query=`
    SELECT * 
    FROM VoteChoiceUser
    WHERE choiceId=? AND userId=?
    `
    const param=[choiceId,userId];
    return fun1(query,param); 
};



