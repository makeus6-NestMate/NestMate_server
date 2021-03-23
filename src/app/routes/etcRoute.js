module.exports = function(app){
    const etc = require('../controllers/etcController');
    const {verify,upload} = require('../../../config/middlewares');

    app.put('/user/profile',upload.single('img'),verify,etc.updateProfile);
    app.get('/user/profile',verify,etc.getProfile);
    
};