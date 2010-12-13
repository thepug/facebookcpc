/* Copyright 2010, Nathan Zorn
   Not an opensource license.

Facebook post to an authenticated users wall. Used to post to friends and
the current user.

*/
// Facebook Javascript API init code
window.fbAsyncInit = function() {
    FB.init({appId: '171559142877864', status: true, cookie: true,
             xfbml: true});
    FBCPC.init();
};
(function() {
    var e = document.createElement('script');
    e.type = 'text/javascript';
    e.src = document.location.protocol +
        '//connect.facebook.net/en_US/all.js';
    e.async = true;
    document.getElementById('fb-root').appendChild(e);
}());
// simple facebook posting
var FBCPC = function($) {
    var FBAPPNAME = "Charleston Park's Conservancy";
    var fbfriendsformtmpl = "<fb:serverFbml><script type=\"text/fbml\"><fb:fbml><fb:request-form action=\"#\" method=\"POST\" invite=\"true\" type=\"" +
        FBAPPNAME +
        "\" content=\"I just donated to the Charleston Park's Conservancy.\" ><fb:multi-friend-selector showborder=\"true\" actiontext=\"Invite your friends to donate!\"/></fb:request-form></script></fb:fbml></fb:serverFbml>";
    
    var $fblogin = $('#fblogin');
    var $fbfriends = $('#fbfriends');

    var obj = {
        // Form for posting the facebook badge.
        postBadge: function() {
            $fblogin.html("Posting Badge.");
            FB.ui(
                {
                    method: 'stream.publish',
                    message: 'I showed love to the Parks Conservancy!',
                    attachment: {
                        name: 'Charleston Parks Conservancy Donation.',
                        caption: 'I donated money!',
                        description: ('Charleston Parks Conservancy. '),
                        href: 'http://www.charlestonparksconservancy.org/'
                    },
                    action_links: [
                        { text:'fbcpc',
                          href: 'http://www.charlestonparksconservancy.org/' }
                    ],
                    user_message_prompt:
                    "Charleston Parks Concervancy Donation Badge!"
                },
                function(response) {
                    if (response && response.post_id)
                    {
                        $fblogin.html("Badge Posted.");
                        //render friends select
                        var elem = $fbfriends.get(0);
                        elem.innerHTML = fbfriendsformtmpl;
                        FB.XFBML.parse(document.getElementById('fbfriends'));

                    }
                    else
                    {
                        $fblogin.html(
                            "Cancled Posting Badge. Click To Try Again.");
                        // Test rendering friends
                        //var elem = $fbfriends.get(0);
                        //elem.innerHTML = fbfriendsformtmpl;
                        //FB.XFBML.parse(document.getElementById('fbfriends'));
                    }
                }
            );
        },
        init: function() {
            // Handle the login event.
            FB.Event.subscribe('auth.login', function(response) {
                if (response.session)
                {
                    // post badge
                    FBCPC.postBadge();
                }
            });
        }
    };
    return obj;
}(jQuery);

(function($) {
    // on document ready
    $(function() {
        var $fblogin = $('#fblogin');
        $('#fblogin').click(function() {
            var response = FB.getSession()
            if (response && response.access_token)
            {                
                $fblogin.html("<div>Click to Post Badge.</div>");
                FBCPC.postBadge();
            }
            else
            {
                FB.login(function(response) {
                    if (!response.session)
                    {
                        $fblogin.html(
                            "<div>Click to Login and  Post Badge.</div>"
                        );
                    }
                }, {perms:'read_stream,publish_stream,offline_access'});
            }        
        });
    });
}(jQuery));