(function(window, document, undefined) {

    // When the embedder is compiled, Underscore.js will be loaded directly before this
    // function. Remap _ to private variable __ and use noConflict() to set _ back to
    // its previous owner.
    var __ = _.noConflict();

    // _amara may exist with a queue of actions that need to be processed after the
    // embedder has finally loaded. Store the queue in toPush for processing in init().
    var toPush = window._amara || [];

    var Amara = function(Amara) {

        // For reference in inner functions.
        var that = this;

        // Private methods that are called via the push() method.
        var actions = {

            // The core function for constructing an entire video with Amara subtitles from
            // just a video URL. This includes DOM creation for the video, etc.
            embedVideo: function(options) {

                // Make sure we have a URL to work with.
                if (__.has(options, 'url')) {
                    var url = options['url'];
                    var div;

                    // If a div has been specified, simply use that element for embedding.
                    if (__.has(options, 'div')) {
                        div = document.getElementById(options['div'].replace('#', ''));
                    } else {

                        // If a div hasn't been specified, figure out which div we should be
                        // using for embedding based on the index of the item.
                        var queueItem = __.find(toPush, function(item) {
                            return item[1].url === url;
                        });
                        var index = __.indexOf(toPush, queueItem);
                        var divs = document.getElementsByClassName('amara-embed');
                        div = divs[index];
                    }

                    var pop = Popcorn.smart(div, url);
                }
            }

        };

        // push() handles all action calls before and after the embedder is loaded.
        // Aside from init(), this is the only function that may be called from the
        // parent document.
        //
        // Must send push() an object with only two items:
        //     * Action  (string)
        //     * Options (object)
        //
        // Note: we don't use traditional function arguments because before the
        // embedder is loaded, _amara is just an array with a normal push() method.
        this.push = function(args) {
            
            // No arguments? Don't do anything.
            if (__.size(arguments) === 0) { return; }

            // Must send push() an object with only two items.
            if (__.size(arguments[0]) === 2) {

                var action = args[0];
                var options = args[1];

                // If a method exists for this action, call it with the options.
                if (actions[action]) {
                    actions[action](options);
                }
            }

        };

        // init() gets called as soon as the embedder has finished loading.
        // Simply processes the existing _amara queue if we have one.
        this.init = function() {

            // If we have a queue from before the embedder loaded, process the actions.
            if (toPush) {
                for (var i = 0; i < toPush.length; i++) {
                    that.push(toPush[i]);
                }
                toPush = [];
            }
        };

    };

    window._amara = new Amara();
    window._amara.init();

}(window, document));
