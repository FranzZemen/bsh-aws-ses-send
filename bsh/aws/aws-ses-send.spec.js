/**
 * Created by Franz on 11/13/2014.
 */

var sendEmail = require('./aws-ses-send');
var should = require('should');

describe('Sending email', function () {
    it ('should send the email', function (done) {
        sendEmail(
            '<enter valid AWS source email address',
            ['<enter one or more email addresses'],
            null,
            null,
            'refactor test 1',
            'Hello World',
            '<b>Hello World</b>',
            'us-west-2',
            'default').then(function (successVal) {
                successVal.should.be.ok;
                successVal.ResponseMetadata.should.be.ok;
                successVal.MessageId.should.be.ok;
                done();
            }, function (err) {
                err.should.not.be.ok;
                console.log(err);
                done();
            });
    });
    it ('should not send the email', function (done) {
        sendEmail(
            null,
            ['franzzemen@gmail.com'],
            null,
            null,
            'refactor test 1',
            'Hello World',
            '<b>Hello World</b>',
            'us-west-2',
            'default').then(function (successVal) {
                successVal.should.not.be.ok;
                done();
            }, function (err) {
                err.should.be.ok;
                console.log(err);
                done();
            });
    });
});