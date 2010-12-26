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
        friends_invite_content: "I just donated.",
        friends_invite_actiontext: "Invite your friends to donate!",        
        show_messages: true
    };
    var config = {};
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
        if (config.show_messages)
        {
            $fblogin.html(message);
        }
    };
    var obj = {
        // Form for posting the facebook badge.
        postBadge: function() {
            displayMessage("Posting Badge.");
            var fbbadge = config.badge;
            FB.ui(fbbadge,
                  function(response) {
                      if (response && response.post_id)
                      {
                          displayMessage("Badge Posted.");
                          //render friends select
                          var elem = $fbfriends.get(0);
                          elem.innerHTML = createfriendstmpl(config);
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
        init: function(options) {
            // change the default configuration if options given
            config = $.extend({}, defaultconfig, options);
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
        $fblogin.click(function() {
            var response = FB.getSession()
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