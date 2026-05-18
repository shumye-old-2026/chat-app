 import { ref, push, onValue, remove, update } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";
import { database } from "./firebase_config.js";

// 1. Initialize Map at Addis Ababa
const map = L.map("map").setView([9.0192, 38.7525], 13);

setTimeout(function () {
  map.invalidateSize();
}, 200);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap contributors"
}).addTo(map);

// Create Draggable Marker with Hint Popup
const marker = L.marker([9.0192, 38.7525], { draggable: true }).addTo(map);
marker.bindPopup("<b>ማድረሻ ቦታዎን እዚህ ላይ ያድርጉ 📍</b><br>በመምረጥ ይጎትቱት።").openPopup();

let currentPosition = marker.getLatLng();
marker.on("dragend", function () {
  currentPosition = marker.getLatLng();
  marker.openPopup();
});

// 2. Send Order to Firebase with Loading Button
const sendBtn = document.getElementById("sendBtn");
if (sendBtn) {
  sendBtn.onclick = function () {
    const customerName = document.getElementById("customerName")?.value;
    const phone = document.getElementById("phone")?.value;
    const itemType = document.getElementById("itemType")?.value;
    const deliveryArea = document.getElementById("deliveryArea")?.value;

    if (!customerName || !phone || !itemType || !deliveryArea) {
      alert("እባክዎ ሁሉንም ሳጥኖች በትክክል ይሙሉ!");
      return;
    }

    sendBtn.disabled = true;
    sendBtn.innerHTML = "በመላክ ላይ... ⏳";

    // የአሁኑን ሰዓትና ቀን በኢትዮጵያ ፎርማት ማዘጋጃ
    const now = new Date();
    const timeString = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
    const dateString = now.toLocaleDateString("en-US", { month: "short", day: "numeric" });

    const orderData = {
      name: customerName,
      phone: phone,
      item: itemType,
      area: deliveryArea,
      price: "导ጩ አልወሰነም",
      latitude: currentPosition.lat,
      longitude: currentPosition.lng,
      time: dateString + " | " + timeString // ሰዓት እዚህ ተቀመጠ
    };

    const ordersRef = ref(database, "orders");
    push(ordersRef, orderData)
      .then(function () {
        alert("🎉 ትዕዛዝዎ በተሳካ ሁኔታ ተልኳል! ሻጩ ዋጋውን አይቶ ይደውልልዎታል።");
        document.getElementById("customerName").value = "";
        document.getElementById("phone").value = "";
        document.getElementById("itemType").value = "";
        document.getElementById("deliveryArea").value = "";
      })
      .catch(function (error) {
        alert("❌ ስህተት: " + error.message);
      })
      .finally(function () {
        sendBtn.disabled = false;
        sendBtn.innerHTML = "✅ ትዕዛዝ ላክ";
      });
  };
}

// 3. Admin View Password Authentication
const loginAdminBtn = document.getElementById("loginAdminBtn");
const adminPasswordInput = document.getElementById("adminPassword");
const adminAuthBox = document.getElementById("adminAuthBox");
const ordersContainer = document.getElementById("ordersContainer");

const SECRET_PASSWORD = "1234"; 

if (loginAdminBtn) {
  loginAdminBtn.onclick = function () {
    if (adminPasswordInput.value === SECRET_PASSWORD) {
      adminAuthBox.style.display = "none";
      ordersContainer.style.display = "block";
      loadOrders(); 
    } else {
      alert("❌ የተሳሳተ ሚስጥር ቁጥር ነው! እንደገና ይሞክሩ።");
    }
  };
}

