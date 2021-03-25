module.exports = function(app){
    const noticeVote = require('../controllers/noticeVoteController');
    const {verify} = require('../../../config/middlewares');

   app.post('/room/:roomId/notice',verify,noticeVote.postNotice);
   app.post('/room/:roomId/vote',verify,noticeVote.postVote);

   app.put('/room/:roomId/notice/:noticeId',verify,noticeVote.updateNotice);
   app.put('/room/:roomId/vote/:voteId',verify,noticeVote.updateVote);

   app.delete('/room/:roomId/notice/:noticeId',verify,noticeVote.deleteNotice);
   app.delete('/room/:roomId/vote/:voteId',verify,noticeVote.deleteVote);

   app.get('/room/:roomId/noticeVote',verify,noticeVote.getNoticeVote);

   app.patch('/room/:roomId/vote/:voteId',verify,noticeVote.patchVote);

   app.get('/room/:roomId/vote/:voteId',verify,noticeVote.getVote);
   app.get('/room/:roomId/vote/:voteId/choice/:choiceId',verify,noticeVote.getVoteUser);

   app.patch('/room/:roomId/vote/:voteId/complete',verify,noticeVote.completeVote);
};