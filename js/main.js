// js/main.js

/**
 * 統一更新右上角購物車數字
 */
function updateCartIconCount() {
    try {
        let cart = JSON.parse(localStorage.getItem('shoppingCart')) || [];
        let totalCount = cart.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);
        
        const cartNavBtn = document.getElementById('navCartCount');
        if (cartNavBtn) {
            cartNavBtn.innerText = `🛒 (${totalCount})`;
        }
    } catch (e) {
        console.error("更新購物車數量失敗:", e);
    }
}

// 頁面載入完成後自動更新購物車數量
document.addEventListener('DOMContentLoaded', function() {
    updateCartIconCount();
});