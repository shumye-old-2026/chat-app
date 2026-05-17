 import { ref, push, onValue, remove, update } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";
import { database } from "./firebase_config.js";

// 1. Initialize Map at Addis Ababa
const map = L.map("map").setView([9.0192, 38.7525], 13);

setTimeout(function () {
  map.invalidateSize();
}, 200);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "&copy; OpenStreetMap contributors"
}).addTo(map);

// Create Draggable Marker
const marker = L.marker([9.0192, 38.7525], { draggable: true }).addTo(map);

// Tracking marker location live
let currentPosition = marker.getLatLng();
marker.on("dragend", function () {
  currentPosition = marker.getLatLng();
});

// 2. Send Order to Firebase (Client Side)
const sendBtn = document.getElementById("sendBtn");
if (sendBtn) {
  sendBtn.onclick = function () {
    const customerName = document.getElementById("customerName")?.value;
    const phone = document.getElementById("phone")?.value;
    const itemType = document.getElementById("itemType")?.value;
    const deliveryArea = document.getElementById("deliveryArea")?.value;

    if (!customerName ||  !phone || !itemType || !deliveryArea) {
      alert("እባክዎ ሁሉንም ሳጥኖች በትክክል ይሙሉ!");
      return;
    }

    const orderData = {
      name: customerName,
      phone: phone,
      item: itemType,
      area: deliveryArea,
      price: "ሻጩ አልወሰነም",
      latitude: currentPosition.lat,
      longitude: currentPosition.lng,
      timestamp: new Date().toISOString()
    };

    const ordersRef = ref(database, "orders");
    push(ordersRef, orderData)
      .then(function () {
        alert("🎉 ትዕዛዝዎ በተሳካ ሁኔታ ተልኳል! ሻጩ ዋጋውን አይቶ ይደውልልዎ.");
        document.getElementById("customerName").value = "";
        document.getElementById("phone").value = "";
        document.getElementById("itemType").value = "";
        document.getElementById("deliveryArea").value = "";
      })
      .catch(function (error) {
        alert("❌ ስህተት: " + error.message);
      });
  };
}

