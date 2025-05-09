// ==== Lấy và lưu sản phẩm từ LocalStorage ====
function getProducts() {
    let products = JSON.parse(localStorage.getItem("products"));
    if (!products) {
        products = [];
        localStorage.setItem("products", JSON.stringify(products));  // Tạo dữ liệu mặc định nếu không có
    }
    return products;
}

function saveProducts(products) {
    localStorage.setItem("products", JSON.stringify(products));
}

// ==== Hiển thị sản phẩm ====
function displayProducts(products) {
    const productList = document.getElementById("productList");
    productList.innerHTML = '';

    if (products.length === 0) {
        productList.innerHTML = '<p class="text-muted">Chưa có sản phẩm nào.</p>';
        return;
    }

    products.forEach((product) => {
        const productCard = `
            <div class="col">
                <div class="card">
                    <img src="${product.hinhanh}" class="card-img-top" alt="${product.ten}">
                    <div class="card-body">
                        <h5 class="card-title">${product.ten}</h5>
                        <p class="card-text">${product.mota}</p>
                        <p class="card-text"><strong>Giá: </strong>${product.gia} VND</p>
                        <p class="card-text"><small class="text-muted">Thêm lúc: ${product.createdAt}</small></p>
                        <button class="btn btn-sm btn-warning" onclick="editProduct(${product.id})">✏️ Sửa</button>
                        <button class="btn btn-sm btn-danger" onclick="deleteProduct(${product.id})">🗑️ Xóa</button>
                        <button class="btn btn-sm btn-primary" onclick="addToCart(${product.id})">🛒 Thêm vào giỏ hàng</button>
                    </div>
                </div>
            </div>
        `;
        productList.innerHTML += productCard;
    });
}

// ==== Thêm hoặc cập nhật sản phẩm ====
document.getElementById("productForm").addEventListener("submit", function (event) {
    event.preventDefault();

    const ten = document.getElementById("ten").value;
    const mota = document.getElementById("mota").value;
    const gia = parseFloat(document.getElementById("gia").value);
    const hinhanh = document.getElementById("hinhanh").value;
    const productId = parseInt(document.getElementById("productId").value);

    let products = getProducts();

    if (productId) {
        const index = products.findIndex(p => p.id === productId);
        if (index !== -1) {
            products[index] = {
                id: productId,
                ten,
                mota,
                gia,
                hinhanh,
                createdAt: products[index].createdAt  // Duy trì thời gian tạo ban đầu
            };
        }
    } else {
        const newProduct = {
            id: products.length ? Math.max(...products.map(p => p.id)) + 1 : 1,
            ten,
            mota,
            gia,
            hinhanh,
            createdAt: new Date().toLocaleString()  // Thời gian tạo sản phẩm
        };
        products.push(newProduct);
    }

    saveProducts(products);
    displayProducts(products);  // Cập nhật danh sách sản phẩm hiển thị
    document.getElementById("productForm").reset();
    document.getElementById("productId").value = '';  // Reset trường ID
});

// ==== Sửa & Xóa sản phẩm ====
function editProduct(id) {
    const product = getProducts().find(p => p.id === id);
    if (product) {
        document.getElementById("ten").value = product.ten;
        document.getElementById("mota").value = product.mota;
        document.getElementById("gia").value = product.gia;
        document.getElementById("hinhanh").value = product.hinhanh;
        document.getElementById("productId").value = product.id;
    }
}

function deleteProduct(id) {
    let products = getProducts().filter(p => p.id !== id);
    saveProducts(products);
    displayProducts(products);
}

// ==== Tìm kiếm / lọc sản phẩm ====
function applyFilters(event) {
    event.preventDefault();

    const searchInput = document.getElementById("searchInput").value.toLowerCase();
    const minPrice = parseFloat(document.getElementById("minPrice").value) || 0;
    const maxPrice = parseFloat(document.getElementById("maxPrice").value) || Infinity;

    const filtered = getProducts().filter(product =>
        product.ten.toLowerCase().includes(searchInput) &&
        product.gia >= minPrice && product.gia <= maxPrice
    );

    displayProducts(filtered);
}

// ==== Thêm vào giỏ hàng với modal số lượng ====
let selectedProductId = null;

function addToCart(id) {
    const product = getProducts().find(p => p.id === id);
    if (!product) return;

    selectedProductId = id;

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existing = cart.find(p => p.id === id);

    const quantityInput = document.getElementById("quantityInput");
    const saveBtn = document.getElementById("saveQuantityButton");
    const quantityModal = new bootstrap.Modal(document.getElementById('quantityModal'));

    quantityInput.value = existing ? existing.quantity : 1;

    saveBtn.onclick = function () {
        const quantity = parseInt(quantityInput.value);
        if (quantity < 1) return;

        if (existing) {
            existing.quantity = quantity;
        } else {
            cart.push({ ...product, quantity });
        }

        localStorage.setItem("cart", JSON.stringify(cart));
        quantityModal.hide();
        alert("Đã thêm vào giỏ hàng!");
    };

    quantityModal.show();
}

// ==== Hiển thị giỏ hàng ====
function displayCart() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const cartList = document.getElementById("cartList");
    if (!cartList) return;

    cartList.innerHTML = '';

    if (cart.length === 0) {
        cartList.innerHTML = '<p class="text-muted">Giỏ hàng trống.</p>';
        return;
    }

    cart.forEach(item => {
        const cartItem = `
            <div class="cart-item">
                <img src="${item.hinhanh}" alt="${item.ten}" class="cart-item-img">
                <div class="cart-item-info">
                    <h5>${item.ten}</h5>
                    <p>Giá: ${item.gia} VND</p>
                    <p>Số lượng: ${item.quantity}</p>
                    <button class="btn btn-sm btn-warning" onclick="editCartQuantity(${item.id})">Sửa số lượng</button>
                    <button class="btn btn-sm btn-danger" onclick="removeFromCart(${item.id})">Xóa</button>
                </div>
            </div>
        `;
        cartList.innerHTML += cartItem;
    });
}

function editCartQuantity(id) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const item = cart.find(p => p.id === id);
    if (!item) return;

    const quantityInput = document.getElementById("quantityInput");
    quantityInput.value = item.quantity;

    const saveBtn = document.getElementById("saveQuantityButton");
    const quantityModal = new bootstrap.Modal(document.getElementById('quantityModal'));

    saveBtn.onclick = function () {
        const quantity = parseInt(quantityInput.value);
        if (quantity > 0) {
            item.quantity = quantity;
            localStorage.setItem("cart", JSON.stringify(cart));
            quantityModal.hide();
            displayCart();
        }
    };

    quantityModal.show();
}

function removeFromCart(id) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart = cart.filter(p => p.id !== id);
    localStorage.setItem("cart", JSON.stringify(cart));
    displayCart();
}

// ==== Khi trang tải ====
document.addEventListener("DOMContentLoaded", function () {
    displayProducts(getProducts());
    displayCart();
});
