 // 1. Firebase Imports
import { ref, push, onValue, remove } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js';
import { database } from './firebase_config.js';

// 2. Initialize Map at Addis Ababa
const map = L.map('map').setView([9.0192, 38.7525], 13);

setTimeout(() => {
  map.invalidateSize();
}, 200);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Create Draggable Marker
const marker = L.marker([9.0192, 38.7525], { draggable: true }).addTo(map);

// 3. Send Order to Firebase
const sendBtn = document.getElementById('sendBtn');
if (sendBtn) {
  sendBtn.onclick = function () {
    const customerName = document.getElementById('customerName')?.value || document.querySelector('input[type="text"]')?.value;
    const phone = document.getElementById('phone')?.value || document.querySelectorAll('input')[1]?.value;
    const itemType = document.getElementById('itemType')?.value || document.querySelectorAll('input')[2]?.value;
    const price = document.getElementById('price')?.value || document.querySelectorAll('input')[3]?.value;

    // Get current marker position dynamically
    const position = marker.getLatLng(); 

    const orderData = {
      name: customerName,
      phone: phone,
      item: itemType,
      price: price,
      latitude: position.lat,
      longitude: position.lng,
      timestamp: new Date().toISOString()
    };

    const ordersRef = ref(database, 'orders');
    push(ordersRef, orderData)
      .then(() => {
        alert('🎉 ትዕዛዝዎ በተሳካ ሁኔታ ተልኳል!');
        if(document.getElementById('customerName')) {
          document.getElementById('customerName').value = '';
          document.getElementById('phone').value = '';
          document.getElementById('itemType').value = '';
          document.getElementById('price').value = '';
        }
      })
      .catch((error) => {
        alert('❌ ስህተት ተፈጥሯል: ' + error.message);
      });
  };
}

// 4. Listen to Firebase and Display Orders + Delete Button
const ordersListRef = ref(database, 'orders');
onValue(ordersListRef, (snapshot) => {
  let ordersContainer = document.getElementById('ordersContainer');
  
  if (!ordersContainer) {
    const h3Elements = document.querySelectorAll('h3');
    let targetH3;
    h3Elements.forEach(h3 => {
      if (h3.textContent.includes('የተላኩ')) targetH3 = h3;
    });
    
    if (targetH3) {
      ordersContainer = document.createElement('div');
      ordersContainer.id = 'ordersContainer';
      ordersContainer.style.padding = '10px';
      targetH3.parentNode.insertBefore(ordersContainer, targetH3.nextSibling);
    }
  }

  if (ordersContainer) {
    ordersContainer.innerHTML = ''; 

    if (snapshot.exists()) {
      const data = snapshot.val();
      Object.keys(data).reverse().forEach((key) => {
        const order = data[key];
        
        // UI Styling for Cards
        const orderCard = document.createElement('div');
        orderCard.style.border = '1px solid #e0e0e0';
        orderCard.style.borderRadius = '12px';
        orderCard.style.padding = '15px';
        orderCard.style.marginBottom = '15px';
        orderCard.style.backgroundColor = '#ffffff';
        orderCard.style.boxShadow = '0 4px 8px rgba(0,0,0,0.06)';
        orderCard.style.fontSize = '15px';
        orderCard.style.color = '#333';
        orderCard.style.lineHeight = '1.6';
        orderCard.style.position = 'relative';

        orderCard.innerHTML = 
          "<strong>👤 ደንበኛ:</strong> " + (order.name || 'ያልተጠቀሰ') + "<br />" +
          "<strong>📞 ስልክ:</strong> " + (order.phone || 'ያልተጠቀሰ') + "<br />" +
          "<strong>📦 የዕቃ ዓይነት:</strong> " + (order.item || 'ያልተጠቀሰ') + "<br />" +
          "<strong>💵 የተስማሙበት ዋጋ:</strong> <span style='color: #2e7d32; font-weight: bold;'>" + (order.price || '0') + " ብር</span><br />" +
 "<strong>📍 መገኛ (ካርታ):</strong> <span style='color: #1976d2;'>ላቲ፡ " + parseFloat(order.latitude).toFixed(4) + " ፣ ሎንጊ፡ " + parseFloat(order.longitude).toFixed(4) + "</span><br />";
          
        // Delete Button
        const deleteBtn = document.createElement('button');
        deleteBtn.innerHTML = 'እቃው ደርሷል (አጥፋ) 🗑️';
        deleteBtn.style.marginTop = '10px';
        deleteBtn.style.backgroundColor = '#d32f2f';
        deleteBtn.style.color = 'white';
        deleteBtn.style.border = 'none';
        deleteBtn.style.borderRadius = '6px';
        deleteBtn.style.padding = '6px 12px';
        deleteBtn.style.cursor = 'pointer';
        deleteBtn.style.fontWeight = 'bold';
        deleteBtn.style.width = '100%';
        
        deleteBtn.onclick = function() {
          if (confirm('ይህ ትዕዛዝ በተሳካ ሁኔታ መድረሱን አረጋግጠው ማጥፋት ይፈልጋሉ?')) {
            const itemRef = ref(database, 'orders/' + key);
            remove(itemRef)
              .then(() => { alert('🗑️ ትዕዛዙ ከዝርዝሩ ላይ ተሰርዟል!'); })
              .catch((err) => { alert('ስህተት: ' + err.message); });
          }
        };
        
        orderCard.appendChild(deleteBtn);
        ordersContainer.appendChild(orderCard);
      });
    } else {
      ordersContainer.innerHTML = '<p style="color: gray; padding: 15px; text-align: center; font-style: italic;">እስካሁን የተላከ ምንም ትዕዛዝ የለም።</p>';
    }
  }
});