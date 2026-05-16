// 1. መጀመሪያ ካርታውን እናስጀምር (ከሁሉም በፊት መሆን አለበት!)
const map = L.map('map').setView([9.0192, 38.7525], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

const marker = L.marker([9.0192, 38.7525], {draggable: true}).addTo(map);

// አሁን ከዚህ በታች ያሉት ያንተ የድሮ ኮዶች ይቀጥላሉ...
import { ref, push, onValue } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js';
import { database } from './firebase-config.js'; // 1. መጀመሪያ ካርታውን እናስጀምር (ከሁሉም በፊት መሆን አለበት!)
const map = L.map('map').setView([9.0192, 38.7525], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

const marker = L.marker([9.0192, 38.7525], {draggable: true}).addTo(map);

// አሁን ከዚህ በታች ያሉት ያንተ የድሮ ኮዶች ይቀጥላሉ...
import { ref, push, onValue } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js';
import { database } from './firebase-config.js';

// የተቀረው የFirebase እና የButton ኮድ እዚህ ይቀጥላል...

// የተቀረው የFirebase እና የButton ኮድ እዚህ ይቀጥላል...
import { ref, push, onValue } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js';
import { database } from './firebase-config.js';

// ማሳሰቢያ፡ map እና marker ከ index.html ላይ በግሎባል ስለሚመጡ እዚህ ላይ በድጋሚ መጻፍ አያስፈልግም!

// 1. ትዕዛዝ መላክ
const sendBtn = document.getElementById('sendBtn');
if (sendBtn) {
    sendBtn.onclick = function() {
        const name = document.getElementById('custName').value;
        const phone = document.getElementById('phone').value;
        const item = document.getElementById('item').value;
        const price = document.getElementById('price').value;
        
        // ከ index.html ማርከር ላይ ቦታውን ይወስዳል
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
                alert('트ዕዛዝዎ ተልኳል! ✅');
                document.getElementById('custName').value = '';
                document.getElementById('phone').value = '';
                document.getElementById('item').value = '';
                document.getElementById('price').value = '';
            });
        } else {
            alert('እባክዎ ሁሉንም መረጃ ይሙሉ!');
        }
    };
}

// 2. ዝርዝሮችን ማሳየት
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