
// Use Parse.Cloud.define to define as many cloud functions as you want.

var Mailgun = require('mailgun');
Mailgun.initialize('sk8.asia', 'key-1abb9ac6b44ecb7982ddf76079fd38fc');

Parse.Cloud.define("sendEmail", function (request, response) {
    //Construct email
    var receiver = request.params.receiver
    var subject = request.params.subject
    var message = request.params.message
    
    //Send email
    Mailgun.sendEmail({
      to: receiver,
      from: "feedback@sk8.asia",
      subject: subject,
      text: message
    }, {
      success: function(httpResponse) {
        response.success();
      },
      error: function(httpResponse) {
        response.error(httpResponse);
      }
    });
});