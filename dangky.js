// Gắn sự kiện submit cho form đăng ký
document.getElementById('registerForm').addEventListener('submit', async function (e) {
    e.preventDefault(); // Ngăn hành vi mặc định của form (tải lại trang)

    // Lấy giá trị người dùng nhập vào và loại bỏ khoảng trắng đầu/cuối
    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    // Kiểm tra nếu người dùng bỏ trống bất kỳ trường nào
    if (!username || !email || !password) {
        showAlert('Vui lòng nhập đầy đủ thông tin.', 'danger'); // Hiển thị cảnh báo
        return;
    }

    // Kiểm tra độ dài tối thiểu của mật khẩu
    if (password.length < 8) {
        showAlert('Mật khẩu phải có ít nhất 8 ký tự.', 'warning');
        return;
    }

    // Tạo đối tượng người dùng mới
    const newUser = {
        username: username,
        email: email,
        password: password,
        createdAt: new Date().toISOString() // Lưu lại thời điểm tạo tài khoản
    };

    try {
        // Gửi yêu cầu POST đến mock API để tạo tài khoản mới
        const response = await fetch('https://68188bb35a4b07b9d1cfa832.mockapi.io/login', { // ← Thay đổi URL nếu cần
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newUser) // Chuyển đối tượng người dùng thành JSON
        });

        // Kiểm tra nếu đăng ký thành công
        if (response.ok) {
            showAlert('Đăng ký thành công!', 'success'); // Thông báo thành công
            document.getElementById('registerForm').reset(); // Xóa dữ liệu trong form
            window.location.href = "dangnhap.html"; // Chuyển hướng đến trang đăng nhập
        } else {
            showAlert('Đăng ký thất bại. Vui lòng thử lại.', 'danger'); // Hiển thị lỗi nếu thất bại
        }
    } catch (error) {
        console.error('Lỗi khi gửi dữ liệu:', error); // In lỗi ra console
        showAlert('Có lỗi xảy ra khi gửi dữ liệu.', 'danger'); // Hiển thị lỗi kết nối
    }
});

// Hàm hiển thị thông báo (dạng alert Bootstrap)
function showAlert(message, type) {
    const alertBox = document.getElementById('alert-box');
    alertBox.innerHTML = `
        <div class="alert alert-${type}" role="alert">
            ${message}
        </div>
    `;
    setTimeout(() => alertBox.innerHTML = '', 3000); // Tự động ẩn sau 3 giây
}
