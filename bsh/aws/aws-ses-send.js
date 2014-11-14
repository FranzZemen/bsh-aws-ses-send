/**
 * Created by Franz on 11/13/2014.
 *
 * To use this module, the AWS access key id and secret access key must be provided.
 * The module allows three ways to set them.
 *
 */

var AWS = require('aws-sdk');
var Promise = require('promise');

/**
 * Instantiate the api.
 * @param region The AWS region (string) you want to use
 * @param credentialsProfile If you wish to pass a credentials profile, enter the profile name (string).  This is found in the AWS credentials file (see AWS)
 * @param accessKeys  If you want to pass credentials directly, enter an object {accessKeyId: 'your access key', secretAccessKey: 'your secret access key'}
 * @returns {Function} A function that returns a Promise.  The required function parameter is an object:
 *
 * {from:'from email address',
 *  toAddresses: ['toAddress1','toAddress2'],  -- optional
 *  ccAddresses: ['toAddress1','toAddress2'],  -- optional
 *  bccAddresses: ['toAddress1','toAddress2'],  -- optional
 *  subject: 'subject', -- required
 *  textBody: 'textBody', -- optional
 *  htmlBody:  'htmlBody' -- optional
 *  }
 *
 *  The return value is a Promise whose success value is the AWS return object, and failure value is the AWS error or a validation error of type Error
 */
module.exports = function (region, credentialsProfile, accessKeys) {
    function getSES(region, arg1, arg2) {
        AWS.config.update({region: region});

        var credentialsProfile, accessKeys;
        for (var i = 1; i < arguments.length; i++) {
            if (arguments[i] && ((typeof arguments[i] === "string") || arguments[i] instanceof String)) {
                credentialsProfile = arguments[i];
            } else if (arguments[i] && arguments[i].hasOwnProperty('accessKeyId') && arguments[i].hasOwnProperty('secretAccessKey')) {
                accessKeys = arguments[i];
            }
        }
        if (credentialsProfile) {
            var creds = new AWS.SharedIniFileCredentials({profile: credentialsProfile});
            return new AWS.SES({credentials: creds});
        } else if (accessKeys) {
            return new AWS.SES(accessKeys);
        } else if ((process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY)
            || (process.env.AMAZON_ACCESS_KEY_ID && process.env.AMAZON_SECRET_ACCESS_KEY)) {
            return new ASWS.SES({});
        } else {
            throw new Error('Unable to determine AWS credentials');
        }
    }

    var SES = getSES(region, credentialsProfile, accessKeys);


    return function (email) {
        return new Promise(function (resolve, reject) {
            if (email.from == undefined || email.from == null) {
                reject(new Error('email.from must be specified'));
                return;
            }
            var Destination = {};
            if (!email.toAddresses && !email.ccAddresses && !email.bccAddresses) {
                reject(new Error('At least one to, cc or bcc address must be provided'));
                return;
            }
            if (email.toAddresses) {
                if (Array.isArray(email.toAddresses)) {
                    if (email.toAddresses.length > 0) {
                        Destination.ToAddresses = email.toAddresses;
                    } else {
                        reject(new Error('"email.toAddresses" must be an array'));
                        return;
                    }
                } else {
                    reject (new Error('"email.toAddresses" must be an array if present'));
                    return;
                }
            }
            if (email.ccAddresses) {
                if (Array.isArray(email.ccAddresses)) {
                    if (email.ccAddresses.length > 0) {
                        Destination.CcAddresses = email.ccAddresses;
                    } else {
                        reject(new Error('"email.ccAddresses" must be an array'));
                        return;
                    }
                } else {
                    reject (new Error('"email.ccAddresses" must be an array if present'))
                    return;
                }
            }
            if (email.bccAddresses) {
                if (Array.isArray(email.bccAddresses)) {
                    if (email.bccAddresses.length > 0) {
                        Destination.BcAddresses = email.bccAddresses;
                    } else {
                        reject(new Error('"email.bccAddresses" must be an array'));
                        return;
                    }
                } else {
                    reject (new Error('"email.bccAddresses" must be an array if present'))
                    return;
                }
            }
            if (!email.subject) {
                reject(new Error("email.subject must be provided"));
                return;
            }
            var Subject = {Data: email.subject};

            var Body = {};
            if (email.textBody) {
                Body.Text = {Data: email.textBody};
            }
            if (email.htmlBody) {
                Body.Html = {Data: email.htmlBody};
            }
            var Message = {Body: Body, Subject: Subject};

            SES.sendEmail({Source: email.from, Destination: Destination, Message: Message}, function (err, data) {
                if (err) reject(err);
                resolve(data);
            });
        });
    }
};