// 4. Display Orders (አዳዲስ ማሻሻያዎችን ያካተተ ንጹህ ክፍል)
function loadOrders() {
  const ordersListRef = ref(database, "orders");
  onValue(ordersListRef, function (snapshot) {
    if (!ordersContainer) return;
    ordersContainer.innerHTML = ""; 

    // የ "ውጣ (Logout)" በተን መፍጠሪያ
    const logoutBtn = document.createElement("button");
    logoutBtn.innerHTML = "🔒 ከአስተዳዳሪ ክፍል ውጣ";
    logoutBtn.style.width = "100%";
    logoutBtn.style.padding = "10px";
    logoutBtn.style.marginBottom = "20px";
    logoutBtn.style.backgroundColor = "#555555";
    logoutBtn.style.color = "white";
    logoutBtn.style.border = "none";
logoutBtn.style.borderRadius = "8px";
    logoutBtn.style.cursor = "pointer";
    logoutBtn.style.fontWeight = "bold";
    
    logoutBtn.onclick = function() {
      adminPasswordInput.value = "";
      ordersContainer.style.display = "none";
      adminAuthBox.style.display = "block";
      alert("🔒 በሰላም ወጥተዋል!");
    };
    ordersContainer.appendChild(logoutBtn);

    if (snapshot.exists()) {
      const data = snapshot.val();
      Object.keys(data).reverse().forEach(function (key) {
        const order = data[key];
        
        const orderCard = document.createElement("div");
        orderCard.style.border = "1px solid #e0e0e0";
        orderCard.style.borderRadius = "12px";
        orderCard.style.padding = "15px";
        orderCard.style.marginBottom = "15px";
        orderCard.style.backgroundColor = "#ffffff";
        orderCard.style.boxShadow = "0 4px 8px rgba(0,0,0,0.06)";
        orderCard.style.fontSize = "15px";
        orderCard.style.color = "#333";
        orderCard.style.lineHeight = "1.8";
        orderCard.style.textAlign = "left"; 
        orderCard.style.direction = "ltr";

        // የስልክ ቁጥሩን በቀጥታ የሚደወል ሊንክ (tel:) አደረግነው
        orderCard.innerHTML = 
          "<div>👤 <strong>ደንበኛ:</strong> " + (order.name || "ያልተጠቀሰ") + "</div>" +
          "<div>📞 <strong>ስልክ:</strong> <a href='tel:" + order.phone + "' style='color: #2e7d32; font-weight: bold; text-decoration: underline;'>" + (order.phone || "ያልተጠቀሰ") + " 📞 በቀጥታ ደውል</a></div>" +
          "<div>📦 <strong>የዕቃ ዓይነት:</strong> " + (order.item || "ያልተጠቀሰ") + "</div>" +
          "<div>🏢 <strong>ማድረሻ ሰፈር:</strong> " + (order.area || "ያልተጠቀሰ") + "</div>" +
          "<div>🕒 <strong>የተላከበት ሰዓት:</strong> <span style='color: #777;'>" + (order.time || "ያልታወቀ ሰዓት") + "</span></div>";

        // የዋጋ ቀለም ማስተካከያ
        let priceColor = order.price && order.price.includes("አልወሰነም") ? "#d32f2f" : "#2e7d32";
        const priceDiv = document.createElement("div");
        priceDiv.innerHTML = "💵 <strong>የዕቃ + ማድረሻ ዋጋ:</strong> <span style='color: " + priceColor + "; font-weight: bold;'>" + order.price + "</span>";
        orderCard.appendChild(priceDiv);

        // የጉግል ካርታ ትክክለኛ አቅጣጫ መክፈቻ ሊንክ
        const googleMapsUrl = "https://www.google.com/maps/dir/?api=1&destination=" + order.latitude + "," + order.longitude;
        const geoDiv = document.createElement("div");
        geoDiv.innerHTML = "📍 <strong>መገኛ (ካርታ):</strong> <a href='" + googleMapsUrl + "' target='_blank' style='color: #1976d2; font-weight: bold; text-decoration: underline;'>በጎግል ካርታ አቅጣጫ አሳይ 🗺️</a>";
        orderCard.appendChild(geoDiv);
          
        // የዋጋ ማሻሻያ ፎርም
        const priceSection = document.createElement("div");
        priceSection.style.marginTop = "10px";
        priceSection.style.padding = "8px";
        priceSection.style.backgroundColor = "#f9f9f9";
        priceSection.style.borderRadius = "6px";
        priceSection.style.border = "1px dashed #ccc";
        priceSection.style.display = "flex";
        priceSection.style.gap = "5px";

        const priceInput = document.createElement("input");
        priceInput.type = "number";
        priceInput.id = "inputPrice_" + key;
        priceInput.placeholder = "ዋጋ በብር";
        priceInput.style.width = "65%";
        priceInput.style.padding = "8px";
        priceInput.style.border = "1px solid #ccc";
        priceInput.style.borderRadius = "4px";

        const priceBtn = document.createElement("button");
        priceBtn.innerHTML = "ዋጋ አሳውቅ";
        priceBtn.style.width = "35%";
        priceBtn.style.padding = "8px";
        priceBtn.style.backgroundColor = "#1976d2";
        priceBtn.style.color = "white";
        priceBtn.style.border = "none";
        priceBtn.style.borderRadius = "4px";
        priceBtn.style.cursor = "pointer";
        priceBtn.style.fontSize = "13px";
        priceBtn.style.margin = "0";
 priceBtn.onclick = function () {
          const enteredPrice = priceInput.value;
          if (!enteredPrice) {
            alert("እባክዎ መጀመሪያ ዋጋ ያስገቡ!");
            return;
          }
          update(ref(database, "orders/" + key), { price: enteredPrice + " ብር" })
            .then(function () { alert("💵 ዋጋው ተሻሽሏል!"); })
            .catch(function (err) { alert("ስህተት: " + err.message); });
        };

        priceSection.appendChild(priceInput);
        priceSection.appendChild(priceBtn);
        orderCard.appendChild(priceSection);

        // ማጥፊያ በተን
        const deleteBtn = document.createElement("button");
        deleteBtn.innerHTML = "እቃው ደርሷል (አጥፋ) 🗑️";
        deleteBtn.style.marginTop = "10px";
        deleteBtn.style.backgroundColor = "#d32f2f";
        deleteBtn.style.color = "white";
        deleteBtn.style.border = "none";
        deleteBtn.style.borderRadius = "6px";
        deleteBtn.style.padding = "10px";
        deleteBtn.style.cursor = "pointer";
        deleteBtn.style.width = "100%";
        deleteBtn.style.fontWeight = "bold";
        
        deleteBtn.onclick = function () {
          if (confirm("ይህንን ትዕዛዝ ማጥፋት ይፈልጋሉ?")) {
            remove(ref(database, "orders/" + key));
          }
        };
        orderCard.appendChild(deleteBtn);
        ordersContainer.appendChild(orderCard);
      });
    } else {
      ordersContainer.innerHTML = "<p style='color:gray; text-align:center; font-style:italic;'>እስካሁን የተላከ ምንም ትዕዛዝ የለም።</p>";
    }
  });
}