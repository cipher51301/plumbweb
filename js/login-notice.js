/* ================================================================
   js/login-notice.js｜自訂提示視窗
   原理：不呼叫瀏覽器原生 alert，而是用 document.createElement 建立遮罩和按鈕。
   textContent：將商品名稱當作純文字，避免被解析成 HTML。
   role/aria-*：提供輔助科技可理解的提示視窗資訊。
   Esc/Tab：Esc 可以關閉；Tab 將焦點保留在確認按鈕。
   close()：刪除提示 DOM，並將鍵盤焦點還給原本的元素。
   .site-login-notice-* 的樣式寫在 css/style.css，背景為白色。
      ================================================================ */

/* 胖肉多：跨頁面共用登入展示提示，無登入驗證或資料傳送 */
(function () {
    'use strict';
    window.showSiteNotice = function (message) {
        // 避免重複開啟；舊提示不與新提示疊在一起。
        const existing = document.getElementById('siteLoginNotice');
        if (existing) return;

        const overlay = document.createElement('div');
        overlay.id = 'siteLoginNotice';
        overlay.className = 'site-login-notice-overlay';
        const panel = document.createElement('div');
        panel.className = 'site-login-notice-box';
        panel.setAttribute('role', 'alertdialog');
        panel.setAttribute('aria-modal', 'true');
        panel.setAttribute('aria-labelledby', 'siteLoginNoticeMessage');

        const text = document.createElement('div');
        text.id = 'siteLoginNoticeMessage';
        text.className = 'site-login-notice-message';
        text.textContent = message || '此視窗僅供展示使用，\n尚未連接實際登入功能。';
        const confirm = document.createElement('button');
        confirm.type = 'button';
        confirm.className = 'site-login-notice-confirm';
        confirm.textContent = '確定';
        panel.append(text, confirm);
        overlay.appendChild(panel);

        const previousFocus = document.activeElement;
        function close() {
            document.removeEventListener('keydown', handleKey, true);
            overlay.remove();
            if (previousFocus && previousFocus.isConnected && typeof previousFocus.focus === 'function') {
                previousFocus.focus();
            }
        }
        function handleKey(event) {
            if (event.key === 'Escape') {
                event.preventDefault();
                event.stopImmediatePropagation();
                close();
            } else if (event.key === 'Tab') {
                // 視窗唯一的互動控制是「確定」，避免焦點跑到背景頁面。
                event.preventDefault();
                confirm.focus();
            }
        }
        confirm.addEventListener('click', close);
        document.addEventListener('keydown', handleKey, true);
        document.body.appendChild(overlay);
        confirm.focus();
    };
    // 向下相容：保留所有頁面既有的登入呼叫介面。
    window.showLoginNotice = window.showSiteNotice;
}());
