import { ref, push, onValue } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js';
import { database } from './firebase-config.js';

// ካርታውን ማስጀመር
const map = L.map('map').setView([9.0300, 38.7400], 12);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
const marker = L.marker([9.0300, 38.7400], {draggable: true}).addTo(map);

let lat = 9.0300;
let lon = 38.7400;

marker.on('dragend', function() {
    const pos = marker.getLatLng();
    lat = pos.lat;
    lon = pos.lng;
});

const sendBtn = document.getElementById('sendBtn');

sendBtn.onclick = function() {
    const name = document.getElementById('custName').value;
    const phone = document.getElementById('phone').value;
    const item = document.getElementById('item').value;
    const price = document.getElementById('price').value;

    if (name && phone && item && price) {
        push(ref(database, 'orders'), {
            customerName: name,
            phoneNumber: phone,
            orderItem: item,
            orderPrice: price,
            location: { lat: lat, lon: lon },
            timestamp: new Date().toLocaleString()
        }).then(function() {
            alert('ትዕዛዝ ተልኳል! ✅');
            location.reload(); // ካርታውና ፎርሙ እንዲታደስ
        });
    } else {
        alert('ሁሉንም ሙላ!');
    }
};

// ትዕዛዞችን ማሳየት
onValue(ref(database, 'orders'), function(snapshot) {
    const data = snapshot.val();
    const container = document.getElementById('orderContainer');
    container.innerHTML = '';
    if (data) {
        Object.keys(data).reverse().forEach(function(key) {
            const o = data[key];
            const div = document.createElement('div');
            div.style = 'border-bottom: 1px solid #eee; padding: 10px;';
            div.innerHTML = '<p><strong>' + o.customerName + '</strong> - ' + o.orderItem + ' (' + o.orderPrice + ' ብር)</p>';
            container.appendChild(div);
        });
    }
});