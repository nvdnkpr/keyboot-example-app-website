var keyboot = require('keyboot');

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
    boot.on('revoke', function () {
        clear();
    });
    boot.on('approve', function () {
        clear();
        form.style.display = 'none';
        var m = document.querySelector('#approve');
        m.style.display = 'block';
    });
    boot.on('close', clear);
    
    var signOut = document.querySelector('button.sign-out');
    signOut.addEventListener('click', function fn () {
        this.removeEventListener('click', fn);
        boot.close();
    });
    
    function clear () {
        form.style.display = 'block';
        var msgs = document.querySelectorAll('.msg');
        for (var i = 0; i < msgs.length; i++) {
            msgs[i].style.display = 'none';
        }
    }
});
