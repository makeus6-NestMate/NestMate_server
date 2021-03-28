const {pool} = require('../../../config/database');
const {logger} = require('../../../config/winston');

const jwt = require('jsonwebtoken');
const regexEmail = require('regex-email');
const crypto = require('crypto');
require('dotenv').config();

const authDao = require('../dao/authDao');

var twilio=require('twilio');
var client=new twilio(process.env.ACCOUNT_SID,process.env.AUTH_TOKEN);
var phoneNumberMap=new Map();

const rp=require('request-promise');


exports.signUp = async(req, res)=> {



    const {
        email, password, name,phoneNumber,nickname
    } = req.body;

    if (!email){
        return res.json({
            isSuccess: false, 
            code: 416, 
            message: "이메일을 입력해주세요."
        });
    }

    if (!regexEmail.test(email)){
        return res.json({
            isSuccess: false,
            code:417,
            message: "이메일을 형식을 지켜주세요"
        });
    }

    if (!password){
        return res.json({
            isSuccess: false, 
            code: 419, 
            message: "비밀번호를 입력 해주세요"
        });
    }

    if (typeof(password)!='string'){
        return res.json({
            isSuccess: false,
            code: 420,
            message: "비밀번호는 문자열입니다"
        });
    }

    if (!name){
        return res.json({
            isSuccess: false, 
            code: 421, 
            message: "이름을 입력해주세요"
        });
    }

    if (typeof(name)!='string'){
        return res.json({
            isSuccess: false,
            code: 422,
            message: "이름은 문자열입니다"
        });
    }

    if(!phoneNumber){
        return res.json({
            code:410,
            isSuccess:false,
            message:"핸드폰 번호를 입력해주세요"
        })
    }
    
    if(typeof(phoneNumber)!='string'){
        return res.json({
            code:411,
            isSuccess:false,
            message:"핸드폰 번호는 숫자문자열입니다"
        })
    }
    else{
        var regexp=/[^0-9]/g;
        var regres=phoneNumber.search(regexp);
        if(regres!=-1){
            return res.json({
                code:411,
                isSuccess:false,
                message:"핸드폰 번호는 숫자문자열입니다"
            })
        }
    }

   

    if(!req.file||!req.file.location){
        return res.json({
            code:425,
            isSuccess:false,
            message:'사진을 입력해주세요'
        })
    }
    const profileImg=req.file.location;

    if(!nickname){
        return res.json({
            code:426,
            isSuccess:false,
            message:'닉네임 입력해주세요'
        })
    }

    if(typeof(nickname)!='string'){
        return res.json({
            code:427,
            isSuccess:false,
            message:'닉네임은 문자열입니다'
        })
    }


  
    try {

        const userByEmail=await authDao.selectUserByEmail(email);

        if(userByEmail.length>0){
            return res.json({
                isSuccess:true,
                message:'중복된 이메일입니다',
                code:418
            })
        }

        const hashedPassword = await crypto.createHash('sha512').update(password).digest('hex');

        await authDao.insertUserInfo(email,hashedPassword,name,phoneNumber,profileImg,nickname);

        return res.json({
            isSuccess: true,
            code: 200,
            message: "회원가입 성공"
        });

    } catch (err) {
        logger.error(`회원가입 실패\n: ${err.message}`);
        return res.json({
            message:err.message,
            code:500,
            isSuccess:false
        });
    }
};


exports.signIn = async (req, res)=> {
    const {
        email, password
    } = req.body;
 if (!email){
        return res.json({
            isSuccess: false, 
            code: 416, 
            message: "이메일을 입력해주세요."
        });
    }

    if (!regexEmail.test(email)){
        return res.json({
            isSuccess: false,
            code:417,
            message: "이메일을 형식을 지켜주세요"
        });
    }

    if (!password){
        return res.json({
            isSuccess: false, 
            code: 419, 
            message: "비밀번호를 입력 해주세요"
        });
    }

    if (typeof(password)!='string'){
        return res.json({
            isSuccess: false,
            code: 420,
            message: "비밀번호는 문자열입니다"
        });
    }

    const hashedPassword = await crypto.createHash('sha512').update(password).digest('hex');

    try{

        const userByEmail=await authDao.selectUserByEmail(email);

        if(userByEmail.length<1){
            return res.json({
                isSuccess:true,
                message:'존재하지않는 이메일입니다',
                code:423
            })
        }

        if(hashedPassword!=userByEmail[0].password){
            return res.json({
                isSuccess:true,
                message:'틀린 비밀번호입니다',
                code:424
            })
        }




        let token = await jwt.sign({
                id: userByEmail[0].id,
            }, 
            process.env.JWT, 
            {
                expiresIn: '365d',
                subject: 'userInfo',
            } 
        );

        return res.json({
            isSuccess: true,
            code: 200,
            message: "로그인 성공",
            result:{
                token:token
            }
        });

    }catch (err) {
        logger.error(`로그인 실패\n: ${JSON.stringify(err)}`);
        return false;
    }
};


