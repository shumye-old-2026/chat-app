import { ref, push, onValue } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js';
import { database } from './firebase-config.js';

// ካርታውን ማስጀመር
var map = L.map('map').setView([9.03, 38.74], 12);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
var marker = L.marker([9.03, 38.74], {draggable: true}).addTo(map);

var lat = 9.03;
var lon = 38.74;

marker.on('dragend', function() {
    var pos = marker.getLatLng();
    lat = pos.lat;
    lon = pos.lng;
});

// መረጃ መላኪያ
document.getElementById('sendBtn').onclick = function() {
    var name = document.getElementById('custName').value;
    var tel = document.getElementById('phone').value;
    var msg = document.getElementById('item').value;
    var prc = document.getElementById('price').value;

    if (name && tel && msg && prc) {
        push(ref(database, 'orders'), {
            customer: name,
            phone: tel,
            item: msg,
            price: prc,
            lat: lat,
            lon: lon,
            time: new Date().toLocaleString()
        }).then(function() {
            alert('ተልኳል!');
            location.reload();
        });
    } else {
        alert('ሁሉንም ሙላ!');
    }
};

// መረጃ መቀበያ
onValue(ref(database, 'orders'), function(snap) {
    var data = snap.val();
    var list = document.getElementById('container');
    list.innerHTML = '';
    if (data) {
        Object.keys(data).forEach(function(key) {
            var o = data[key];
            var d = document.createElement('div');
            d.style.borderBottom = '1px solid #eee';
            d.style.padding = '5px';
            // ባክቲክ የሌለው የጽሁፍ አቀራረብ
            d.innerHTML = '<b>' + o.customer + '</b>: ' + o.item + ' - ' + o.price + ' ብር';
            list.appendChild(d);
        });
    }
});