// Daftar menu dengan kategori
const menuItems = [
  { name: "Kopi Hitam", price: 10000, img: "blcoffee.jpg", category: "Minuman" },
  { name: "Cappuccino", price: 15000, img: "cp.jpg", category: "Minuman" },
  { name: "Es Teh", price: 8000, img: "esteh.jpg", category: "Minuman" },
  { name: "Roti Bakar", price: 12000, img: "rotbak.jpg", category: "Makanan" },
  { name: "Mie Goreng", price: 18000, img: "migoreng.jpg", category: "Makanan" },
  { name: "Nasi Goreng", price: 20000, img: "nasgor.jpg", category: "Makanan" },
];

const menuList = document.getElementById("menuList");
const orderList = document.getElementById("orderList");
const historyList = document.getElementById("historyList");
const totalPriceEl = document.getElementById("totalPrice");

// Elemen Laporan Keuangan
const reportTypeEl = document.getElementById("reportType");
const reportDateEl = document.getElementById("reportDate");
const reportMonthEl = document.getElementById("reportMonth");
const generateReportBtn = document.getElementById("generateReportBtn");
const totalTransactionsEl = document.getElementById("totalTransactions");
const totalRevenueEl = document.getElementById("totalRevenue");

// ELEMEN BARU UNTUK TOTAL HARI INI & BULAN INI
const revenueTodayEl = document.getElementById("revenueToday");
const revenueThisMonthEl = document.getElementById("revenueThisMonth");


let order = [];
let history = []; 
let activeCategory = "all";

// Inisialisasi tanggal/bulan
reportDateEl.valueAsDate = new Date();
const today = new Date();
const todayDateString = today.toISOString().split('T')[0]; // YYYY-MM-DD hari ini
const thisMonthString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`; // YYYY-MM bulan ini

reportMonthEl.value = thisMonthString; // Set input bulan ke bulan ini

// Tampilkan menu (tetap sama)
function displayMenu(filterText = "", filterCategory = "all") {
  menuList.innerHTML = "";
  menuItems
    .filter(item => {
      const matchText = item.name.toLowerCase().includes(filterText.toLowerCase());
      const matchCategory = filterCategory === "all" || item.category === filterCategory;
      return matchText && matchCategory;
    })
    .forEach(item => {
      const card = document.createElement("div");
      card.className = "menu-card";
      card.innerHTML = `
        <img src="${item.img}" alt="${item.name}">
        <h3>${item.name}</h3>
        <p>Rp ${item.price.toLocaleString()}</p>
        <small>${item.category}</small>
        <button onclick="addToOrder('${item.name}')">Tambah</button>
      `;
      menuList.appendChild(card);
    });
}
displayMenu();

// Tambah pesanan (tetap sama)
function addToOrder(name) {
  const menu = menuItems.find(item => item.name === name);
  const existing = order.find(item => item.name === name);
  if (existing) {
    existing.qty++;
  } else {
    order.push({ ...menu, qty: 1 });
  }
  updateOrder();
}

// Update tampilan pesanan (tetap sama)
function updateOrder() {
  orderList.innerHTML = "";
  let total = 0;
  order.forEach(item => {
    total += item.price * item.qty;
    const li = document.createElement("li");
    li.innerHTML = `
      ${item.name} x ${item.qty} 
      <span>Rp ${(item.price * item.qty).toLocaleString()}</span>
    `;
    orderList.appendChild(li);
  });
  totalPriceEl.textContent = total.toLocaleString();
}

// Checkout (MEMANGGIL generateReport)
document.getElementById("checkoutBtn").addEventListener("click", () => {
  if (order.length === 0) return alert("Belum ada pesanan!");
  const total = order.reduce((acc, item) => acc + item.price * item.qty, 0);
  const date = new Date(); 
  const waktu = date.toLocaleString();
  const tanggalLengkap = date.toISOString().split('T')[0]; // Format YYYY-MM-DD
  const bulanTahun = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`; // Format YYYY-MM

  // 1. Simpan detail transaksi
  history.push({ 
    order: [...order], 
    total, 
    waktu, 
    tanggalLengkap,
    bulanTahun
  });

  // 2. Perbarui tampilan
  updateHistory();
  order = [];
  updateOrder();
  alert("Pesanan berhasil dicatat!");
  
  // 3. Perbarui Laporan Keuangan secara otomatis (termasuk total Hari Ini/Bulan Ini)
  generateReport(); 
});

// Hapus pesanan (tetap sama)
document.getElementById("clearOrderBtn").addEventListener("click", () => {
  order = [];
  updateOrder();
});

// Tampilkan riwayat (tetap sama)
function updateHistory() {
  historyList.innerHTML = "";
  history.forEach((transaksi, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <div>
        <strong>Transaksi ${index + 1}</strong> (${transaksi.waktu})<br>
        Total: Rp ${transaksi.total.toLocaleString()}
      </div>
    `;
    historyList.appendChild(li);
  });
}

// Pencarian menu (tetap sama)
document.getElementById("searchInput").addEventListener("input", (e) => {
  displayMenu(e.target.value, activeCategory);
});

// Filter kategori (tetap sama)
document.querySelectorAll(".category-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".category-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    activeCategory = btn.getAttribute("data-category");
    const searchText = document.getElementById("searchInput").value;
    displayMenu(searchText, activeCategory);
  });
});

// --- LOGIKA LAPORAN KEUANGAN MODIFIKASI ---

// Fungsi untuk mengganti input tanggal berdasarkan tipe laporan (tetap sama)
reportTypeEl.addEventListener("change", (e) => {
  if (e.target.value === "daily") {
    reportDateEl.style.display = "block";
    reportMonthEl.style.display = "none";
  } else {
    reportDateEl.style.display = "none";
    reportMonthEl.style.display = "block";
  }
});
reportTypeEl.dispatchEvent(new Event('change')); 


function generateReport() {
  // 1. HITUNG TOTAL HARI INI DAN BULAN INI (Selalu dilakukan)
  const revenueToday = history
    .filter(transaksi => transaksi.tanggalLengkap === todayDateString)
    .reduce((acc, transaksi) => acc + transaksi.total, 0);

  const revenueThisMonth = history
    .filter(transaksi => transaksi.bulanTahun === thisMonthString)
    .reduce((acc, transaksi) => acc + transaksi.total, 0);

  // Tampilkan hasilnya
  revenueTodayEl.textContent = revenueToday.toLocaleString();
  revenueThisMonthEl.textContent = revenueThisMonth.toLocaleString();


  // 2. HITUNG TOTAL BERDASARKAN FILTER YANG DIPILIH USER
  const reportType = reportTypeEl.value;
  let filteredHistory = [];

  if (reportType === "daily") {
    const selectedDate = reportDateEl.value; // YYYY-MM-DD
    filteredHistory = history.filter(transaksi => transaksi.tanggalLengkap === selectedDate);
  } else { // monthly
    const selectedMonth = reportMonthEl.value; // YYYY-MM
    filteredHistory = history.filter(transaksi => transaksi.bulanTahun === selectedMonth);
  }

  // Hitung total dari filter
  const totalTransactions = filteredHistory.length;
  const totalRevenue = filteredHistory.reduce((acc, transaksi) => acc + transaksi.total, 0);

  // Tampilkan hasil filter
  totalTransactionsEl.textContent = totalTransactions.toLocaleString();
  totalRevenueEl.textContent = totalRevenue.toLocaleString();
}

// Event listener untuk tombol laporan (jika user ingin melihat tanggal/bulan lain)
generateReportBtn.addEventListener("click", generateReport);

// Panggil generateReport saat load pertama kali
generateReport();