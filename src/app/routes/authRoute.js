module.exports = function(app){
    const auth = require('../controllers/authController');
    const {verify,upload} = require('../../../config/middlewares');



    app.get('/test',auth.test);
    app.post('/user',upload.single('img'),auth.signUp);
    app.post('/phone',auth.sendNumber);
    app.post('/check/phone',auth.checkNumber);
    app.post('/check/email',auth.checkEmail);
    app.post('/login',auth.signIn);

    
};