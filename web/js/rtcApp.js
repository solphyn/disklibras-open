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

//*************************************************

/** Close tab or browser */

window.onbeforeunload = function() {
        var usuario = location.search.split('=')[1];
        if (usuario == "atendente") {
            var URL = 'https://sistema.disklibras.com.br/api.php/destroyroom/' + usuario;
        } else {
            var URL = 'https://sistema.disklibras.com.br/api.php/leavequeue/' + usuario;
        }
        var request = null;

        if (window.XMLHttpRequest) {
            request = new XMLHttpRequest();
        } else if (window.ActiveXObject) {
            request = new ActiveXObject("Microsoft.XMLHTTP");
        }

        if (request) {
            request.open("GET", URL, false);
            request.send();
        }
    }
    /*window.addEventListener("beforeunload", function(e) {
        desconectarUser(location.search.split('=')[1]);
        var confirmationMessage = "Você foi desconectado";
        (e || window.event).returnValue = confirmationMessage; //Gecko + IE
        return confirmationMessage;
    });

    function desconectarUser(usuario) {
        var i = document.createElement("img");
        if (usuario == "atendente") {
            i.src = 'https://sistema.disklibras.com.br/api.php/destroyroom/' + usuario;
            for (var i = 0; i < 1000; i++) {}

        } else {
            i.src = 'https://sistema.disklibras.com.br/api.php/leavequeue/' + usuario;
            for (var i = 0; i < 1000; i++) {}
        }
        return "Você foi desconectado";
    }*/






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