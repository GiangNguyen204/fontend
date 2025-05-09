// ==== Kiểm tra và chuyển chế độ sáng/tối ==== 
function toggleDarkMode() {
    // Lấy giá trị chế độ từ localStorage hoặc mặc định là 'light'
    let currentMode = localStorage.getItem('theme') || 'light';

    // Chuyển đổi giữa sáng và tối
    if (currentMode === 'light') {
        document.body.classList.add('dark-mode'); // Thêm lớp 'dark-mode' vào body
        localStorage.setItem('theme', 'dark');   // Lưu trạng thái 'dark' vào localStorage
    } else {
        document.body.classList.remove('dark-mode'); // Xóa lớp 'dark-mode'
        localStorage.setItem('theme', 'light');   // Lưu trạng thái 'light' vào localStorage
    }
    updateCartForDarkMode();
}

// ==== Cập nhật giao diện giỏ hàng khi chuyển chế độ sáng/tối ==== 
function updateCartForDarkMode() {
    const cartItemsContainer = document.getElementById("cartItems");
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    
    // Kiểm tra chế độ giao diện hiện tại
    let isDarkMode = document.body.classList.contains('dark-mode');

    // Cập nhật lại màu sắc cho giỏ hàng
    if (isDarkMode) {
        cartItemsContainer.style.backgroundColor = '#2c2c2c';  // Màu nền tối cho giỏ hàng
        cartItemsContainer.style.color = '#fff';  // Màu chữ sáng
    } else {
        cartItemsContainer.style.backgroundColor = '#fff';  // Màu nền sáng cho giỏ hàng
        cartItemsContainer.style.color = '#000';  // Màu chữ tối
    }
}

// ==== Hiển thị giỏ hàng ==== 
function displayCart() {
    const cartItemsContainer = document.getElementById("cartItems");
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    cartItemsContainer.innerHTML = "";  // Xóa giỏ hàng hiện tại

    cart.forEach((item, index) => {
        const col = document.createElement('div');
        col.className = 'col-md-4';

        const card = document.createElement('div');
        card.className = 'card h-100 shadow-sm';

        // Thêm chế độ tối vào các phần tử
        let isDarkMode = document.body.classList.contains('dark-mode');
        card.style.backgroundColor = isDarkMode ? '#444' : '#fff'; // Thêm màu nền tối/sáng cho card
        card.style.color = isDarkMode ? '#fff' : '#000';  // Thêm màu chữ tối/sáng cho card

        card.innerHTML = `
            <img src="${item.hinhanh}" class="card-img-top" alt="${item.ten}">
            <div class="card-body">
                <h5 class="card-title">${item.ten}</h5>
                <p class="card-text">${item.mota}</p>
                <p class="card-text"><strong>Giá:</strong> ${item.gia.toLocaleString()}₫</p>
                <p class="card-text"><strong>Số lượng:</strong> ${item.quantity}</p>
                <p class="card-text"><strong>Thành tiền:</strong> ${(item.gia * item.quantity).toLocaleString()}₫</p>
                <button class="btn btn-danger btn-sm" onclick="removeItem(${index})">Xóa</button>
            </div>
        `;

        col.appendChild(card);
        cartItemsContainer.appendChild(col);
    });
}

// ==== Tính tổng giá trị giỏ hàng ==== 
function calculateCartTotal() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let total = 0;

    cart.forEach(item => {
        total += item.gia * item.quantity; // Tính tổng tiền dựa trên số lượng và giá
    });

    return total;
}

// ==== Hiển thị tổng giá trị giỏ hàng ==== 
function displayCartTotal() {
    const totalElement = document.getElementById("cartTotal");
    totalElement.innerText = `Tổng giá trị: ${calculateCartTotal().toLocaleString()} VND`;
}

// ==== Xóa sản phẩm khỏi giỏ hàng ==== 
function removeItem(index) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.splice(index, 1); // Xóa sản phẩm theo chỉ mục
    localStorage.setItem("cart", JSON.stringify(cart)); // Lưu lại giỏ hàng vào localStorage
    displayCart(); // Cập nhật giỏ hàng sau khi xóa
    displayCartTotal(); // Cập nhật lại tổng giá trị giỏ hàng
}

// Cập nhật giỏ hàng và tính tổng khi trang tải
document.addEventListener("DOMContentLoaded", function() {
    displayCart();
    displayCartTotal();  // Hiển thị tổng giá trị
    updateCartForDarkMode(); // Cập nhật giao diện cho chế độ sáng/tối

    // Đảm bảo chế độ sáng/tối được áp dụng khi trang tải
    const currentMode = localStorage.getItem('theme') || 'light';
    if (currentMode === 'dark') {
        document.body.classList.add('dark-mode');
    }
});
