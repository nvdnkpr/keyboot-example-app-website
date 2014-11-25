var keyboot = require('keyboot');

var form = document.querySelector('form');
var write = document.querySelector('.write');

form.addEventListener('submit', function (ev) {
    ev.preventDefault();
    signIn(form.elements.url.value);
});

var prevUrl = localStorage.getItem('keyboot!url');
if (prevUrl) signIn(prevUrl)
else clear()

function signIn (url) {
    var boot = keyboot(url, {
        permissions: [ 'fingerprint', 'sign' ]
    });
    boot.fingerprint(function (err, result) {
        if (err) return console.error(err)
        document.querySelector('#fingerprint').textContent = result;
    });
    
    boot.on('pending', function () {
        form.style.display = 'none';
        var m = document.querySelector('#pending');
        var link = m.querySelector('a');
        m.style.display = 'block';
        link.setAttribute('href', url);
        link.textContent = url;
    });
    boot.on('reject', function () {
        clear();
        document.querySelector('#reject').style.display = 'block';
    });
    boot.on('revoke', function () {
        clear();
        localStorage.removeItem('keyboot!url');
    });
    boot.on('approve', function () {
        clear();
        form.style.display = 'none';
        var m = document.querySelector('#approve');
        m.style.display = 'block';
        write.style.display = 'block';
        localStorage.setItem('keyboot!url', url);
    });
    boot.on('close', function () {
        write.querySelector('button').removeEventListener('click', onsign);
        clear();
        localStorage.removeItem('keyboot!url', url);
    });
    
    var signOut = document.querySelector('button.sign-out');
    signOut.addEventListener('click', function fn () {
        this.removeEventListener('click', fn);
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
}

function clear () {
    form.style.display = 'block';
    write.style.display = 'none';
    var msgs = document.querySelectorAll('.msg');
    for (var i = 0; i < msgs.length; i++) {
        msgs[i].style.display = 'none';
    }
}
