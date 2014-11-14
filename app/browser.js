var keyboot = require('keyboot');

var form = document.querySelector('form');
var write = document.querySelector('.write');

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
        write.style.display = 'block';
    });
    boot.on('close', clear);
    
    var signOut = document.querySelector('button.sign-out');
    signOut.addEventListener('click', function fn () {
        this.removeEventListener('click', fn);
        write.querySelector('button').removeEventListener('click', onsign);
        boot.close();
    });
    
    write.querySelector('button').addEventListener('click', onsign);
    
    function onsign () {
        var txt = write.querySelector('textarea').value;
        boot.sign(txt, function (err, result) {
            if (err) console.error(err);
            var str = Buffer(result).toString('base64');
            write.querySelector('.result').textContent = str;
        });
    }
    
    function clear () {
        form.style.display = 'block';
        write.style.display = 'none';
        var msgs = document.querySelectorAll('.msg');
        for (var i = 0; i < msgs.length; i++) {
            msgs[i].style.display = 'none';
        }
    }
});
