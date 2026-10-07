// 每次頁面載入完成時自動執行，更新右上角購物車數量
document.addEventListener("DOMContentLoaded", function() {
    updateCartIconCount();
});

// 統一更新右上角購物車數字的函式
function updateCartIconCount() {
    let cart = JSON.parse(localStorage.getItem('shoppingCart')) || [];
    let totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    // 尋找導覽列上的購物車元素 (確認 id="navCartCount" 或 class="cart-btn")
    const cartNavBtn = document.getElementById('navCartCount') || document.querySelector('.cart-btn');
    if (cartNavBtn) {
        cartNavBtn.innerText = `🛒 (${totalCount})`;
    }
}