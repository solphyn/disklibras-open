!(function(exports) {
    'use strict';

    var debug;

    var _views = {
        '/room/': {
            mainView: 'RoomController',
            dependencies: [
                'RoomController'
            ]
        },
        '/': {
            mainView: 'LandingController',
            dependencies: [
                'LandingController'
            ]
        }
    };

    function getView() {
        var pathViews = Object.keys(_views);
        var numViews = pathViews.length;
        var path = exports.document.location.pathname;
        for (var i = 0; i < numViews; i++) {
            if (path.startsWith(pathViews[i]) &&
                _views[pathViews[i]]
                .dependencies
                .every(function(dependency) {
                    return !!exports[dependency];
                })) {
                return exports[_views[pathViews[i]].mainView];
            }
        }
        return null;
    }

    function init() {
        debug = new Utils.MultiLevelLogger('rtcApp.js', Utils.MultiLevelLogger.DEFAULT_LEVELS.all);
        debug.log('Initializing app');
        var view = getView();
        if (view) {
            view.init();
        } else {
            debug.error('Couldn\'t find a view for ' + exports.document.location.pathname);
        }
    }

    exports.RTCApp = {
        init: init
    };
}(this));


if (window.location.search.split('=')[1] == window.location.pathname.split('/')[2]) {
    var socket = io('https://54.94.182.215:8080');

    socket.on('connect', function() {
        console.log('Client has connected to the server!');
    });
    // Add a disconnect listener
    socket.on('disconnect', function() {
        console.log('The client has disconnected!');
    });
    socket.send(window.location.pathname.split('/')[2]);
    //*************************************************
}
/** Close tab or browser */
/*onbeforeunload = function(evt) {
    desconectarUser(window.location.search.split('=')[1]);
    var message = 'Sair?';
    if (typeof evt == 'undefined') {
        evt = window.event;
    }
    if (evt) {
        evt.returnValue = message;
    }

    return message;
};*/


function desconectarUser(usuario) {
    if (usuario == window.location.pathname.split('/')[2]) {
        $.ajax({
            //url: 'http://localhost/0disklibras/api.php/destroyroom/'+idusuario,
            url: 'https://sistema.disklibras.com.br/api.php/destroyroom/' + usuario,
            data: {
                format: 'json'
            },
            error: function(data) {
                console.log("erro exit");
            },
            dataType: 'jsonp',
            success: function(data) {},
            type: 'GET',
            async: false
        });
    } else {
        //inserir jquery

        $.ajax({
            url: 'https://sistema.disklibras.com.br/api.php/openroom/' + window.location.pathname.split('/')[2],
            data: {
                format: 'json'
            },
            error: function(data) {},
            success: function(data) {},
            type: 'GET'
        });
    }

}






//*************************************************

this.addEventListener('load', function startApp() {
    // Note that since the server forbids loading the content on an iframe this should not execute.
    // But it doesn't hurt either
    if (window.top !== window.self && !window.iframing_allowed) {
        // If we're being loaded inside an iframe just hijack the top level window and go back to
        // the index page.
        window.top.document.location = '/index.html';
    } else {
        // And setting this on an else because the re-location might fail in some cases
        document.body.classList.remove('forbidden');
        // Check that everything was loaded correctly, or just use LazyLoader here...
        LazyLoader.load([
            '/js/libs/browser_utils.js',
            '/shared/js/utils.js',
            '/js/helpers/requests.js',
            '/js/roomController.js',
            '/js/landingController.js'
        ]).then(function() {
            RTCApp.init();
        });
    }

    // Allow only https on production
    if (document.location.protocol === 'http:' &&
        document.location.hostname.indexOf('.tokbox.com') > 0) {
        document.location.href = document.location.href.replace(new RegExp('^http:'), 'https:');
    }
});