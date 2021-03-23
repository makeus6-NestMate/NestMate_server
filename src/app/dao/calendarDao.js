const {fun1}=require('../../../config/functions');


exports.insertCalendar=(roomId,userId,title,content,time,category,categoryIdx)=>{
    const query= `
      INSERT INTO Calendar(roomId,userId,title,content,time,category,categoryIdx) VALUES(?,?,?,?,?,?,?)
    `;
    const param=[roomId,userId,title,content,time,category,categoryIdx];
  
    return fun1(query,param);
}

exports.selectCalendar=(calendarId)=>{
    const query= `
      SELECT * FROM Calendar WHERE id=?
    `;
    const param=[calendarId];
  
    return fun1(query,param);
}

exports.updateCalendar=(calendarId,title,content,time,category,categoryIdx)=>{
    const query= `
      UPDATE Calendar SET title=?,content=?,time=?,category=?,categoryIdx=? WHERE id=?
    `;
    const param=[title,content,time,category,calendarId,categoryIdx];
  
    return fun1(query,param);
}


exports.deleteCalendar=(calendarId)=>{
    const query= `
      DELETE FROM Calendar WHERE id=?
    `;
    const param=[calendarId];
  
    return fun1(query,param);
}

exports.selectCalendarByDate=(roomId,year,month)=>{
    const query= `
      SELECT category,time,categoryIdx
      FROM Calendar
      WHERE roomId=? AND YEAR(time)=? AND MONTH(time)=? 
    `;
    const param=[roomId,year,month];
  
    return fun1(query,param);
}