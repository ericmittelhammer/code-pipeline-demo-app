// AWS Lambda function that formats a CodeDeploy pipeline state change event https://docs.aws.amazon.com/codepipeline/latest/userguide/detect-state-changes-cloudwatch-events.html
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
        eventType: 'codepipeline:statechange',
        version: event.version,
        detailType: event['detail-type'],
        source: event.source,
        account: event.account,
        time: event.time,
        region: event.region,
        'detail.pipeline': event.detail.pipeline,
        'detail.version': event.detail.version,
        'detail.executionId': event.detail['execution-id'],
        'detail.stage': event.detail.stage,
        'detail.action': event.detail.action,
        'detail.state': event.detail.state,
        'detail.type.owner': event.detail.type.owner,
        'detail.type.category': event.detail.type.category,
        'detail.type.provider': event.detail.type.provider,
        'detail.type.version': event.detail.type.version
    };
    
    
    return new Promise((resolve, reject) => {

        const req = http.request(options, (res) => {
            var responseBody = '';
            res.on('data',(chunk) => responseBody = responseBody += chunk);
            res.on('end', () => {
                    resolve({
                        statusCode: res.statusCode,
                        body: responseBody
                    });
            });
        });

        req.on('error', (e) => {
          reject(`Insights insert request failed: ${e}`);
        });

        // write data to request body
        req.write(JSON.stringify(payload));
        req.end();
        
    });   
};


