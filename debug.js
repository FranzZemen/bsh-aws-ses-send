/**
 * Created by Franz on 11/14/2014.
 */

/**
 * Created by Franz on 11/13/2014.
 */

var sendEmail = require('./bsh-aws-ses-send')('us-west-2','default');
var should = require('should');


var email = {
    from: 'franz.zemen@blackswanhorizons.com', //'<enter valid AWS source email address>',
    toAddresses: 'franzzemen@gmail.com',//['<enter one or more email addresses>'],
    // ccAddresses : [], // Optional
    // bccAddresses : [], //Optional
    subject: 'test email 1',
    textBody: 'Hello World',
    htmlBody: '<b>Hello World</b>'
};
sendEmail(email).then(function (successVal) {

    console.log('good');
}, function (err) {
    console.log(err);
});

var email2 = {
    //from: '<enter valid AWS source email address>', // Create a null condition
    toAddresses: ['<enter one or more email addresses'],
    // ccAddresses : [], // Optional
    // bccAddresses : [], //Optional
    subject: 'test email 1',
    textBody: 'Hello World',
    htmlBody: '<b>Hello World</b>'
};
sendEmail(email2).then(function (successVal) {
    successVal.should.not.be.ok;
    done();
}, function (err) {
    console.log('!' + err);
    err.should.be.ok;
    done();
});

