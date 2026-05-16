// 1. የFirebase አስመጪዎች (Imports)
import { ref, push, onValue } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js';
import { database } from './firebase_config.js';

// 2. ካርታውን አዲስ አበባ ላይ ማንቀሳቀስ (Initialize)
const map = L.map('map').setView([9.0192, 38.7525], 13);

setTimeout(() => {
    map.invalidateSize();
}, 200);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// የሚንቀሳቀስ ማርከር (Marker) መፍጠር
const marker = L.marker([9.0192, 38.7525], { draggable: true }).addTo(map);


const sendBtn = document.getElementById('sendBtn');
if (sendBtn) {
  sendBtn.onclick = function () {
    // በቅጽ (Form) ውስጥ የተሞሉትን መረጃዎች መውሰድ
    const customerName = document.getElementById('customerName')?.value || document.querySelector('input[type="text"]')?.value;
    const phone = document.getElementById('phone')?.value || document.querySelector('input[type="number"]')?.value;
    const itemType = document.getElementById('itemType')?.value || document.querySelectorAll('input[type="text"]')[2]?.value;
    const price = document.getElementById('price')?.value || document.querySelectorAll('input[type="text"]')[3]?.value;

    // የላኪው ማርከር (Marker) ያለበትን የካርታ መጋጠሚያ ማግኘት
    const position = marker.getLatLng();

    // ሁሉንም መረጃ በአንድ ላይ ማደራጀት
    const orderData = {
      name: customerName,
      phone: phone,
      item: itemType,
      price: price,
      latitude: position.lat,
      longitude: position.lng,
      timestamp: new Date().toISOString()
    };

    // መረጃውን ወደ Firebase 'orders' ክፍል መግፋት (Push)
    const ordersRef = ref(database, 'orders');
    push(ordersRef, orderData)
      .then(() => {
        alert('🎉 ትዕዛዝዎ በተሳካ ሁኔታ ተልኳል!');
        location.reload(); // ገጹን አድሶ ሳጥኖቹን ያጸዳቸዋል
      })
      .catch((error) => {
        alert('❌ ስህተት ተፈጥሯል: ' + error.message);
      });
  };
}