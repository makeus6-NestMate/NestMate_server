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


exports.getNoticeVoteId=(roomId,page)=>{
    const query=`
    SELECT *
    FROM(
        (SELECT Notice.id AS noticeId , null AS voteId
        FROM Notice 
        WHERE Notice.roomId=?) 
        UNION 
        (SELECT null AS noticeId , Vote.id AS voteId
        FROM Vote 
        WHERE Vote.roomId=?) ) A 
    LIMIT ${page*7},7
    `
    const param=[roomId,roomId];
    return fun1(query,param); 
}





exports.getNotice=(roomId,noticeId)=>{
    const query=`
    SELECT profileImg,Notice.id AS noticeId , notice , Notice.createdAt,User.id AS userId
    FROM Notice INNER JOIN User ON Notice.userId=User.id
    WHERE Notice.roomId=? AND Notice.id=?
    
    `
    const param=[roomId,noticeId];
    return fun1(query,param); 
};


exports.getVote=(roomId,voteId)=>{
    const query=`
    SELECT profileImg,Vote.id AS voteId , title , Vote.createdAt, isFinished,User.id AS userId
    FROM Vote INNER JOIN User ON Vote.userId=User.id
    WHERE Vote.roomId=? AND Vote.id=?
    `
    const param=[roomId,voteId];
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


exports.selectVoteChoiceUser=(voteId,userId)=>{
    const query=`
    SELECT * 
    FROM VoteChoiceUser INNER JOIN VoteChoice ON VoteChoiceUser.choiceId=VoteChoice.id
    WHERE  voteId=? AND userId=?
    `
    const param=[voteId,userId];
    return fun1(query,param); 
};

exports.selectParticipant=(voteId,roomId)=>{
    const query=`
    SELECT * 
    `
    const param=[voteId,userId];
    return fun1(query,param); 
}




exports.selectVoteChoices=(voteId)=>{
    const query=`
    SELECT VoteChoice.id AS choiceId,choice,
    CASE WHEN (SELECT COUNT(*) FROM VoteChoiceUser WHERE VoteChoiceUser.choiceId=VoteChoice.id) is null 
        THEN 0
        ELSE (SELECT COUNT(*) FROM VoteChoiceUser WHERE VoteChoiceUser.choiceId=VoteChoice.id)
    END AS memberCnt
    FROM VoteChoice LEFT OUTER JOIN VoteChoiceUser ON VoteChoice.id=VoteChoiceUser.choiceId
    WHERE voteId=?
    ORDER BY VoteChoice.id
    `
    const param=[voteId];
    return fun1(query,param); 
};


exports.selectUnVoteMember=(roomId,voteId)=>{
    const query= `
    SELECT (SELECT COUNT(DISTINCT userId) FROM RoomUser WHERE roomId=?) AS roomMemberCnt,
    (SELECT COUNT(DISTINCT userId) FROM VoteChoice INNER JOIN VoteChoiceUser
    ON VoteChoice.id=VoteChoiceUser.choiceId WHERE voteId=? ) AS voteMemberCnt
    `;

    const param=[roomId,voteId];
    return fun1(query,param);
};


exports.selectVoteMember=(choiceId)=>{
    const query= `
    SELECT profileImg,nickname
    FROM User INNER JOIN VoteChoiceUser ON User.id=VoteChoiceUser.userId
    WHERE choiceId=?
    `;

    const param=[choiceId];
    return fun1(query,param);
};



exports.selectVoteChoicess=(voteId,userId)=>{
    const query= `
    SELECT * 
    FROM Vote INNER JOIN VoteChoice ON Vote.id=VoteChoice.voteId 
    INNER JOIN VoteChoiceUser ON VoteChoice.id=VoteChoiceUser.choiceId
    WHERE Vote.id=? AND VoteChoiceUser.userId=?
    `;

    const param=[voteId,userId];
    return fun1(query,param);
};





