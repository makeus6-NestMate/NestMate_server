const express = require('express');
const compression = require('compression');
const methodOverride = require('method-override');
var cors = require('cors');
const path=require('path');

module.exports = function () {
    const app = express();

    app.use(express.static(path.join(__dirname,'public')));
    app.use(express.static('uploads'));

    app.use(compression());

    app.use(express.json());

    app.use(express.urlencoded({extended: true}));

    app.use(methodOverride());

    app.use(cors());

    app.get('/',(req,res)=>{
        return res.send('hello developers');
    })
   
    require('../src/app/routes/authRoute')(app);
    require('../src/app/routes/roomRoute')(app);
    require('../src/app/routes/todoRoute')(app);
    require('../src/app/routes/memoRoute')(app);
    require('../src/app/routes/ruleRoute')(app);
    require('../src/app/routes/noticeVoteRoute')(app);
    require('../src/app/routes/calendarRoute')(app);
    require('../src/app/routes/etcRoute')(app);
    return app;
};