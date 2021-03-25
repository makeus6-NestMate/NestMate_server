module.exports = function(app){
    const etc = require('../controllers/etcController');
    const {verify,upload} = require('../../../config/middlewares');

    app.put('/user/profile',upload.single('img'),verify,etc.updateProfile);
    app.get('/user/profile',verify,etc.getProfile);

    app.get('/room/:roomId/chart',verify,etc.getChart);
    app.post('/room/:roomId/member/:memberId/clap',verify,etc.postClap);
    app.get('/room/:roomId/alarm',verify,etc.getAlarm);
};