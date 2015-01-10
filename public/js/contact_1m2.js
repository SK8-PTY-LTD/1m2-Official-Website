Parse.initialize("r1E44FziLiTfHEkezUCT1gUylk0TRwbUJBABaNzq", "A2ZOFOi4bBdCCY9ZLFPGXKRB6BBU3KggsafyhLMe");

$(function() {

    $("input,textarea").jqBootstrapValidation({
        preventSubmit: true,
        submitError: function($form, event, errors) {
            // additional error messages or events
        },
        submitSuccess: function($form, event) {
            event.preventDefault(); // prevent default submit behaviourg
            // get values from FORM
            var name = $("input#name").val();
            var companyName = $("input#companyName").val();
            var email = $("input#email").val();
            var phone = $("input#phone").val();
            var message = $("textarea#message").val();
            var firstName = name; // For Success/Failure Message
            // Check for white space in name for Success/Fail message
            if (firstName.indexOf(' ') >= 0) {
                firstName = name.split(' ').slice(0, -1).join(' ');
            }
            //Compose message
            message = message + "\n\n\n" + "From: " + name + ".\n" + "Company: " + companyName + ".\n" + "Contact: " + phone + ".\n" + "Reply to: " + email;
            Parse.Cloud.run('sendEmail', {subject: "1m2 Enquiry", message: message, receiver: "sk8tech@163.com"}, {
              success: function() {
                    // Success message
                    $('#success').html("<div class='alert alert-success'>");
                    $('#success > .alert-success').html("<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;")
                        .append("</button>");
                    $('#success > .alert-success')
                        .append("<strong>Thank you for your feedback! We will get back to you ASAP!</strong>");
                    $('#success > .alert-success')
                        .append('</div>');

                    //clear all fields
                    $('#contactForm').trigger("reset");
                },
                error: function(error) {
                    // Fail message
                    $('#success').html("<div class='alert alert-danger'>");
                    $('#success > .alert-danger').html("<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;")
                        .append("</button>");
                    $('#success > .alert-danger').append("<strong>Sorry " + firstName + "Oops, something went wrong. Sorry about this. Please try again later!(Error：" + error.message + ")");
                    $('#success > .alert-danger').append('</div>');
                    //clear all fields
                    $('#contactForm').trigger("reset");
                }
            });
        },
        filter: function() {
            return $(this).is(":visible");
        },
    });

    $("a[data-toggle=\"tab\"]").click(function(e) {
        e.preventDefault();
        $(this).tab("show");
    });
});

/*When clicking on Full hide fail/success boxes */
$('#name').focus(function() {
    $('#success').html('');
});

function hover(element) {
    var imgs = element.getElementsByTagName('img');
    for(var i=0; i<imgs.length; i++) {
        var img = imgs[i]
        img.setAttribute('src', 'img/mouse-over-green.png');
    }
}

function unhover(element) {
    if (element.className == "page-scroll btn mouse-over") {
        var imgs = element.getElementsByTagName('img');
        for(var i=0; i<imgs.length; i++) {
            var img = imgs[i]
            img.setAttribute('src', 'img/mouse-over-white.png');
        }
    } else if (element.className == "page-scroll btn mouse-over-black") {
        var imgs = element.getElementsByTagName('img');
        for(var i=0; i<imgs.length; i++) {
            var img = imgs[i]
            img.setAttribute('src', 'img/mouse-over-black.png');
        }
    }
}

