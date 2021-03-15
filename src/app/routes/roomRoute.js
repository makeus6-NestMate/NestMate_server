module.exports = function(app){
    const room = require('../controllers/roomController');
    const {verify} = require('../../../config/middlewares');

    app.post('/room',verify,room.createRoom);
    app.post('/room/member',verify,room.enterRoom);
    app.get('/room',verify,room.getRoom);
};