// 3. Admin View: Display Orders (የካርዶቹን ጽሑፍ አሰላለፍ ከግራ ወደ ቀኝ የሚያደርግ)
const ordersListRef = ref(database, "orders");
onValue(ordersListRef, function (snapshot) {
  let ordersContainer = document.getElementById("ordersContainer");
  
  if (!ordersContainer) {
    const h3Elements = document.querySelectorAll("h3");
    let targetH3;
    h3Elements.forEach(function (h3) {
      if (h3.textContent.includes("የተላኩ")) {
        targetH3 = h3;
      }
    });
    
    if (targetH3) {
      ordersContainer = document.createElement("div");
      ordersContainer.id = "ordersContainer";
      ordersContainer.style.padding = "10px";
      targetH3.parentNode.insertBefore(ordersContainer, targetH3.nextSibling);
    }
  }

  if (ordersContainer) {
    ordersContainer.innerHTML = ""; 

    if (snapshot.exists()) {
      const data = snapshot.val();
      Object.keys(data).reverse().forEach(function (key) {
        const order = data[key];
        
        // ዋናው ካርድ ሳጥን
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
        
        // ጽሑፎቹና አይኮኖቹ በሙሉ በግራ በኩል እንዲሰለፉ የሚያዝዝ ክፍል
        orderCard.style.textAlign = "left"; 
        orderCard.style.direction = "ltr";

        // የውስጥ መረጃ ዝርዝሮች (ከግራ ወደ ቀኝ የተደረደሩ)
        const nameDiv = document.createElement("div");
        nameDiv.innerHTML = "👤 <strong>ደንበኛ:</strong> " + (order.name || "ያልተጠቀሰ");
        orderCard.appendChild(nameDiv);

        const phoneDiv = document.createElement("div");
        phoneDiv.innerHTML = "📞 <strong>ስልክ:</strong> " + (order.phone || "ያልተጠቀሰ");
        orderCard.appendChild(phoneDiv);
const itemDiv = document.createElement("div");
        itemDiv.innerHTML = "📦 <strong>የዕቃ ዓይነት:</strong> " + (order.item || "ያልተጠቀሰ");
        orderCard.appendChild(itemDiv);

        const areaDiv = document.createElement("div");
        areaDiv.innerHTML = "🏢 <strong>ማድረሻ ሰፈር:</strong> " + (order.area || "ያልተጠቀሰ");
        orderCard.appendChild(areaDiv);

        // የዋጋ ማሳያ ክፍል
        let priceColor = "#2e7d32";
        if (order.price && order.price.includes("አልወሰነም")) {
          priceColor = "#d32f2f";
        }
        const priceDiv = document.createElement("div");
        priceDiv.innerHTML = "💵 <strong>የዕቃ + ማድረሻ ዋጋ:</strong> <span style='color: " + priceColor + "; font-weight: bold;'>" + order.price + "</span>";
        orderCard.appendChild(priceDiv);

        // የካርታ መጋጠሚያ ክፍል
        const geoDiv = document.createElement("div");
        geoDiv.innerHTML = "📍 <strong>ካርታ መጋጠሚያ:</strong> <span style='color: #1976d2;'>ላቲ፡ " + parseFloat(order.latitude).toFixed(4) + " ፣ ሎንጊ፡ " + parseFloat(order.longitude).toFixed(4) + "</span>";
        orderCard.appendChild(geoDiv);
          
        // የዋጋ ማሳወቂያ ሜኑ ሳጥን (አሰላለፉ ከግራ ወደ ቀኝ የሆነ)
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
        priceInput.placeholder = "ዋጋ በብር ያስገቡ";
        priceInput.style.width = "65%";
        priceInput.style.padding = "8px";
        priceInput.style.fontSize = "13px";
        priceInput.style.border = "1px solid #ccc";
        priceInput.style.borderRadius = "4px";
        priceInput.style.textAlign = "left";

        const priceBtn = document.createElement("button");
        priceBtn.id = "btnPrice_" + key;
        priceBtn.innerHTML = "ዋጋ አሳውቅ";
        priceBtn.style.width = "35%";
        priceBtn.style.padding = "8px";
        priceBtn.style.backgroundColor = "#1976d2";
        priceBtn.style.color = "white";
        priceBtn.style.border = "none";
        priceBtn.style.borderRadius = "4px";
        priceBtn.style.fontWeight = "bold";
        priceBtn.style.cursor = "pointer";
        priceBtn.style.fontSize = "13px";
        priceBtn.style.margin = "0";

        priceSection.appendChild(priceInput);
        priceSection.appendChild(priceBtn);
        orderCard.appendChild(priceSection);

        // ማጥፊያ በተን (🗑️)
        const deleteBtn = document.createElement("button");
        deleteBtn.innerHTML = "እቃው ደርሷል (አጥፋ) 🗑️";
        deleteBtn.style.marginTop = "10px";
        deleteBtn.style.backgroundColor = "#d32f2f";
        deleteBtn.style.color = "white";
        deleteBtn.style.border = "none";
        deleteBtn.style.borderRadius = "6px";
        deleteBtn.style.padding = "10px 12px";
        deleteBtn.style.cursor = "pointer";
        deleteBtn.style.fontWeight = "bold";
        deleteBtn.style.width = "100%";
        
        deleteBtn.onclick = function () {
          if (confirm("ይህንን ትዕዛዝ ማጥፋት ይፈልጋሉ?")) {
            remove(ref(database, "orders/" + key));
          }
        };
        orderCard.appendChild(deleteBtn);
        ordersContainer.appendChild(orderCard);

        // "ዋጋ አሳውቅ" በተን ክሊክ ሲደረግ የሚሠራው
        setTimeout(function () {
          const savePriceBtn = document.getElementById("btnPrice_" + key);
          if (savePriceBtn) {
            savePriceBtn.onclick = function () {
              const enteredPrice = document.getElementById("inputPrice_" + key).value;
if (!enteredPrice) {
                alert("እባክዎ መጀመሪያ ዋጋ ያስገቡ!");
                return;
              }
              update(ref(database, "orders/" + key), { price: enteredPrice + " ብር" })
                .then(function () { 
                  alert("💵 ዋጋው በተሳካ ሁኔታ ተሻшሏል!"); 
                })
                .catch(function (err) { 
                  alert("ስህተት: " + err.message); 
                });
            };
          }
        }, 100);

      });
    } else {
      const noOrderP = document.createElement("p");
      noOrderP.style.color = "gray";
      noOrderP.style.padding = "15px";
      noOrderP.style.textAlign = "center";
      noOrderP.style.fontStyle = "italic";
      noOrderP.innerHTML = "እስካሁን የተላከ ምንም ትዕዛዝ የለም።";
      ordersContainer.appendChild(noOrderP);
    }
  }
});