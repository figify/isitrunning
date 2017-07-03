const cron = require('node-cron');
let request = require('superagent');
var fs = require('fs');
const _ = require('lodash');

var json = JSON.parse(fs.readFileSync('servers.json', 'utf8'));

_.each(json.servers, server => {
    var valid = cron.validate(server.cron);
    if(valid) {
        var cronjob = server.cron;
        cron.schedule(cronjob, function(){
            request
            .get(`http:\/\/${server.ip}:${server.port}`)
            .end(function(err, res) {
                if(err) {
                    console.log(err);
                } else {
                    console.log(res.status)
                    console.log(`Server ${server.name} is running...`);
                }
            });
        });
    } else {
        throw new Error();
    }
});
