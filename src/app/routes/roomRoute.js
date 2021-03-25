module.exports = function(app){
    const room = require('../controllers/roomController');
    const {verify} = require('../../../config/middlewares');

    app.post('/room',verify,room.createRoom);
    app.post('/room/:roomId/member',verify,room.enterRoom);
    app.get('/room',verify,room.getRoom);
    app.delete('/room/:roomId/member',verify,room.leaveRoom);

    app.get('/room/:roomId/member',verify,room.getMember);
    app.put('/room/:roomId',verify,room.updateRoom);
    
};