exports.sendNumber=async(req,res)=>{
    var {phoneNumber}=req.body;

    if(!phoneNumber){
        return res.json({
            code:410,
            isSuccess:false,
            message:"핸드폰 번호를 입력해주세요"
        })
    }

    if(typeof(phoneNumber)!='string'){
        return res.json({
            code:411,
            isSuccess:false,
            message:"핸드폰 번호는 숫자문자열입니다"
        })
    }
    else{
        var regexp=/[^0-9]/g;
        var regres=phoneNumber.search(regexp);
        if(regres!=-1){
            return res.json({
                code:411,
                isSuccess:false,
                message:"핸드폰 번호는 숫자문자열입니다"
            })
        }
    }

    
    try{
        const phone=await authDao.selectUserByPhone(phoneNumber);

        if(phone.length>0){
            return res.json({
                code:409,
                isSuccess:false,
                message:"이미 등록되어있는 핸드폰번호입니다"
            })
        }



        phoneNumber='+82'+phoneNumber.substr(1);

        var randomNumber=Math.floor(Math.random()*9000)+1000;
        phoneNumberMap.set(phoneNumber,randomNumber);
        
        await client.messages
            .create({
                body:`인증번호는 ${randomNumber}입니다`,
                from:process.env.PHONE_NUMBER,
                to:phoneNumber
            });    

        return res.json({
            isSuccess:true,
            message:'인증번호 요청 성공입니다',
            code:200
        });
    }
    catch(err){
        logger.error(`문자보내기 실패\n: ${JSON.stringify(err)}`);
        return res.json({
            message:err.message,
            code:500,
            isSuccess:false
        });
    }   
};



exports.checkNumber=async(req,res)=>{

    var {phoneNumber,code}=req.body;

    if(!phoneNumber){
        return res.json({
            code:410,
            isSuccess:false,
            message:"핸드폰 번호를 입력해주세요"
        })
    }

    if(typeof(phoneNumber)!='string'){
        return res.json({
            code:411,
            isSuccess:false,
            message:"핸드폰 번호는 숫자문자열입니다"
        })
    }
    else{
        var regexp=/[^0-9]/g;
        var regres=phoneNumber.search(regexp);
        if(regres!=-1){
            return res.json({
                code:411,
                isSuccess:false,
                message:"핸드폰 번호는 숫자문자열입니다"
            })
        }
    }

    phoneNumber='+82'+phoneNumber.substr(1);

    if(!code){
        return res.json({
            code:412,
            isSuccess:false,
            message:"인증번호를 입력해주세요"
        })
    }

    if(typeof(code)!='string'){
        return res.json({
            code:413,
            isSuccess:false,
            message:"인증번호는 숫자문자열입니다"
        })
    }
    else{
        regexp=/[^0-9]/g;
        regres=code.search(regexp);
        if(regres!=-1){
            return res.json({
                code:413,
                isSuccess:false,
                message:"인증번호는 숫자문자열입니다"
            })
        }
    }

  

    if(code.length!=4){
        return res.json({
            code:414,
            isSuccess:false,
            message:"인증번호는 4자리입니다"
        })
    }


    if(phoneNumberMap.get(phoneNumber)!=code){
        phoneNumberMap.delete(phoneNumber);

        return res.json({
            code:415,
            isSuccess:false,
            message:"인증번호가 틀렸습니다"
        })
    }

    phoneNumberMap.delete(phoneNumber);

    return res.json({
        isSuccess:true,
        code:200,
        message:'문자인증 성공입니다'
    });
};


