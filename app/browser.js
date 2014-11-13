var EventEmitter = require('events').EventEmitter;

var form = document.querySelector('form');
form.addEventListener('submit', function (ev) {
    ev.preventDefault();
    
    var href = form.elements.id.value;
    var boot = keyboot(href, {
        permissions: [ 'id', 'sign', 'verify' ]
    });
    boot.on('pending', function () {
        clear();
        var m = document.querySelector('#pending');
        var link = m.querySelector('a');
        m.style.display = 'block';
        link.setAttribute('href', href);
        link.textContent = href;
    });
    boot.on('reject', function () {
        clear();
        document.querySelector('#reject').style.display = 'block';
    });
    boot.on('approve', function () {
        clear();
        form.style.display = 'none';
        var m = document.querySelector('#approve');
        m.style.display = 'block';
    });
    function clear () {
        var msgs = document.querySelectorAll('.msg');
        for (var i = 0; i < msgs.length; i++) {
            msgs[i].style.display = 'none';
        }
    }
});

function keyboot (href, permissions) {
    var seq_ = 0;
    createIframe(function (frame) {
        var request = {
            sequence: seq_,
            action: 'request',
            permissions: [ 'id', 'sign', 'verify' ]
        };
        frame.contentWindow.postMessage(
            'keyboot!' + JSON.stringify(request), href
        );
    });
    
    window.addEventListener('message', function (ev) {
        if (!/^keyboot!/.test(ev.data)) return;
        try { var data = JSON.parse(ev.data.replace(/^keyboot!/, '')) }
        catch (err) { return }
        
        if (data.sequence !== seq_) return;
        
        if (data.response === 'approved') {
            emitter.emit('approve');
        }
        else if (data.response === 'rejected') {
            emitter.emit('reject');
        }
        else if (data.response === 'pending') {
            emitter.emit('pending');
        }
    });
    
    var emitter = new EventEmitter;
    return emitter;
}

function createIframe (cb) {
    var iframe = document.createElement('iframe');
    iframe.addEventListener('load', function () {
        cb(iframe);
    });
    iframe.setAttribute('src', 'http://localhost:9005');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);
    return iframe;
}
