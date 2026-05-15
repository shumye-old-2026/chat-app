import { ref, push, onValue } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js';
import { database } from './firebase-config.js';

// 1. ካርታውን በኢትዮጵያ (አዲስ አበባ) መጋጠሚያ ማስጀመር
var map = L.map('map').setView([9.0192, 38.7525], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap'
}).addTo(map);

// የሚንቀሳቀስ ምልክት (Marker) በካርታው ላይ ማድረግ
var marker = L.marker([9.0192, 38.7525], {draggable: true}).addTo(map);

// 2. የላክ (Send) በተኑን መቆጣጠር
const sendBtn = document.getElementById('sendBtn');
if (sendBtn) {
    sendBtn.onclick = function() {
        const name = document.getElementById('custName').value;
        const phone = document.getElementById('phone').value;
        const item = document.getElementById('item').value;
        const price = document.getElementById('price').value;
        const pos = marker.getLatLng(); // የካርታው ምልክት ያለበት ቦታ

        if (name && phone && item && price) {
            push(ref(database, 'orders'), {
                customerName: name,
                phoneNumber: phone,
                orderItem: item,
                orderPrice: price,
                location: { lat: pos.lat, lon: pos.lng },
                timestamp: new Date().toLocaleString()
            }).then(function() {
                alert('ትዕዛዝዎ በተሳካ ሁኔታ ተልኳል! ✅');
                // ሳጥኖቹን ማጽዳት
                document.getElementById('custName').value = '';
                document.getElementById('phone').value = '';
                document.getElementById('item').value = '';
                document.getElementById('price').value = '';
            });
        } else {
            alert('እባክዎ ሁሉንም ሳጥኖች በትክክል ይሙሉ!');
        }
    };
}

// 3. የትዕዛዝ ዝርዝሮችን ከFirebase እያነበቡ ማሳየት (ያለ ባክቲክ)
const container = document.getElementById('orderContainer');
onValue(ref(database, 'orders'), function(snapshot) {
    const data = snapshot.val();
    if (container) {
        container.innerHTML = ''; 
        if (data) {
            Object.keys(data).reverse().forEach(function(key) {
                const o = data[key];
                const card = document.createElement('div');
                card.className = 'order-card';
                
                // በተራ ኮቴሽን (' ') የተሰራ የትዕዛዝ ዝርዝር ማሳያ
                card.innerHTML = '<b>ስም:</b> ' + o.customerName + '<br>' +
                                 '<b>ዕቃ:</b> ' + o.orderItem + ' (' + o.orderPrice + ' ብር)<br>' +
                                 '<small>' + o.timestamp + '</small>';
                
                container.appendChild(card);
            });
        } else {
            container.innerHTML = '<p style="text-align:center; color:#999;">ምንም ትዕዛዝ የለም</p>';
        }
    }
});