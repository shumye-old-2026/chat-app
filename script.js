import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, push, onValue, update } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyBVwvrXBlyaIISyUFf2NyLFBq_mmcvaPCc",
    authDomain: "my-chat-app-393d0.firebaseapp.com",
    databaseURL: "https://my-chat-app-393d0-default-rtdb.firebaseio.com",
    projectId: "my-chat-app-393d0",
    storageBucket: "my-chat-app-393d0.appspot.com",
    messagingSenderId: "836061447359",
    appId: "1:836061447359:web:9a071fb5931ad8b50e320a"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const ordersRef = ref(db, "orders");

document.getElementById("sendBtn").onclick = () => {
    const name = document.getElementById("custName").value;
    const phone = document.getElementById("custPhone").value;
    const item = document.getElementById("item").value;
    
    if(name && phone && item) {
        push(ordersRef, { 
            name: name, 
            phone: phone, 
            item: item, 
            status: "በመጠባበቅ ላይ", 
            time: new Date().toLocaleTimeString() 
        }).then(() => {
            alert("ትዕዛዝ ተልኳል! ✅");
            document.getElementById("custName").value = "";
            document.getElementById("custPhone").value = "";
            document.getElementById("item").value = "";
        });
    } else {
        alert("እባክዎ ሁሉንም ሳጥኖች ይሙሉ!");
    }
};

const orderContainer = document.getElementById("orderContainer");
onValue(ordersRef, (snapshot) => {
    orderContainer.innerHTML = "";
    const data = snapshot.val();
    if(data) {
        Object.entries(data).reverse().forEach(([id, order]) => {
            const card = document.createElement("div");
            card.className = "order-card";
            let statusColor = order.status === "በመጠባበቅ ላይ" ? "#f39c12" : "#27ae60";
            let statusText = order.status ? order.status : "በመጠባበቅ ላይ";
            
            card.innerHTML = "<div style='display:flex; justify-content:space-between; align-items:center;'>" +
    "<strong>👤 " + order.name + "</strong>" +
    "<span style='color:" + statusColor + "; font-weight:bold; font-size:12px;'>● " + statusText + "</span>" +
    "</div>" +
    "<p>📞 " + order.phone + "</p>" +
    "<p>📦 " + order.item + "</p>" +
    "<div style='display:flex; justify-content:space-between; align-items:center;'>" +
    "<small style='color:#999'>⏰ " + (order.time || '---') + "</small>" +
    (statusText === "በመጠባበቅ ላይ" ? "<button onclick=\"window.changeStatus('" + id + "')\" style='width:auto; padding:5px 10px; font-size:11px; background:#007bff; color:white; border:none; border-radius:5px; cursor:pointer;'>ጨርሻለሁ</button>" : "") +
    "</div>";
            
            orderContainer.appendChild(card);
        });
    }
});

window.changeStatus = (id) => {
    update(ref(db, 'orders/' + id), { status: "ተጠናቋል" });
};// መስመር 70 ላይ ይሄንን ፔስት አድርግ

// 1. ካርታውን ማስጀመር (አዲስ አበባ ላይ)
var map = L.map('map').setView([9.0192, 38.7525], 13);

// 2. የካርታ ምስሎችን (Tiles) መጫን
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// 3. የሰራተኛውን ምልክት (Marker) ማዘጋጀት
var marker = L.marker([9.0192, 38.7525]).addTo(map)
    .bindPopup('የደሊቨሪ ሰራተኛው እዚህ ነው')
    .openPopup();

// 4. የሰራተኛውን ቦታ በየጊዜው መከታተል (GPS)
if (navigator.geolocation) {
    navigator.geolocation.watchPosition(function(position) {
        var lat = position.coords.latitude;
        var lng = position.coords.longitude;

        // ምልክቱን ካርታው ላይ ማንቀሳቀስ
        var newLatLng = new L.LatLng(lat, lng);
        marker.setLatLng(newLatLng);
        
        // ካርታው ራሱን እንዲያስተካክል
        map.invalidateSize();

        // 5. ቦታውን ወደ Firebase መላክ
        const locationRef = ref(db, 'delivery_live/driver1');
        update(locationRef, {
            lat: lat,
            lng: lng,
            timestamp: new Date().getTime()
        });
    }, function(error) {
        console.error("GPS Error: " + error.message);
    }, {
        enableHighAccuracy: true,
        maximumAge: 0
    });
}

// ካርታው ነጭ ሆኖ እንዳይቀር በየግማሽ ሰከንዱ እንዲነቃ ማድረግ
setTimeout(function(){ 
    map.invalidateSize(); 
}, 500);

