import { ref, push, onValue } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js';
import { database } from './firebase-config.js';

// 1. ካርታውን አዲስ አበባ ላይ እናስጀምር
const map = L.map('map').setView([9.0192, 38.7525], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// የሚንቀሳቀስ ማርከር መፍጠር
const marker = L.marker([9.0192, 38.7525], { draggable: true }).addTo(map);

// 2. መረጃን ወደ Firebase ለመላክ (የላክ በተን)
const sendBtn = document.getElementById('sendBtn');
if (sendBtn) {
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
                alert('ትዕዛዝዎ በተሳካ ሁኔታ ተልኳል! 🚀');
                document.getElementById('custName').value = '';
                document.getElementById('phone').value = '';
                document.getElementById('item').value = '';
                document.getElementById('price').value = '';
            }).catch(function(error) {
                alert('ስህተት ተከስቷል፦ ' + error.message);
            });
        } else {
            alert('እባክዎ ሁሉንም መረጃዎች በአግባቡ ይሙሉ!');
        }
    };
}

// 3. የተላኩ ትዕዛዞችን ከFirebase አምጥቶ ማሳየት
const container = document.getElementById('orderContainer');
onValue(ref(database, 'orders'), (snapshot) => {
    const data = snapshot.val();
    if (container) {
        container.innerHTML = ''; 
        if (data) {
            Object.keys(data).reverse().forEach(function(key) {
                const o = data[key];
                const card = document.createElement('div');
                card.className = 'order-card';
                
                // እዚህ ጋር ምንም Backtick የለም - ተራ ነጠላ ሰረዝ ስለሆነ ስህተት አይፈጥርም
                card.innerHTML = '<b>ስም:</b> ' + (o.customerName || 'ያልተገለጸ') + '<br>' +
                                 '<b>ስልክ:</b> ' + (o.phoneNumber || 'ያልተገለጸ') + '<br>' +
                                 '<b>ዕቃ:</b> ' + o.orderItem + ' (' + o.orderPrice + ' ብር)<br>' +
                                 '<small style="color: #777;">የታዘዘበት ቀን፦ ' + (o.timestamp || '') + '</small>';
                                 
                container.appendChild(card);
            });
        } else {
            container.innerHTML = '<p style="text-align:center; color:#999;">እስካሁን ምንም የተመዘገበ ትዕዛዝ የለም።</p>';
        }
    }
});