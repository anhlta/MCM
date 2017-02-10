var page = require('webpage').create();
page.settings.userAgent = 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/37.0.2062.120 Safari/537.36';
page.settings.javascriptEnabled = true;
page.viewportSize = {
    width: 1200,
    height: 800
};
var waitTime = 5000;
var loadInProgress = false;

page.onConsoleMessage = function(msg) {
    console.log(msg);
};

page.onLoadStarted = function() {
    loadInProgress = true;
    console.log("load started");
};

page.onLoadFinished = function() {
    loadInProgress = false;
    console.log("load finished");
};


page.open("https://ftrcenter.pjm.com/", function (status) {

    page.evaluate(function () {
        var username = document.getElementById("IDToken1");
        username.value = "EDFNJ_CAM";
        var pw = document.getElementById("IDToken2");
        pw.value = "******";
    });

    page.render('ftrcenter_Login.png');

    page.evaluate(function () {
        LoginSubmit('Sign In');
    });

    setTimeout(function () {
        page.render('ftrcenter_Home.png');
        var url = 'https://ftrcenter.pjm.com/ftrcenter/pages/secure/#!ARRs/Requests';

        page.evaluate(function () {
            window.location.href = 'https://ftrcenter.pjm.com/ftrcenter/pages/secure/#!ARRs/Requests';
        });

        setTimeout(function () {
            console.log("Rendering ARR_Request Page");
            page.render('ftrcenter_ARR_Request1.png');

            // Select Market
            page.evaluate(function () {
                console.log("Select Market");
                var marketddl = document.getElementsByTagName("select")[0];
                marketddl.selectedIndex = 10;

                var evt = document.createEvent("HTMLEvents");
                evt.initEvent("change", false, true);
                marketddl.dispatchEvent(evt);
            });

            //wait for Stage data to populate
            setTimeout(function () {
                page.render('ftrcenter_ARR_Request2.png');
                // select Stage
                console.log("Select Stage");
                page.evaluate(function () {
                    var stageddl = document.getElementsByTagName("select")[1];
                    stageddl.selectedIndex = 1;

                    var evt = document.createEvent("HTMLEvents");
                    evt.initEvent("change", false, true);
                    stageddl.dispatchEvent(evt);
                });

                //wait for Sink Zone
                setTimeout(function () {
                    page.render('ftrcenter_ARR_Request3.png');

                    //select Sink Zone
                    console.log("Select Sink Zone");
                    page.evaluate(function () {
                        var sinkZOneddl = document.getElementsByTagName("select")[2];
                        sinkZOneddl.selectedIndex = 1;

                        var evt = document.createEvent("HTMLEvents");
                        evt.initEvent("change", false, true);
                        sinkZOneddl.dispatchEvent(evt);
                    });

                    // wait for Sink data to populate
                    setTimeout(function () {
                        page.render('ftrcenter_ARR_Request4.png');

                        console.log("Output Data:");
                        page.evaluate(function () {
                            var captions = document.getElementsByClassName('v-captiontext');
                            console.log("Result: ");
                            console.log(captions[2].innerHTML);
                            console.log(captions[3].innerHTML);
                            console.log(captions[4].innerHTML);
                        });

                        phantom.exit();
                    }, waitTime);

                }, waitTime);

            }, waitTime);

        }, waitTime);

    }, waitTime);
});