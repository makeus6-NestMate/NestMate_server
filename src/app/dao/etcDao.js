const {fun1}=require('../../../config/functions');

exports.updateProfile=(userId,nickname,img)=>{
    const query=`
    UPDATE User SET nickname=?,img=? WHERE id=?
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


exports.selectBestUser=(start,end,roomId)=>{
    const query=`
        SELECT *
        FROM Room 
        WHERE createdAt BETWEEN ? AND ?
    `
    const param=[start,end];
    return fun1(query,param); 
};
