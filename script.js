/* script.js
   - menyimpan data produk
   - menampilkan produk di index
   - fungsi detail produk (product.html)
   - keranjang (localStorage)
   - cart page & checkout
*/

const PRODUCTS = [
  {id:1,name:"Sepatu Adizero Adios Pro4",price:4000000,desc:"SEPATU RUNNING JARAK JAUH RINGAN YANG DIDESAIN UNTUK MEMECAHKAN REKOR",img:"https://www.tradeinn.com/f/14219/142195778/adidas-adizero-adios-pro-4-running-shoes.webp"},
  {id:2,name:"Sepatu Adizero Boston 13",price:2500000,desc:"Sepatu running ringan untuk latihan kecepatan dan persiapan kompetisi",img:"https://static.runnea.co.uk/images/202502/adidas-adizero-boston-13-running-shoes-400x400x90xX.jpg?1"},
  {id:3,name:"Sepatu Nike Alphafly 3",price:4089000,desc:"Alphafly membantu semua atlet mendobrak batasan dalam maraton, berapa pun kecepatannya.",img:"https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/a1919d1d-3bd8-47ae-9f83-2928dab2245c/AIR+ZOOM+ALPHAFLY+NEXT%25+3.png"},
  {id:4,name:"Sepatu HOKA Mach X2",price:3299000,desc:"dirancang untuk pelari yang mencari sepatu super trainer berlapis untuk sesi latihan intensitas tinggi mereka.",img:"https://dms.deckers.com/hoka/image/upload/f_auto,q_auto,dpr_auto/b_rgb:f7f7f9/w_966/v1738637562/1155119-GFRT_1.png?_s=RAABAB0"},
  {id:5,name:"Sepatu HYPERSONIC 2.0",price:1599000,desc:"sepatu lari lokal inovatif dengan teknologi plat karbon penuh, dirancang untuk performa maksimal dalam mode latihan dan balapan (training-racing)",img:"https://ortuseightdev.id/image-web-commerce/productimg/11040160_HYPERSONIC_2_0_-_CYAN_AQUAArtboard_1.jpg"},
  {id:6,name:"SPECS ATMOZPHYR",price:549800,desc:"teman sempurna Anda untuk berlari sehari-hari, memadukan kenyamanan dan stabilitas dengan seimbang.",img:"https://www.specs.id/media/catalog/product/s/p/spe1040086_1.jpg?optimize=high&bg-color=255,255,255&fit=bounds&height=1683&width=1683&canvas=1683:1683"},
  {id:7,name:"MILLS ENERPRO ZENITH ",price:899000,desc:"Didesain dengan stabilitas dan sirkulasi yang baik untuk mendukung pelari competitive yang ingin menaikan performa dalam melahap long run dan race half marathon dan 10k.",img:"https://mills.co.id/cdn/shop/files/5519-enerpro_zenith-06.png?v=1752489013&width=990"},
  {id:8,name:"HYPERBLAST ENCORE",price:599000,desc:"cocok untuk pemula, lari santai, atau lari pemulihan karena menawarkan kenyamanan tinggi dengan material midsole Cumulus Foam dan teknologi OrtShox",img:"https://ortuseightdev.id/image-web-commerce/productimg/11040158_HYPERBLAST_ENCORE_-_CYAN_CAMOArtboard_1.jpg"},
  {id:9,name:"HOKA Rocket X 2",price:4499000,desc:"Hoka memberikan midsole foam PEBA dual density yang ultra responsif, dipadukan bersama pelat serat karbon.",img:"https://dms.deckers.com/hoka/image/upload/f_auto,q_auto,dpr_auto/b_rgb:f7f7f9/w_966/v1737999447/1127927-YZC_1.png?_s=RAABAB0"},
  {id:10,name:"AURORUN STRIDE SE BALI",price:799900,desc:"untuk kebutuhan Daily Running.",img:"https://910.id/cdn/shop/files/1_e35df5b7-6536-41f8-9732-1cb6071284a4.png?v=1754625300&width=1946"}
];

const CART_KEY = 'tokosepatu_cart_v1';

