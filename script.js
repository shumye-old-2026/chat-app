import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, push, onValue, update } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyBVwvrXBIyaIISyUFf2NyLFBq_mmcvaPCc",
    authDomain: "my-chat-app-393d0.firebaseapp.com",
    databaseURL: "https://my-chat-app-393d0-default-rtdb.firebaseio.com",
    projectId: "my-chat-app-393d0",
    storageBucket: "my-chat-app-393d0.appspot.com",
    messagingSenderId: "836061447359",
    appId: "1:836061447359:web:9a071fb5931ad8b50e320a"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const ordersRef = ref(db, 'orders');

// የድምፅ ማሳወቂያ
const notificationSound = new Audio('notification.mp3');

// ኤለመንቶችን ማግኘት
const sendBtn = document.getElementById('sendBtn');
const orderContainer = document.getElementById('orderContainer');

// 1. ትዕዛዝ ለመላክ (GPS ጨምሮ)
sendBtn.addEventListener('click', () => {
    const name = document.getElementById('custName').value;
    const phone = document.getElementById('custPhone').value;
    const item = document.getElementById('item').value;
    const price = document.getElementById('itemPrice').value;

    if (name === '' || phone === '') {
        alert('እባክዎን ስም እና ስልክ ያስገቡ!');
        return;
    }

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;

            push(ordersRef, {
                customerName: name,
                phone: phone,
                item: item,
                price: price,
                location: { lat: lat, lng: lng },
                status: 'በመጠባበቅ ላይ',
                timestamp: Date.now()
            }).then(() => {
                alert('ትዕዛዝዎ ተልኳል!');
                document.getElementById('custName').value = '';
                document.getElementById('custPhone').value = '';
                document.getElementById('item').value = '';
                document.getElementById('itemPrice').value = '';
            });
        }, (error) => {
            alert('GPS ማግኘት አልተቻለም፣ እባክዎን Location ይፍቀዱ!');
        });
    } else {
        alert('ብሮውዘርዎ GPS አይደግፍም!');
    }
});

// 2. ትዕዛዞችን ለመቀበልና ለማሳየት
onValue(ordersRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
        notificationSound.play().catch(e => console.log('ድምፅ ለማጫወት ገጹን ይንኩ'));
        
        orderContainer.innerHTML = '';
        Object.entries(data).reverse().forEach(([id, order]) => {
            const card = document.createElement('div');
            card.className = 'order-card';

            let statusColor = order.status === 'በመጠባበቅ ላይ' ? '#f39c12' : '#27ae60';
            let statusText = order.status ? order.status : 'በመጠባበቅ ላይ';

            let cardHTML = '<p><strong>ስም:</strong> ' + (order.customerName || 'ያልታወቀ') + '</p>';
            cardHTML += '<p><strong>ስልክ:</strong> ' + (order.phone || 'የለም') + '</p>';
            cardHTML += '<p><strong>ዕቃ:</strong> ' + (order.item || 'የለም') + '</p>';
            cardHTML += '<p><strong>ዋጋ:</strong> ' + (order.price ? order.price + ' ብር' : 'ያልተጠቀሰ') + '</p>';
            cardHTML += '<p><strong>ሁኔታ:</strong> <span style="color: ' + statusColor + '">' + statusText + '</span></p>';

            if (order.status === 'በመጠባበቅ ላይ') {
                cardHTML += '<button onclick="window.changeStatus(\'' + id + '\')" style="background: #28a745; color: white; border: none; padding: 8px; border-radius: 5px; cursor: pointer; width: 100%; margin-top: 10px;">እንደተረከብኩ አሳውቅ</button>';
            }

            card.innerHTML = cardHTML;
            orderContainer.appendChild(card);
        });
    }
});

// 3. ሁኔታን ለመቀየር
window.changeStatus = (id) => {
    update(ref(db, 'orders/' + id), { status: 'ተጠናቅቋል' });
};
 // ካርታውን መጀመሪያ አዲስ አበባ ላይ ማስጀመር
var map = L.map('map').setView([9.0192, 38.7525], 12);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap'
}).addTo(map);

// የትዕዛዝ ምልክቶችን ለማስቀመጥ
onValue(ordersRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
        Object.entries(data).forEach(([id, order]) => {
            if (order.location && order.status === 'በመጠባበቅ ላይ') {
                // በደንበኛው ቦታ ላይ ምልክት ማድረግ
                var orderMarker = L.marker([order.location.lat, order.location.lng]).addTo(map);
                orderMarker.bindPopup('<b>ትዕዛዝ ከ: ' + order.customerName + '</b><br>ዕቃ: ' + order.item);
            }
        });
    }
});