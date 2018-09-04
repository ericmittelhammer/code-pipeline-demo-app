// AWS Lambda function that formats GitHub's push event payload (https://developer.github.com/v3/activity/events/types/#pushevent)
// into an Insights event

// No external dependencies; can be installed directly in the AWS Console

const http = require('https');

exports.handler = (event) => {

    const options = {
        hostname: 'insights-collector.newrelic.com',
        path: `/v1/accounts/${process.env['NEW_RELIC_ACCOUNT_ID']}/events`,
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
            'X-Insert-Key': process.env['NEW_RELIC_INSERT_KEY']
        }
    }

    const payload = { 
        eventType: 'github:push',
        ref: event.body.ref,
        before: event.body.after,
        repository: event.body.repository,
        name: event.body.pusher.name,


    };
    
    return new Promise((resolve, reject) => {

        const req = http.request(options, (res) => {
            var responseBody = '';
            res.on('data',(chunk) => responseBody = responseBody += chunk);
            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    resolve(`Insights insert request completed with statusCode: ${res.statusCode}, message: ${res.statusMessage}, body: ${responseBody}`);
                } else {
                    reject(`Insights insert request failed with statusCode: ${res.statusCode}, message: ${res.statusMessage}, body: ${responseBody}`);
                }             
            });
        });

        req.on('error', (e) => {
          reject(`Insights insert request failed: ${e}`);
        });
        
        req.on('close', () => {
            console.log('request done');
        });
    
        // write data to request body
        req.write(JSON.stringify(payload));
        req.end();
        
    });   
};


