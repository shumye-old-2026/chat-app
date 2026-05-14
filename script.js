import { ref, push, onValue } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js';
import { database } from './firebase-config.js';

// 1. ካርታ ማስጀመሪያ
const map = L.map('map').setView([9.0300, 38.7400], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap'
}).addTo(map);

const marker = L.marker([9.0300, 38.7400], {draggable: true}).addTo(map);

let currentLat = 9.0300;
let currentLon = 38.7400;

marker.on('dragend', function() {
    const pos = marker.getLatLng();
    currentLat = pos.lat;
    currentLon = pos.lng;
});

// 2. ትዕዛዝ መላኪያ
const sendBtn = document.getElementById('sendBtn');
if (sendBtn) {
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
            }).catch(function(error) {
                alert('ስህተት: ' + error.message);
            });
        } else {
            alert('እባክህ ሁሉንም መረጃ ሙላ!');
        }
    };
}

// 3. ትዕዛዝ ማሳያ (ባክቲክ የሌለው)
const orderContainer = document.getElementById('orderContainer');
onValue(ref(database, 'orders'), function(snapshot) {
    const data = snapshot.val();
    if (orderContainer) {
        orderContainer.innerHTML = '';
        if (data) {
            Object.keys(data).reverse().forEach(function(key) {
                const o = data[key];
                const div = document.createElement('div');
                div.className = 'order-card';
                div.innerHTML = '<p><strong>ስም:</strong> ' + o.customerName + '</p>' +
                                '<p><strong>ዕቃ:</strong> ' + o.orderItem + ' (' + o.orderPrice + ' ብር)</p>';
                orderContainer.appendChild(div);
            });
        } else {
            orderContainer.innerHTML = '<p style="text-align:center; color:#999;">ምንም ትዕዛዝ የለም</p>';
        }
    }
});