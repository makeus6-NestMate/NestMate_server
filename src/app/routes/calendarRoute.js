module.exports = function(app){
    const calendar = require('../controllers/calendarController');
    const {verify} = require('../../../config/middlewares');

   app.post('/room/:roomId/calendar',verify,calendar.postCalendar);

   app.put('/room/:roomId/calendar/:calendarId',verify,calendar.updateCalendar);
   app.delete('/room/:roomId/calendar/:calendarId',verify,calendar.deleteCalendar);

   app.get('/room/:roomId/calendar',verify,calendar.getCalendar);
   app.get('/room/:roomId/calendar/detail',verify,calendar.getDetailCalendar);
};