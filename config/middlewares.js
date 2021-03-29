const jwt = require('jsonwebtoken');
require('dotenv').config();

const multer = require('multer');
const multerS3 = require('multer-s3');
const aws = require('aws-sdk');
aws.config.loadFromPath(__dirname + '/awsconfig.json');
const s3 = new aws.S3();

const verify = (req, res, next) => {
    
    const token = req.headers['access-token'] || req.query.token;
    
    if(!token) {
        return res.status(403).json({
            isSuccess:false,
            code: 403,
            message: '로그인이 되어 있지 않습니다.'
        });
    }

    const p = new Promise(
        (resolve, reject) => {
            jwt.verify(token, process.env.JWT, (err, verifiedToken) => {
                if(err) reject(err);
                resolve(verifiedToken)
            })
        }
    );

    const onError = (error) => {
        res.status(403).json({
            isSuccess:false,
            code: 403,
            message:"검증 실패"
        });
    };

    p.then((verifiedToken)=>{
        req.verifiedToken = verifiedToken;
        next();
    }).catch(onError)
};

exports.verify = verify;



const upload=multer({
    storage:multer.diskStorage({
        destination(req,file,cb){

            cb(null,'./uploads/');

        },
        filename(req,file,cb){
            cb(null,new Date().valueOf()+path.extname(file.originalname));
        }
    }),
    limits:{fileSize:1024*1024*10}
})
exports.upload=upload;


/*
const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'practicenodejs/img',
        acl: 'public-read',
        key: function(req, file, cb) {
            cb(null, Math.floor(Math.random() * 1000).toString() + Date.now() + '.' + file.originalname.split('.').pop());
        }
    }),
    limits: {
        fileSize: 1000 * 1000 * 10
    }
});

exports.upload=upload;
*/