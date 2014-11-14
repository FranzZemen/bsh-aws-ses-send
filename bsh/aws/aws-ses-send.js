/**
 * Created by Franz on 11/13/2014.
 *
 * To use this module, the AWS access key id and secret access key must be provided.
 * The module allows three ways to set these:
 *
 */
//{region: 'us-west-2'}

var AWS = require('aws-sdk');
var Promise = require('promise');

module.exports = function (sourceAddress, toAddresses, ccAddresses, bccAddresses, subject, textBody, htmlBody, region, credentialsProfile, accessKeyId, secretAccessKey) {
    function getSES(region, credentialsProfile, accessKeyId, secretAccessKey) {
        AWS.config.update({region: region});
        if (credentialsProfile) {
            var creds = new AWS.SharedIniFileCredentials({profile: credentialsProfile});
            return new AWS.SES({credentials: creds});
        } else if (accessKeyId && secretAccessKey) {
            return new AWS.SES({accessKeyId: accessKeyId, secretAccessKey: secretAccessKey});
        } else if ((process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY)
            || (process.env.AMAZON_ACCESS_KEY_ID && process.env.AMAZON_SECRET_ACCESS_KEY)) {
            return new ASWS.SES({});
        } else {
            throw new Error('Unable to determine AWS credentials');
        }
    }

    var SES = getSES(region, credentialsProfile, accessKeyId, secretAccessKey);

    return new Promise(function (resolve, reject) {
        var Destination = {};
        if (!toAddresses && !ccAddresses && !bccAddresses) {
            reject (new Error('At least one to, cc or bcc address must be provided'));
        }
        if (toAddresses) {
            if (toAddresses instanceof Array) {
                if (toAddresses.length > 0) {
                    Destination.ToAddresses = toAddresses;
                } else {
                    reject(new Error('"toAddresses" must be an array'));
                }
            }
        }
        if (ccAddresses) {
            if (ccAddresses instanceof Array) {
                if (ccAddresses.length > 0) {
                    Destination.CcAddresses = ccAddresses;
                } else {
                    reject(new Error('"ccAddresses" must be an array'));
                }
            }
        }
        if (bccAddresses) {
            if (bccAddresses instanceof Array) {
                if (bccAddresses.length > 0) {
                    Destination.BcAddresses = bccAddresses;
                } else {
                    reject (new Error('"bccAddresses" must be an array'));
                }
            }
        }
        if (!subject) {
            reject (new Error("subject must be provided"));
        }
        var Subject = {Data: subject};

        var Body = {};
        if (textBody) {
            Body.Text = {Data: textBody};
        }
        if (htmlBody) {
            Body.Html = {Data: htmlBody};
        }
        var Message = {Body: Body, Subject: Subject};

        SES.sendEmail({Source: sourceAddress, Destination: Destination, Message: Message}, function (err, data) {
            if (err) reject (err);
            resolve(data);
        });
    });
};












