/* Copyright 2010, Nathan Zorn
   Not an opensource license.

Facebook post to an authenticated users wall. Used to post to friends and
the current user.

*/
// simple facebook posting
var FBCPC = function($) {
    var defaultconfig = {
        name:"Charleston Park's Conservancy",
        badge:  {
            method: 'stream.publish',
            message: 'I showed my parks some love by donating to the Charleston Parks Conservancy.',
            picture: 'Charleston_Parks_Badge.png',
            name: 'Charleston Parks Conservancy Badge',
            description: ('Charleston Parks Conservancy. '),
            link: 'http://www.charlestonparksconservancy.org/donate/',
            action_links: [
                { text:'fbcpc',
                  href: 'http://www.charlestonparksconservancy.org/donate/' }
            ],
            user_message_prompt:
            "Charleston Parks Concervancy Donation Badge!"
        },
        friends_invite_content: "I just donated.",
        friends_invite_actiontext: "Invite your friends to donate!",        
        show_messages: true
    };
    var fbcpcconfig = {};
    var clicked = false;
    var createfriendstmpl = function(options) {
        var fbfriendsformtmpl = "<fb:serverFbml><script type=\"text/fbml\"><fb:fbml><fb:request-form action=\"" +
            document.location +
            "\" method=\"POST\" invite=\"false\" type=\"" +
            options.name +
            "\" content=\"" +
            options.friends_invite_content +
            "\" ><fb:multi-friend-selector showborder=\"true\" actiontext=\"" +
            options.friends_invite_actiontext +
            "\"/></fb:request-form></script></fb:fbml></fb:serverFbml>";
        return fbfriendsformtmpl;
    };
    var $fblogin = $('#fblogin');
    var $fbfriends = $('#fbfriends');
    var displayMessage = function(message) {
        if (fbcpcconfig.show_messages)
        {
            $fblogin.html(message);
        }
    };
    var obj = {
        // Form for posting the facebook badge.
        postBadge: function() {
            displayMessage("Posting Badge.");
            var fbbadge = $.extend(true,{},fbcpcconfig.badge);
            FB.ui(fbbadge,
                  function(response) {
                      if (response && response.post_id)
                      {
                          displayMessage("Badge Posted.");
                          //render friends select
                          var elem = $fbfriends.get(0);
                          elem.innerHTML = createfriendstmpl(fbcpcconfig);
                          FB.XFBML.parse(document.getElementById('fbfriends'));
                      }
                      else
                      {
                          displayMessage(
                              "Cancled Posting Badge. Click To Try Again."
                          );
                      }
                  }
                 );
        },
        message: function(mess) {
            displayMessage(mess);
        },
        setClicked: function(val) {
            clicked = val;
        },
        init: function(options) {
            // change the default configuration if options given
            fbcpcconfig = $.extend({}, defaultconfig, options);
            // Handle the login event.
            FB.Event.subscribe('auth.login', function(response) {
                if (response.session && clicked)
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
        $fblogin.click(function() {
            FBCPC.setClicked(true);
            var response = FB.getSession();
            if (response && response.access_token)
            {                
                FBCPC.message("<div>Click to Post Badge.</div>");
                FBCPC.postBadge();
            }
            else
            {
                FB.login(function(response) {
                    if (!response.session)
                    {
                        FBCPC.message(
                            "<div>Click to Login and  Post Badge.</div>"
                        );
                    }
                }, {perms:'read_stream,publish_stream,offline_access'});
            }        
        });
    });
}(jQuery));