module.exports = function(app){
    const room = require('../controllers/roomController');
    const {verify} = require('../../../config/middlewares');

    app.post('/room',verify,room.createRoom);
    //app.post('/room/:roomId',room.enterRoom);
    //app.get('/room');
};