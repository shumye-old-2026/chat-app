import { ref, push, onValue } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js';
import { database } from './firebase-config.js';

// ካርታ ማስጀመሪያ
const map = L.map('map').setView([9.0300, 38.7400], 12);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
const marker = L.marker([9.0300, 38.7400], {draggable: true}).addTo(map);

let pos = { lat: 9.0300, lon: 38.7400 };
marker.on('dragend', () => { pos = marker.getLatLng(); });

// ትዕዛዝ መላኪያ
document.getElementById('sendBtn').onclick = () => {
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
            location: { lat: pos.lat, lon: pos.lng },
            timestamp: new Date().toLocaleString()
        }).then(() => {
            alert('ተልኳል! ✅');
            location.reload(); 
        });
    } else { alert('ሁሉንም ሙላ!'); }
};

// ትዕዛዝ ማንበቢያ
onValue(ref(database, 'orders'), (snapshot) => {
    const data = snapshot.val();
    const container = document.getElementById('orderContainer');
    container.innerHTML = '';
    if (data) {
        Object.keys(data).reverse().forEach(key => {
            const o = data[key];
            container.innerHTML += <div style="background:white; padding:10px; margin:5px; border-radius:5px;">
                ${o.customerName} - ${o.orderItem} (${o.orderPrice} ብር)</div>;
        });
    }
});