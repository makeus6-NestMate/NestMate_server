module.exports = function(app){
    const auth = require('../controllers/authController');
    const {verify,upload} = require('../../../config/middlewares');

    app.post('/user',upload.single('img'),auth.signUp);
    app.post('/phone',auth.sendNumber);
    app.post('/check/phone',auth.checkNumber);
    app.post('/check/email',auth.checkEmail);
    app.post('/login',auth.signIn);

    app.post('/kakao/user',upload.single('profileImg'),auth.kakaoUser);
    app.post('/kakao/login',auth.kakaoLogin);
    
};