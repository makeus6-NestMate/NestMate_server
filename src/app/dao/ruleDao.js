const {fun1}=require('../../../config/functions');

exports.insertRule=(roomId,userId,rule)=>{
    const query= `
      INSERT INTO Rule(roomId,userId,rule) VALUES(?,?,?);
    `;
    const param=[roomId,userId,rule];
  
    return fun1(query,param);
}

exports.selectRuleById=(ruleId)=>{
    const query= `
      SELECT * FROM Rule WHERE id=?
    `;
    const param=[ruleId];
  
    return fun1(query,param);
}



exports.updateRule=(rule,ruleId)=>{
    const query= `
      UPDATE Rule SET rule=? WHERE id=?
    `;
    const param=[rule,ruleId];
  
    return fun1(query,param);
}


exports.deleteRule=(ruleId)=>{
    const query= `
      DELETE FROM Rule WHERE id=?
    `;
    const param=[ruleId];
  
    return fun1(query,param);
}

exports.selectRule=(roomId)=>{
    const query= `
      SELECT rule , id AS ruleId FROM Rule WHERE roomId=? ORDER BY id;
    `;
    const param=[roomId];
  
    return fun1(query,param);
}