exports.checkEmail=async(req,res)=>{

    var {email}=req.body;

    if(!email){
        return res.json({
            code:416,
            isSuccess:false,
            message:"이메일을 입력해주세요"
        })
    }

    if (!regexEmail.test(email)){
        return res.json({
            isSuccess: false,
            code:417,
            message: "이메일을 형식을 지켜주세요"
        });
    }

    
    try{

        const userByEmail=await authDao.selectUserByEmail(email);

        if(userByEmail.length>0){

            return res.json({
                isSuccess:true,
                message:'중복된 이메일입니다',
                code:418
            })
        }
     
        return res.json({
            isSuccess:true,
            message:'사용가능한 이메일입니다',
            code:200
        });
    }
    catch(err){
        logger.error(`이메일 확인 실패\n: ${JSON.stringify(err)}`);
        return res.json({
            message:err.message,
            code:500,
            isSuccess:false
        });
    }   




};




exports.kakaoUser=async(req,res)=>{

    
    const {
        email, nickname,profileImg
    } = req.body;

    if (!email){
        return res.json({
            isSuccess: false, 
            code: 416, 
            message: "이메일을 입력해주세요."
        });
    }

    if (!regexEmail.test(email)){
        return res.json({
            isSuccess: false,
            code:417,
            message: "이메일을 형식을 지켜주세요"
        });
    }

    
    if(!profileImg){
        return res.json({
            code:425,
            isSuccess:false,
            message:'사진을 입력해주세요'
        })
    }

    if(!nickname){
        return res.json({
            code:426,
            isSuccess:false,
            message:'닉네임 입력해주세요'
        })
    }

    if(typeof(nickname)!='string'){
        return res.json({
            code:427,
            isSuccess:false,
            message:'닉네임은 문자열입니다'
        })
    }

    const accessToken=req.headers.access_token;

    const options={
        uri:"https://kapi.kakao.com/v2/user/me",
        method:"GET",
        headers:{
            "Authorization":`Bearer ${accessToken}`,
            "content-type" : "application/x-www-form-urlencoded"
        },
        json:true
    }
    

    try{
        const cb=await rp(options);

        const kakaoEmail=cb.kakao_account.email;

        if(email!=kakaoEmail){
            return res.json({
                isSuccess:true,
                message:'카카오 로그인 실패',
                code:408
            });
        }
        
        const userByEmail=await authDao.selectUserByEmail(email);

        if(userByEmail.length>0){
            return res.json({
                isSuccess:true,
                message:'중복된 이메일입니다',
                code:418
            })
        }
        
        await authDao.insertUserInfoKakao(email,nickname,profileImg);

        return res.json({
            isSuccess:true,
            message:'카카오 회원가입 성공',
            code:200
        });
        
      
    }
    catch(err){
        logger.error(`카카오 회원가입\n: ${JSON.stringify(err)}`);
        return res.json({
            message:err.message,
            code:500,
            isSuccess:false
        });
    }   

};




exports.kakaoLogin=async(req,res)=>{

    
    const {
        email
    } = req.body;

    if (!email){
        return res.json({
            isSuccess: false, 
            code: 416, 
            message: "이메일을 입력해주세요."
        });
    }

    if (!regexEmail.test(email)){
        return res.json({
            isSuccess: false,
            code:417,
            message: "이메일을 형식을 지켜주세요"
        });
    }


    const accessToken=req.headers.access_token;

    const options={
        uri:"https://kapi.kakao.com/v2/user/me",
        method:"GET",
        headers:{
            "Authorization":`Bearer ${accessToken}`,
            "content-type" : "application/x-www-form-urlencoded"
        },
        json:true
    }
    

    try{
        const cb=await rp(options);

        const kakaoEmail=cb.kakao_account.email;

        if(email!=kakaoEmail){
            return res.json({
                isSuccess:true,
                message:'카카오 로그인 실패',
                code:408
            });
        }
        
        const userByEmail=await authDao.selectUserByEmail(email);

        if(userByEmail.length<1){
            return res.json({
                isSuccess:true,
                message:'존재하지않는 이메일',
                code:423
            })
        }

        let token = await jwt.sign({
            id: userByEmail[0].id,
        }, 
        process.env.JWT, 
        {
            expiresIn: '365d',
            subject: 'userInfo',
        });


        
        

        return res.json({
            isSuccess:true,
            message:'카카오 로그인 성공',
            code:200,
            result:{
                token:token
            }
        });
        
      
    }
    catch(err){
        logger.error(`카카오 로그인\n: ${JSON.stringify(err)}`);
        return res.json({
            message:err.message,
            code:500,
            isSuccess:false
        });
    }   

};

