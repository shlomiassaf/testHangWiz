var phantom = require('phantom');
var config = require('./config');

function renderPage(fragment, cb) {
    phantom.create(function (ph) {
        ph.createPage(function (page) {
            page.set('settings.loadImages', false);


            page.onResourceRequested(
                function(requestData, request, denyResource) {
                    for (var i=0; i< denyResource.length; i++) {
                        if (requestData.url.indexOf(denyResource[i]) > -1) {
                            request.abort();
                        }
                    }
                },
                function(requestData) {
                    //console.log(requestData.url)
                },
                config.denyResource
            );

            var timeout = setTimeout(function() {
                ph.exit();
                cb("timeout", undefined);
            }, config.timeout);

            page.open(config.hostname + config.hashTag + fragment, function (status) {
                clearTimeout(timeout);

                if (status == "success"){
                    page.evaluate(function () {
                        return "<!DOCTYPE html>" + document.getElementsByTagName("html")[0].innerHTML + "</html>";
                    }, function (result) {
                        ph.exit();
                        cb(undefined, result);
                    });
                }
                else {
                    cb(status, undefined);
                }
            });
        });
    }, {
        dnodeOpts: {
            weak: false
        }
    });
}

module.exports = renderPage;

//renderPage("https://www.hangwiz.com/#/experience/54906fb2e4b0106dca96607a", function(e,d) { console.log(e); });