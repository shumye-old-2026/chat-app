import { ref, push, onValue } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js';
import { database } from './firebase-config.js';

// ካርታውን ያስጀምራል
const map = L.map('map').setView([9.0300, 38.7400], 12);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
const marker = L.marker([9.0300, 38.7400], {draggable: true}).addTo(map);

let lat = 9.0300;
let lon = 38.7400;

marker.on('dragend', function(e) {
    const position = marker.getLatLng();
    lat = position.lat;
    lon = position.lng;
});

const sendBtn = document.getElementById('sendBtn');
const orderContainer = document.getElementById('orderContainer');

// ትዕዛዝ መላኪያ
sendBtn.onclick = function() {
    const name = document.getElementById('custName').value;
    const phone = document.getElementById('phone').value;
    const item = document.getElementById('item').value;
    const price = document.getElementById('price').value;

    if (name && phone && item && price) {
        const ordersRef = ref(database, 'orders');
        push(ordersRef, {
            customerName: name,
            phoneNumber: phone,
            orderItem: item,
            orderPrice: price,
            timestamp: new Date().toLocaleString(),
            location: { lat: lat, lon: lon }
        }).then(function() {
            alert('ትዕዛዝህ በትክክል ተልኳል! ✅');
            document.getElementById('custName').value = '';
            document.getElementById('phone').value = '';
            document.getElementById('item').value = '';
            document.getElementById('price').value = '';
        }).catch(function(error) {
            alert('ስህተት: ' + error.message);
        });
    } else {
        alert('እባክህ ሁሉንም መረጃ ሙላ!');
    }
};

// ትዕዛዞችን ማሳያ
const ordersRef = ref(database, 'orders');
onValue(ordersRef, function(snapshot) {
    const data = snapshot.val();
    orderContainer.innerHTML = ''; 
    if (data) {
        Object.keys(data).reverse().forEach(function(key) {
            const order = data[key];
            const orderDiv = document.createElement('div');
            orderDiv.style.background = '#fff';
            orderDiv.style.padding = '15px';
            orderDiv.style.marginBottom = '10px';
            orderDiv.style.borderLeft = '5px solid #1a73e8';
            orderDiv.style.borderRadius = '8px';
            
            orderDiv.innerHTML = '<p><strong>ስም:</strong> ' + order.customerName + '</p>' +
                                '<p><strong>ስልክ:</strong> ' + order.phoneNumber + '</p>' +
                                '<p><strong>ዕቃ:</strong> ' + order.orderItem + '</p>' +
                                '<p><strong>ዋጋ:</strong> ' + order.orderPrice + ' ብር</p>';
            orderContainer.appendChild(orderDiv);
        });
    }
});   