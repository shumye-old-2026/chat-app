import { ref, push, onValue } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js';
import { database } from './firebase-config.js';

// 1. ካርታውን ማስጀመር (አስፈላጊ ከሆነ)
const map = L.map('map').setView([9.0300, 38.7400], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
const marker = L.marker([9.0300, 38.7400], {draggable: true}).addTo(map);

// 2. ትዕዛዝ መላኪያ
const sendBtn = document.getElementById('sendBtn');
sendBtn.onclick = function() {
    const name = document.getElementById('custName').value;
    const phone = document.getElementById('phone').value;
    const item = document.getElementById('item').value;
    const price = document.getElementById('price').value;
    const pos = marker.getLatLng();

    if (name && phone && item && price) {
        push(ref(database, 'orders'), {
            customerName: name,
            phoneNumber: phone,
            orderItem: item,
            orderPrice: price,
            location: { lat: pos.lat, lon: pos.lng },
            timestamp: new Date().toLocaleString()
        }).then(function() {
            alert('ትዕዛዝዎ ተልኳል! ✅');
            // ሳጥኖቹን ባዶ ለማድረግ
            document.getElementById('custName').value = '';
            document.getElementById('phone').value = '';
            document.getElementById('item').value = '';
            document.getElementById('price').value = '';
        });
    } else {
        alert('እባክዎ ሁሉንም ሳጥኖች ይሙሉ!');
    }
};

// 3. የመጡ ትዕዛዞችን ከስር ማሳያ
const container = document.getElementById('orderContainer');
onValue(ref(database, 'orders'), function(snapshot) {
    const data = snapshot.val();
    container.innerHTML = ''; // የድሮውን አጽዳ
    
    if (data) {
        Object.keys(data).reverse().forEach(function(key) {
            const o = data[key];
            const div = document.createElement('div');
            div.style.cssText = 'background:white; padding:15px; margin-top:10px; border-radius:8px; border-left:5px solid #1a73e8; box-shadow: 0 1px 3px rgba(0,0,0,0.1);';
            
            div.innerHTML = '<b>ስም:</b> ' + o.customerName + '<br>' +
                            '<b>ዕቃ:</b> ' + o.orderItem + ' (' + o.orderPrice + ' ብር)<br>' +
                            '<small style="color:#888;">' + o.timestamp + '</small>';
            container.appendChild(div);
        });
    } else {
        container.innerHTML = '<p style="text-align:center; color:#999;">ምንም ትዕዛዝ የለም</p>';
    }
});