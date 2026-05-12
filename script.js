import { ref, push, onValue } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js';
import { database } from './firebase-config.js';

const sendBtn = document.getElementById('sendBtn');
const orderContainer = document.getElementById('orderContainer');

// 1. ትዕዛዝ ወደ Firebase ለመላክ
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
            timestamp: new Date().toLocaleString()
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
        alert('እባክህ ሁሉንም ሳጥኖች በትክክል ሙላ! ⚠️');
    }
};

// 2. የመጡ ትዕዛዞችን ከ Firebase አንብቦ ለማሳየት
const ordersRef = ref(database, 'orders');
onValue(ordersRef, function(snapshot) {
    const data = snapshot.val();
    orderContainer.innerHTML = ''; 

    if (data) {
        const keys = Object.keys(data).reverse();
        keys.forEach(function(key) {
            const order = data[key];
            const orderDiv = document.createElement('div');
            
            // የካርዱ ዲዛይን (በነጠላ ሰረዝ የተሰራ)
            orderDiv.style.background = '#fff';
            orderDiv.style.padding = '15px';
            orderDiv.style.marginBottom = '10px';
            orderDiv.style.borderLeft = '5px solid #1a73e8';
            orderDiv.style.borderRadius = '8px';
            orderDiv.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';
            
            // ጽሁፎችን ማሳያ (ያለ ባክቲክ)
            orderDiv.innerHTML = '<p><strong>ስም:</strong> ' + order.customerName + '</p>' +
                                '<p><strong>ስልክ:</strong> ' + order.phoneNumber + '</p>' +
                                '<p><strong>ዕቃ:</strong> ' + order.orderItem + '</p>' +
                                '<p><strong>ዋጋ:</strong> ' + order.orderPrice + ' ብር</p>' +
                                '<p style="font-size: 12px; color: #888;">' + order.timestamp + '</p>';
            
            orderContainer.appendChild(orderDiv);
        });
    } else {
        orderContainer.innerHTML = '<p style="text-align: center; color: #888;">በአሁኑ ሰዓት ምንም ትዕዛዝ የለም...</p>';
    }
});