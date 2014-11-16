/**
 * Created by Franz on 11/13/2014.
 */

var sendEmail = require('./aws-ses-send')('us-west-2','default');
var should = require('should');

describe('Sending email', function () {
    it ('should send the email', function (done) {
        var email = {
            from: '<enter valid AWS source email address>',
            toAddresses: ['<enter one or more email addresses>'],
            // ccAddresses : [], // Optional
            // bccAddresses : [], //Optional
            subject: 'test email 1',
            textBody: 'Hello World',
            htmlBody: '<b>Hello World</b>'
        };
        sendEmail(email).then(function (successVal) {
                successVal.should.be.ok;
                successVal.ResponseMetadata.should.be.ok;
                successVal.MessageId.should.be.ok;
                done();
            }, function (err) {
                err.should.not.be.ok;
                done();
            });
    });
    it ('should not send the email', function (done) {
        var email = {
            //from: '<enter valid AWS source email address>', // Create a null condition
            toAddresses: ['<enter one or more email addresses'],
            // ccAddresses : [], // Optional
            // bccAddresses : [], //Optional
            subject: 'test email 1',
            textBody: 'Hello World',
            htmlBody: '<b>Hello World</b>'
        };
        sendEmail(email).then(function (successVal) {
                successVal.should.not.be.ok;
                done();
            }, function (err) {
                err.should.be.ok;
                done();
            });
    });
});