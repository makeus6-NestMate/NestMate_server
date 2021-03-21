const {fun1}=require('../../../config/functions');

exports.insertMemo=(memo,memoColor,x,y,userId,roomId)=>{
    const query=`
    INSERT INTO Memo(memo,memoColor,x,y,userId,roomId) VALUES(?,?,?,?,?,?);
    `
    const param=[memo,memoColor,x,y,userId,roomId];
    return fun1(query,param); 
};

exports.selectMemo=(roomId)=>{
    const query=`
    SELECT Memo.id AS memoId,profileImg,Memo.createdAt,Memo.memo,Memo.memoColor,
    Memo.width,Memo.height,Memo.x,Memo.y
    FROM Memo INNER JOIN User ON Memo.userId=User.id
    WHERE Memo.roomId=?
    `
    const param=[roomId];
    return fun1(query,param); 
};

exports.selectMemoById=(memoId)=>{
    const query=`
    SELECT id,userId
    FROM Memo
    WHERE Memo.id=?
    `
    const param=[memoId];
    return fun1(query,param); 
};

exports.updateMemo=(memoId,memo,memoColor)=>{
    const query=`
    UPDATE Memo SET memo=? AND memoColor=? WHERE memoId=?
    `
    const param=[memo,memoColor,width,height,memoId];
    return fun1(query,param); 
};

exports.deleteMemo=(memoId)=>{
    const query=`
    DELETE FROM Memo WHERE id=?
    `
    const param=[memoId];
    return fun1(query,param); 
};


