// Gắn sự kiện khi form đăng nhập được submit
document.getElementById("loginForm").addEventListener("submit", async function (e) {
    e.preventDefault(); // Ngăn form tải lại trang

    // Lấy dữ liệu người dùng nhập và loại bỏ khoảng trắng (nếu có)
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const alertBox = document.getElementById("alert-box"); // Thẻ hiển thị thông báo

    try {
        // Gọi API để lấy danh sách người dùng đã đăng ký
        const response = await fetch("https://68188bb35a4b07b9d1cfa832.mockapi.io/login");
        const users = await response.json();

        // Tìm người dùng trùng khớp email và mật khẩu
        const foundUser = users.find(user => user.email === email && user.password === password);

        if (foundUser) {
            // Nếu tìm thấy -> đăng nhập thành công
            alert("Đăng nhập thành công!");

            // Lưu thông tin người dùng vào localStorage
            localStorage.setItem("loggedInUser", JSON.stringify(foundUser));

            // Chuyển hướng sang trang sản phẩm
            window.location.href = "sanpham.html";
        } else {
            // Không tìm thấy -> thông báo sai email/mật khẩu
            alertBox.innerHTML = `<div class="alert alert-danger">Email hoặc mật khẩu không đúng!</div>`;
        }

    } catch (error) {
        // Nếu có lỗi khi gọi API
        console.error("Lỗi khi gọi API:", error);
        alertBox.innerHTML = `<div class="alert alert-danger">Không thể kết nối đến máy chủ!</div>`;
    }
});
