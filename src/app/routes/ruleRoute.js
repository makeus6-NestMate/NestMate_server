module.exports = function(app){
    const rule = require('../controllers/ruleController');
    const {verify} = require('../../../config/middlewares');

    app.post('/room/:roomId/rule',verify,rule.createRule);
    app.put('/room/:roomId/rule/:ruleId',verify,rule.updateRule);
    app.delete('/room/:roomId/rule/:ruleId',verify,rule.deleteRule);
    app.get('/room/:roomId/rule',verify,rule.getRule);
};