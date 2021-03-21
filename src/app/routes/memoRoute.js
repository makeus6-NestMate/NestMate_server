module.exports = function(app){
    const memo = require('../controllers/memoController');
    const {verify} = require('../../../config/middlewares');

    app.post('/room/:roomId/memo',verify,memo.createMemo);
    app.get('/room/:roomId/memo',verify,memo.getMemo);
    app.put('/room/:roomId/memo/:memoId',verify,memo.updateMemo);
    app.delete('/room/:roomId/memo/:memoId',verify,memo.deleteMemo);
    app.patch('/room/:roomId/memo/:memoId',verify,memo.moveMemo);
};