function getCart(){
  const raw = localStorage.getItem(CART_KEY);
  return raw ? JSON.parse(raw) : {};
}
function saveCart(cart){
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartCountUI();
}
function updateCartCountUI(){
  const cart = getCart();
  const count = Object.values(cart).reduce((s, item)=> s + item.qty, 0);
  document.querySelectorAll('#cart-count').forEach(el => el.textContent = count);
}

/* --- Index: tampilkan grid produk --- */
function renderProductsGrid(){
  const grid = document.getElementById('products-grid');
  if(!grid) return;
  grid.innerHTML = '';
  PRODUCTS.forEach(p => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <img src="${p.img}" alt="${p.name}" />
      <h4>${p.name}</h4>
      <div class="price">Rp ${numberWithDots(p.price)}</div>
      <p class="muted">${p.desc}</p>
      <div class="actions">
        <a class="btn secondary" href="product.html?id=${p.id}">Lihat</a>
        <button class="btn" data-id="${p.id}">Tambah Keranjang</button>
      </div>
    `;
    grid.appendChild(card);
  });

  grid.addEventListener('click', (e) => {
    if(e.target.matches('button[data-id]')){
      const id = Number(e.target.dataset.id);
      addToCart(id,1);
      flashNotice('Produk ditambahkan ke keranjang');
    }
  });
}

/* --- Tambah ke keranjang --- */
function addToCart(id, qty=1){
  const cart = getCart();
  const key = String(id);
  if(cart[key]) cart[key].qty += qty;
  else {
    const prod = PRODUCTS.find(p => p.id === id);
    cart[key] = {id:prod.id, name:prod.name, price:prod.price, img:prod.img, qty:qty};
  }
  saveCart(cart);
}

/* --- Utility --- */
function numberWithDots(x){
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function flashNotice(msg){
  const n = document.createElement('div');
  n.className = 'notice';
  n.textContent = msg;
  document.body.appendChild(n);
  setTimeout(()=> n.remove(), 2000);
}

/* --- Product detail page --- */
function loadProductDetailFromQuery(){
  const params = new URLSearchParams(location.search);
  const id = Number(params.get('id') || 0);
  if(!id) {
    document.getElementById('product-detail').innerHTML = '<p>Produk tidak ditemukan. Kembali ke <a href="index.html">Home</a>.</p>';
    return;
  }
  const p = PRODUCTS.find(x=>x.id===id);
  if(!p){
    document.getElementById('product-detail').innerHTML = '<p>Produk tidak ditemukan.</p>'; return;
  }
  const container = document.getElementById('product-detail');
  container.innerHTML = `
    <div>
      <img src="${p.img}" alt="${p.name}" />
    </div>
    <div>
      <h2>${p.name}</h2>
      <p class="price">Rp ${numberWithDots(p.price)}</p>
      <p>${p.desc}</p>
      <div class="qty-control" style="margin:12px 0">
        <label>Jumlah: </label>
        <button id="dec">-</button>
        <input id="qty" type="number" value="1" min="1" style="width:60px;padding:6px;border-radius:6px;border:1px solid #ddd;margin:0 8px" />
        <button id="inc">+</button>
      </div>
      <div style="display:flex;gap:8px">
        <button id="add-cart" class="btn">Tambah ke Keranjang</button>
        <a class="btn secondary" href="cart.html">Lihat Keranjang</a>
      </div>
    </div>
  `;

  const dec = document.getElementById('dec');
  const inc = document.getElementById('inc');
  const qtyInput = document.getElementById('qty');
  dec.addEventListener('click', ()=> { if(Number(qtyInput.value)>1) qtyInput.value = Number(qtyInput.value)-1; });
  inc.addEventListener('click', ()=> qtyInput.value = Number(qtyInput.value)+1);

  document.getElementById('add-cart').addEventListener('click', ()=>{
    const qty = Math.max(1, Number(qtyInput.value));
    addToCart(p.id, qty);
    flashNotice('Produk ditambahkan ke keranjang');
  });
}

/* --- Halaman keranjang --- */
function loadCartPage(){
  const container = document.getElementById('cart-items');
  if(!container) return;
  renderCartItems();

  const form = document.getElementById('checkout-form');
  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const address = document.getElementById('address').value.trim();
    const payment = document.getElementById('payment').value;
    const cart = getCart();
    if(Object.keys(cart).length===0){
      alert('Keranjang kosong.');
      return;
    }
    // Sederhana: tampilkan ringkasan dan clear cart
    const order = {
      buyer:{name,email,address,payment},
      items:cart,
      subtotal:calcSubtotal(),
      shipping:0,
      total: calcSubtotal()
    };
    // simulasi checkout sukses
    localStorage.removeItem(CART_KEY);
    updateCartCountUI();
    renderCartItems();
    document.getElementById('checkout-message').innerText = `Terima kasih ${order.buyer.name}! Pesanan Anda berhasil. Total: Rp ${numberWithDots(order.total)}. Metode: ${order.buyer.payment}`;
    form.reset();
  });
}

function renderCartItems(){
  const container = document.getElementById('cart-items');
  const cart = getCart();
  container.innerHTML = '';
  const keys = Object.keys(cart);
  if(keys.length===0){
    container.innerHTML = '<p>Keranjang kosong. Kembali ke <a href="index.html">Home</a>.</p>';
    updateTotalsUI();
    return;
  }
  keys.forEach(k=>{
    const it = cart[k];
    const row = document.createElement('div');
    row.className = 'cart-row';
    row.innerHTML = `
      <img src="${it.img}" alt="${it.name}" />
      <div style="flex:1">
        <h4 style="margin:0">${it.name}</h4>
        <div>Rp ${numberWithDots(it.price)}</div>
        <div style="margin-top:8px" class="qty-control">
          <button class="dec" data-id="${it.id}">-</button>
          <input type="number" min="1" value="${it.qty}" data-id="${it.id}" style="width:60px;padding:6px;border-radius:6px;border:1px solid #ddd" />
          <button class="inc" data-id="${it.id}">+</button>
        </div>
      </div>
      <div style="text-align:right">
        <div>Rp <span class="line-total">${numberWithDots(it.price * it.qty)}</span></div>
        <button class="btn" data-remove="${it.id}" style="margin-top:10px;background:#ff6b6b">Hapus</button>
      </div>
    `;
    container.appendChild(row);
  });

  // events
  container.querySelectorAll('.dec').forEach(b=>{
    b.addEventListener('click', ()=> {
      const id = String(b.dataset.id);
      const cart = getCart();
      if(cart[id] && cart[id].qty>1){ cart[id].qty--; saveCart(cart); renderCartItems(); }
    });
  });
  container.querySelectorAll('.inc').forEach(b=>{
    b.addEventListener('click', ()=> {
      const id = String(b.dataset.id);
      const cart = getCart(); if(cart[id]){ cart[id].qty++; saveCart(cart); renderCartItems(); }
    });
  });
  container.querySelectorAll('input[type="number"]').forEach(inp=>{
    inp.addEventListener('change', ()=>{
      const id = String(inp.dataset.id);
      let v = Math.max(1, Number(inp.value) || 1);
      const cart = getCart(); if(cart[id]){ cart[id].qty = v; saveCart(cart); renderCartItems(); }
    });
  });
  container.querySelectorAll('[data-remove]').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const id = String(btn.dataset.remove);
      const cart = getCart(); delete cart[id]; saveCart(cart); renderCartItems();
    });
  });

  updateTotalsUI();
}

function calcSubtotal(){
  const cart = getCart();
  return Object.values(cart).reduce((s,it)=> s + it.price * it.qty, 0);
}

function updateTotalsUI(){
  const subtotal = calcSubtotal();
  const shipping = subtotal > 0 ? 0 : 0;
  const total = subtotal + shipping;
  const elSub = document.getElementById('subtotal');
  const elShip = document.getElementById('shipping');
  const elTotal = document.getElementById('total');
  if(elSub) elSub.textContent = numberWithDots(subtotal);
  if(elShip) elShip.textContent = numberWithDots(shipping);
  if(elTotal) elTotal.textContent = numberWithDots(total);
  updateCartCountUI();
}

/* --- Inisialisasi umum --- */
document.addEventListener('DOMContentLoaded', ()=>{
  updateCartCountUI();
  renderProductsGrid();
});
