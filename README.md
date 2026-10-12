# plumbweb

正確的網站目錄
plumbweb/
├── index.html
├── Journal.html
├── journal-detail.html
├── Knowledge.html
├── knowledge-detail.html
├── Shop.html
├── products.html
├── product-detail.html
├── BrandStory.html
├── ContactUs.html
├── cart.html
├── checkout.html
├── maintenance.html
├── css/
│   └── style.css
└── js/
    ├── main.js
    └── login-notice.js

說明：三種檔案各司其職
HTML : 決定畫面有哪些區塊、文字和按鈕；`id` 供 JavaScript 查找元素。
CSS : 決定尺寸、顏色、位置、手機版排版；`@media` 根據畫面尺寸套用條件樣式。
JavaScript : 控制導覽選單、提示視窗、加入購物車、Excel 讀取和文章切換。
localStorage : 僅儲存在瀏覽器，並非真正的後端會員/付款系統。
`./maintenance.html` : 是相對路徑：在 GitHub Pages 專案子路徑 `/plumbweb/` 中可正確連往該專案的施工中頁面。
