import { ref, push, onValue } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js';
import { database } from './firebase-config.js';

// ካርታውን ማስጀመር
const map = L.map('map').setView([9.0300, 38.7400], 12);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
const marker = L.marker([9.0300, 38.7400], {draggable: true}).addTo(map);

let currentLat = 9.0300;
let currentLon = 38.7400;

marker.on('dragend', function() {
    const pos = marker.getLatLng();
    currentLat = pos.lat;
    currentLon = pos.lng;
});

// ትዕዛዝ መላኪያ
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
            location: { lat: currentLat, lon: currentLon },
            timestamp: new Date().toLocaleString()
        }).then(function() {
            alert('ትዕዛዝ ተልኳል! ✅');
            location.reload();
        });
    } else {
        alert('እባክህ ሁሉንም ሙላ!');
    }
};

// ትዕዛዞችን ማሳያ (ባክቲክ የሌለው)
onValue(ref(database, 'orders'), function(snapshot) {
    const data = snapshot.val();
    const container = document.getElementById('orderContainer');
    container.innerHTML = '';
    if (data) {
        Object.keys(data).reverse().forEach(function(key) {
            const o = data[key];
            const div = document.createElement('div');
            div.className = 'order-card';
            // እዚህ ጋር ባክቲክ ሳይሆን በመደመር (+) ምልክት ነው የተሰራው
            div.innerHTML = '<p><strong>ስም:</strong> ' + o.customerName + '</p>' +
                            '<p><strong>ዕቃ:</strong> ' + o.orderItem + ' (' + o.orderPrice + ' ብር)</p>' +
                            '<p><small>' + o.timestamp + '</small></p>';
            container.appendChild(div);
        });
    }
});