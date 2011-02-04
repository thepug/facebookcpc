// Facebook Javascript API init code
window.fbAsyncInit = function() {

};
// Load facebook javascript and jquery
(function (global, oDOC, handler) {
    var head = oDOC.head || oDOC.getElementsByTagName("head");
    var location = "";
    var scripts = oDOC.getElementsByTagName("script");
    for (var i = 0; i <= scripts.length; i++)
    {
        if (scripts[i] && scripts[i].src.indexOf("loadfacebookcpc.js") !== -1)
        {
            var index = scripts[i].src.indexOf("loadfacebookcpc.js");
            location = scripts[i].src.substr(0,index);            
        }
    }
    var LABjsLoaded = function() {
        $LAB.script(location+"jquery-1.4.4.min.js")
            .wait()
            .script(oDOC.location.protocol+
                    "//connect.facebook.net/en_US/all.js")
            .wait(function() {
                FB.init({appId: '171559142877864', status: true, cookie: true,
                         xfbml: true});
            })
            .script(location+"facebookcpc.js").wait(function() {
                var opts = {};
                try {
                    opts = FacebookBadgeConfiguration;                    
                } catch (e) {}
                FBCPC.init(opts);
            });
    };    
    setTimeout(function () {
        if ("item" in head) { // check if ref is still a live node list
            if (!head[0]) { // append_to node not yet ready
                setTimeout(arguments.callee, 25);
                return;
            }
            head = head[0]; // reassign from live node list ref to pure node ref -- avoids nasty IE bug where changes to DOM invalidate live node lists
        }
        var scriptElem = oDOC.createElement("script"),
        scriptdone = false;
        scriptElem.onload = scriptElem.onreadystatechange = function () {
            if ((scriptElem.readyState && 
                 scriptElem.readyState !== "complete" && 
                 scriptElem.readyState !== "loaded") || 
                scriptdone) {
                return false;
            }
            scriptElem.onload = scriptElem.onreadystatechange = null;
            scriptdone = true;
            LABjsLoaded();
        };
        scriptElem.src = location+"LAB.min.js";
        head.insertBefore(scriptElem, head.firstChild);
    }, 0);

    // required: shim for FF <= 3.5 not having document.readyState
    if (oDOC.readyState == null && oDOC.addEventListener) {
        oDOC.readyState = "loading";
        oDOC.addEventListener("DOMContentLoaded", handler = function () {
            oDOC.removeEventListener("DOMContentLoaded", handler, false);
            oDOC.readyState = "complete";
        }, false);
    }
}(window, document));
