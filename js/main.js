/* 胖肉多的種植雜記｜首頁互動功能
 * 此網站為 GitHub Pages 靜態網站；登入功能目前僅供介面展示。
 */
(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', function () {
        const navMenu = document.getElementById('navMenu');
        const menuToggle = document.getElementById('menuToggle');
        const loginModal = document.getElementById('loginModal');
        const closeModalBtn = document.getElementById('closeModalBtn');
        const loginForm = document.getElementById('loginForm');

        // 1. 購物車數量：與其他頁面共用 localStorage 的 shoppingCart 格式。
        function updateCartIconCount() {
            const cartNavBtn = document.getElementById('navCartCount');
            if (!cartNavBtn) return;

            try {
                const storedCart = localStorage.getItem('shoppingCart');
                const cart = storedCart ? JSON.parse(storedCart) : [];
                const totalCount = Array.isArray(cart)
                    ? cart.reduce(function (sum, item) {
                        return sum + Math.max(0, Number(item && item.quantity) || 0);
                    }, 0)
                    : 0;
                cartNavBtn.textContent = `🛒 (${totalCount})`;
            } catch (error) {
                // 儲存資料格式錯誤或瀏覽器限制時，不中斷其他首頁功能。
                console.error('更新購物車數量失敗：', error);
            }
        }
        updateCartIconCount();

        // 2. 行動版漢堡選單。
        function closeNavMenu() {
            if (!navMenu || !menuToggle) return;
            navMenu.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
        }

        if (menuToggle && navMenu) {
            menuToggle.addEventListener('click', function (event) {
                event.stopPropagation();
                const isOpen = navMenu.classList.toggle('active');
                menuToggle.setAttribute('aria-expanded', String(isOpen));
            });

            document.addEventListener('click', function (event) {
                if (!navMenu.contains(event.target) && !menuToggle.contains(event.target)) {
                    closeNavMenu();
                }
            });

            navMenu.querySelectorAll('a').forEach(function (link) {
                link.addEventListener('click', closeNavMenu);
            });
        }

        // 3. 花園日常照片淡入淡出輪播。
        const track = document.getElementById('carouselTrack');
        if (track) {
            const filenames = ['slide01.jpg', 'slide02.jpg', 'slide03.jpg', 'slide04.jpg'];
            const imageElements = [];
            let currentIndex = 0;

            filenames.forEach(function (filename, index) {
                const img = document.createElement('img');
                img.src = `./carousel/${filename}`;
                img.alt = `花園日常剪影 ${index + 1}`;
                img.loading = index === 0 ? 'eager' : 'lazy';
                if (index === 0) img.classList.add('active');
                img.addEventListener('error', function () {
                    img.classList.remove('active');
                    img.style.display = 'none';
                });
                track.appendChild(img);
                imageElements.push(img);
            });

            if (imageElements.length > 1) {
                window.setInterval(function () {
                    const visibleIndexes = imageElements
                        .map(function (img, index) { return img.style.display === 'none' ? -1 : index; })
                        .filter(function (index) { return index >= 0; });
                    if (visibleIndexes.length < 2) return;

                    imageElements[currentIndex].classList.remove('active');
                    let position = visibleIndexes.indexOf(currentIndex);
                    position = (position + 1) % visibleIndexes.length;
                    currentIndex = visibleIndexes[position];
                    imageElements[currentIndex].classList.add('active');
                }, 3000);
            }
        }

        // 4. 登入展示視窗：不連接帳號系統，不會真正驗證或登入。
        function openLoginModal() {
            if (!loginModal) return;
            closeNavMenu();
            loginModal.classList.add('active');
            const usernameInput = document.getElementById('username');
            if (usernameInput) usernameInput.focus();
        }

        function closeLoginModal() {
            if (loginModal) loginModal.classList.remove('active');
        }

        document.querySelectorAll('.trigger-auth-btn').forEach(function (button) {
            button.addEventListener('click', function (event) {
                event.preventDefault();
                openLoginModal();
            });
        });

        if (closeModalBtn) closeModalBtn.addEventListener('click', closeLoginModal);

        if (loginModal) {
            loginModal.addEventListener('click', function (event) {
                if (event.target === loginModal) closeLoginModal();
            });
        }

        document.addEventListener('keydown', function (event) {
            if (event.key === 'Escape') {
                closeLoginModal();
                closeNavMenu();
            }
        });

        if (loginForm) {
            loginForm.addEventListener('submit', function (event) {
                event.preventDefault();
                window.alert('此視窗僅供展示使用，尚未連接實際登入功能。');
                loginForm.reset();
                closeLoginModal();
            });
        }

        // 5. 精選專區：滑鼠移入或鍵盤聚焦時切換內容，點擊／Enter／空白鍵進入施工中頁面。
        const featureData = {
            succulent: { title: '多肉實錄', imgSrc: './images/圖-多肉實錄.png', bgClass: 'card-succulent' },
            rose: { title: '玫瑰日記', imgSrc: './images/圖-玫瑰日記.png', bgClass: 'card-rose' },
            garden: { title: '名園參訪', imgSrc: './images/圖-名園參訪.png', bgClass: 'card-garden' },
            rescue: { title: '敗木救星', imgSrc: './images/圖-敗木救星.png', bgClass: 'card-rescue' }
        };
        const cards = document.querySelectorAll('.category-card');
        const displayBox = document.getElementById('featureDisplayBox');
        const displayImg = document.getElementById('displayImg');
        const displayTitle = document.getElementById('displayTitle');
        const backgroundClasses = ['card-succulent', 'card-rose', 'card-garden', 'card-rescue'];

        function showFeature(key) {
            const data = featureData[key];
            if (!data || !displayBox || !displayImg || !displayTitle) return;
            displayTitle.textContent = data.title;
            displayImg.src = data.imgSrc;
            displayImg.alt = data.title;
            backgroundClasses.forEach(function (className) { displayBox.classList.remove(className); });
            displayBox.classList.add(data.bgClass);
        }

        function goToMaintenance() {
            window.location.href = './maintenance.html';
        }

        cards.forEach(function (card) {
            const key = card.getAttribute('data-key');
            card.addEventListener('mouseenter', function () { showFeature(key); });
            card.addEventListener('focus', function () { showFeature(key); });
            card.addEventListener('click', goToMaintenance);
            card.addEventListener('keydown', function (event) {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    goToMaintenance();
                }
            });
        });

        if (displayBox) {
            displayBox.addEventListener('click', goToMaintenance);
            displayBox.addEventListener('keydown', function (event) {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    goToMaintenance();
                }
            });
        }


        // 6. 種植雜記頁：只有在該頁的必要元素存在時才執行，其他頁面不受影響。
        const journalGrid = document.getElementById('cardsGrid');
        if (journalGrid && !['knowledge', 'knowledge-detail', 'products'].includes(document.body.dataset.page)) initJournalPage();

        function initJournalPage() {
            let allJournalData = [];
            let currentJournalPage = 1;
            const journalItemsPerPage = 12;
            const paginationBox = document.getElementById('paginationBox');
            const pageNumbers = document.getElementById('pageNumbers');
            const prevBtn = document.getElementById('prevBtn');
            const nextBtn = document.getElementById('nextBtn');

            if (prevBtn) prevBtn.addEventListener('click', function () { changeJournalPage(-1); });
            if (nextBtn) nextBtn.addEventListener('click', function () { changeJournalPage(1); });

            // GitHub Pages 可透過 HTTP(S) 讀取此檔；直接以 file:// 開啟時，瀏覽器可能阻擋 fetch。
            if (typeof window.XLSX === 'undefined') {
                showJournalError('Excel 讀取元件載入失敗，請確認網路連線後重新整理頁面。');
                return;
            }

            fetch('./種植雜記.xlsx')
                .then(function (response) {
                    if (!response.ok) throw new Error('無法讀取「種植雜記.xlsx」檔案（HTTP ' + response.status + '）');
                    return response.arrayBuffer();
                })
                .then(function (buffer) {
                    const workbook = window.XLSX.read(buffer, { type: 'array' });
                    const sheetName = '雜記';
                    if (!workbook.SheetNames.includes(sheetName)) {
                        throw new Error('找不到名為「' + sheetName + '」的資料表');
                    }

                    const worksheet = workbook.Sheets[sheetName];
                    const rows = window.XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });
                    if (!rows.length) {
                        allJournalData = [];
                        renderJournalPage();
                        return;
                    }

                    const headers = rows[0].map(function (value) { return String(value).trim(); });
                    const titleColumn = findHeaderColumn(headers, ['標題']);
                    const imageColumn = findHeaderColumn(headers, ['圖檔檔名', '圖檔', '檔名']);

                    allJournalData = rows.slice(1).reduce(function (items, row) {
                        if (!row || row.every(isBlankCell)) return items;

                        // 優先使用標題列名稱；找不到時沿用原始程式的 B 欄標題、D 欄圖片檔名。
                        const titleValue = titleColumn >= 0 ? row[titleColumn] : row[1];
                        const imageValue = imageColumn >= 0 ? row[imageColumn] : row[3];
                        items.push({
                            title: String(titleValue == null ? '' : titleValue).trim(),
                            imgName: String(imageValue == null ? '' : imageValue).trim()
                        });
                        return items;
                    }, []);

                    currentJournalPage = 1;
                    renderJournalPage();
                })
                .catch(function (error) {
                    console.error('種植雜記資料讀取失敗：', error);
                    showJournalError('讀取資料失敗，請確認「種植雜記.xlsx」與 Journal.html 位於網站根目錄，且 Excel 中含有「雜記」資料表。');
                });

            function findHeaderColumn(headers, keywords) {
                return headers.findIndex(function (header) {
                    return keywords.some(function (keyword) { return header === keyword || header.includes(keyword); });
                });
            }

            function isBlankCell(value) {
                return value === '' || value === null || typeof value === 'undefined';
            }

            function showJournalError(message) {
                journalGrid.replaceChildren();
                const status = document.createElement('div');
                status.className = 'status-message';
                status.style.color = '#c00';
                status.textContent = message;
                journalGrid.appendChild(status);
                if (paginationBox) paginationBox.style.display = 'none';
            }

            function renderJournalPage() {
                journalGrid.replaceChildren();
                const totalItems = allJournalData.length;

                if (totalItems === 0) {
                    const status = document.createElement('div');
                    status.className = 'status-message';
                    status.textContent = '目前尚無雜記文章資料。';
                    journalGrid.appendChild(status);
                    if (paginationBox) paginationBox.style.display = 'none';
                    return;
                }

                const startIndex = (currentJournalPage - 1) * journalItemsPerPage;
                const pageData = allJournalData.slice(startIndex, startIndex + journalItemsPerPage);

                pageData.forEach(function (item, index) {
                    const realIndex = startIndex + index;
                    const title = item.title || '未命名文章';
                    const card = document.createElement('article');
                    card.className = 'journal-card';
                    card.tabIndex = 0;
                    card.setAttribute('role', 'link');
                    card.setAttribute('aria-label', '閱讀文章：' + title);

                    const imageBox = document.createElement('div');
                    imageBox.className = 'card-img-box';
                    if (item.imgName) {
                        const image = document.createElement('img');
                        image.src = './images/' + item.imgName;
                        image.alt = title;
                        image.loading = 'lazy';
                        image.addEventListener('error', function () {
                            image.remove();
                            imageBox.textContent = '圖片';
                            imageBox.style.color = '#888';
                            imageBox.style.fontSize = '1.2rem';
                        }, { once: true });
                        imageBox.appendChild(image);
                    } else {
                        imageBox.textContent = '圖片';
                        imageBox.style.color = '#888';
                        imageBox.style.fontSize = '1.2rem';
                    }

                    const titleElement = document.createElement('div');
                    titleElement.className = 'card-title-text';
                    titleElement.textContent = title;
                    card.appendChild(imageBox);
                    card.appendChild(titleElement);

                    function openArticle() {
                        window.location.href = './journal-detail.html?id=' + encodeURIComponent(realIndex);
                    }
                    card.addEventListener('click', openArticle);
                    card.addEventListener('keydown', function (event) {
                        if (event.key === 'Enter' || event.key === ' ') {
                            event.preventDefault();
                            openArticle();
                        }
                    });
                    journalGrid.appendChild(card);
                });

                renderJournalPagination(totalItems);
            }

            function renderJournalPagination(totalItems) {
                const totalPages = Math.ceil(totalItems / journalItemsPerPage);
                if (!paginationBox || !pageNumbers || !prevBtn || !nextBtn) return;
                if (totalPages <= 1) {
                    paginationBox.style.display = 'none';
                    return;
                }

                paginationBox.style.display = 'flex';
                prevBtn.disabled = currentJournalPage === 1;
                nextBtn.disabled = currentJournalPage === totalPages;
                pageNumbers.replaceChildren();

                for (let page = 1; page <= totalPages; page += 1) {
                    const pageButton = document.createElement('button');
                    pageButton.type = 'button';
                    pageButton.className = 'page-num' + (page === currentJournalPage ? ' active' : '');
                    pageButton.textContent = String(page);
                    pageButton.setAttribute('aria-label', '第 ' + page + ' 頁');
                    if (page === currentJournalPage) pageButton.setAttribute('aria-current', 'page');
                    pageButton.addEventListener('click', function () {
                        currentJournalPage = page;
                        renderJournalPage();
                    });
                    pageNumbers.appendChild(pageButton);
                }
            }

            function changeJournalPage(direction) {
                const totalPages = Math.ceil(allJournalData.length / journalItemsPerPage);
                const nextPage = currentJournalPage + direction;
                if (nextPage >= 1 && nextPage <= totalPages) {
                    currentJournalPage = nextPage;
                    renderJournalPage();
                }
            }
        }



        // 6.5 資材選物店商品列表：由 products.html 的 data-page="products" 明確啟用。
        if (document.body.dataset.page === 'products' && document.getElementById('cardsGrid')) {
            initProductsPage();
        }

        function initProductsPage() {
            const grid = document.getElementById('cardsGrid');
            const paginationBox = document.getElementById('paginationBox');
            const pageNumbers = document.getElementById('pageNumbers');
            const prevBtn = document.getElementById('prevBtn');
            const nextBtn = document.getElementById('nextBtn');
            const itemsPerPage = 12;
            let products = [];
            let currentPage = 1;

            if (prevBtn) prevBtn.addEventListener('click', function () { changePage(-1); });
            if (nextBtn) nextBtn.addEventListener('click', function () { changePage(1); });

            if (typeof window.XLSX === 'undefined') {
                showStatus('Excel 讀取元件載入失敗，請確認網路連線後重新整理頁面。', true);
                return;
            }

            fetch('./多肉與玫瑰產品統計表.xlsx')
                .then(function (response) {
                    if (!response.ok) {
                        throw new Error('無法讀取「多肉與玫瑰產品統計表.xlsx」檔案（HTTP ' + response.status + '）');
                    }
                    return response.arrayBuffer();
                })
                .then(function (buffer) {
                    const workbook = window.XLSX.read(buffer, { type: 'array' });
                    const sheetName = '商品彙整';
                    if (!workbook.SheetNames.includes(sheetName)) {
                        throw new Error('找不到名為「' + sheetName + '」的資料表');
                    }

                    const rows = window.XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
                        header: 1,
                        defval: ''
                    });

                    if (rows.length < 2) {
                        products = [];
                        renderPage();
                        return;
                    }

                    const headers = rows[0].map(function (value) {
                        return String(value == null ? '' : value).trim();
                    });

                    function findColumn(candidates, fallbackIndex) {
                        const foundIndex = headers.findIndex(function (header) {
                            return candidates.some(function (candidate) {
                                return header === candidate || header.includes(candidate);
                            });
                        });
                        return foundIndex >= 0 ? foundIndex : fallbackIndex;
                    }

                    const nameIndex = findColumn(['商品名稱', '名稱'], 2);
                    const priceIndex = findColumn(['售價', '價格'], 3);
                    const imageIndex = findColumn(['圖檔檔名', '圖檔', '檔名'], 5);

                    products = rows.slice(1).map(function (row, index) {
                        if (!row || row.every(function (cell) {
                            return String(cell == null ? '' : cell).trim() === '';
                        })) return null;

                        const name = String(row[nameIndex] == null ? '' : row[nameIndex]).trim();
                        const rawPrice = row[priceIndex] == null ? '' : row[priceIndex];
                        const imgName = String(row[imageIndex] == null ? '' : row[imageIndex]).trim();

                        let priceText = '';
                        if (typeof rawPrice === 'number' && Number.isFinite(rawPrice)) {
                            priceText = 'NT$ ' + rawPrice.toLocaleString('zh-TW');
                        } else {
                            const cleanedPrice = String(rawPrice).trim();
                            if (cleanedPrice) {
                                priceText = /^NT\$\s*/i.test(cleanedPrice) ? cleanedPrice : 'NT$ ' + cleanedPrice;
                            }
                        }

                        return {
                            id: index,
                            name: name || '精選商品',
                            price: priceText || 'NT$ 0',
                            imgName: imgName
                        };
                    }).filter(Boolean);

                    currentPage = 1;
                    renderPage();
                })
                .catch(function (error) {
                    console.error('商品資料讀取失敗：', error);
                    showStatus('讀取資料失敗，請確認「多肉與玫瑰產品統計表.xlsx」位於網站根目錄，且包含「商品彙整」工作表。', true);
                });

            function showStatus(message, isError) {
                grid.replaceChildren();
                const status = document.createElement('div');
                status.className = 'status-message';
                status.textContent = message;
                if (isError) status.style.color = '#c00';
                grid.appendChild(status);
                if (paginationBox) paginationBox.style.display = 'none';
            }

            function showImagePlaceholder(box) {
                const placeholder = document.createElement('span');
                placeholder.textContent = '圖片';
                placeholder.style.color = '#888';
                placeholder.style.fontSize = '1.2rem';
                box.appendChild(placeholder);
            }

            function renderPage() {
                grid.replaceChildren();
                const totalItems = products.length;
                if (!totalItems) {
                    showStatus('目前尚無商品資料。', false);
                    return;
                }

                const totalPages = Math.ceil(totalItems / itemsPerPage);
                if (currentPage > totalPages) currentPage = totalPages;
                const startIndex = (currentPage - 1) * itemsPerPage;
                const pageItems = products.slice(startIndex, startIndex + itemsPerPage);

                pageItems.forEach(function (product) {
                    const card = document.createElement('article');
                    card.className = 'product-card';
                    card.tabIndex = 0;
                    card.setAttribute('role', 'link');
                    card.setAttribute('aria-label', '查看商品：' + product.name);

                    const imageBox = document.createElement('div');
                    imageBox.className = 'card-img-box';
                    if (product.imgName) {
                        const image = document.createElement('img');
                        image.src = './images/' + product.imgName;
                        image.alt = product.name;
                        image.loading = 'lazy';
                        image.addEventListener('error', function () {
                            image.remove();
                            showImagePlaceholder(imageBox);
                        }, { once: true });
                        imageBox.appendChild(image);
                    } else {
                        showImagePlaceholder(imageBox);
                    }

                    const infoBox = document.createElement('div');
                    infoBox.className = 'card-info-box';
                    const textGroup = document.createElement('div');
                    textGroup.className = 'card-text-group';
                    const title = document.createElement('div');
                    title.className = 'card-title-text';
                    title.textContent = product.name;
                    const price = document.createElement('div');
                    price.className = 'card-price-text';
                    price.textContent = product.price;
                    textGroup.append(title, price);

                    const cartButton = document.createElement('button');
                    cartButton.type = 'button';
                    cartButton.className = 'cart-icon-btn';
                    cartButton.title = '加入購物車';
                    cartButton.setAttribute('aria-label', '將 ' + product.name + ' 加入購物車');
                    cartButton.textContent = '🛒';
                    cartButton.addEventListener('click', function (event) {
                        event.stopPropagation();
                        addProductToCart(product);
                    });

                    infoBox.append(textGroup, cartButton);
                    card.append(imageBox, infoBox);

                    function openProduct() {
                        window.location.href = './product-detail.html?id=' + encodeURIComponent(product.id);
                    }
                    card.addEventListener('click', openProduct);
                    card.addEventListener('keydown', function (event) {
                        if (event.key === 'Enter' || event.key === ' ') {
                            event.preventDefault();
                            openProduct();
                        }
                    });
                    grid.appendChild(card);
                });

                renderPagination(totalPages);
            }

            function renderPagination(totalPages) {
                if (!paginationBox || !pageNumbers || !prevBtn || !nextBtn) return;
                if (totalPages <= 1) {
                    paginationBox.style.display = 'none';
                    return;
                }

                paginationBox.style.display = 'flex';
                prevBtn.disabled = currentPage === 1;
                nextBtn.disabled = currentPage === totalPages;
                pageNumbers.replaceChildren();

                for (let page = 1; page <= totalPages; page += 1) {
                    const button = document.createElement('button');
                    button.type = 'button';
                    button.className = 'page-num' + (page === currentPage ? ' active' : '');
                    button.textContent = String(page);
                    button.setAttribute('aria-label', '第 ' + page + ' 頁');
                    if (page === currentPage) button.setAttribute('aria-current', 'page');
                    button.addEventListener('click', function () {
                        currentPage = page;
                        renderPage();
                    });
                    pageNumbers.appendChild(button);
                }
            }

            function changePage(direction) {
                const totalPages = Math.ceil(products.length / itemsPerPage);
                const nextPage = currentPage + direction;
                if (nextPage >= 1 && nextPage <= totalPages) {
                    currentPage = nextPage;
                    renderPage();
                }
            }

            function addProductToCart(product) {
                let cart;
                try {
                    const storedCart = localStorage.getItem('shoppingCart');
                    cart = storedCart ? JSON.parse(storedCart) : [];
                    if (!Array.isArray(cart)) cart = [];
                } catch (error) {
                    window.alert('購物車資料無法讀取，請清除錯誤的購物車資料後再試。');
                    console.error('購物車資料解析失敗：', error);
                    return;
                }

                const existingItem = cart.find(function (item) {
                    return item && item.name === product.name;
                });
                if (existingItem) {
                    existingItem.quantity = (Number(existingItem.quantity) || 0) + 1;
                } else {
                    cart.push({
                        id: product.id,
                        name: product.name,
                        price: product.price,
                        imgName: product.imgName,
                        quantity: 1
                    });
                }

                try {
                    localStorage.setItem('shoppingCart', JSON.stringify(cart));
                } catch (error) {
                    window.alert('目前無法儲存購物車，請確認瀏覽器儲存空間或權限。');
                    console.error('儲存購物車失敗：', error);
                    return;
                }
                updateCartIconCount();
                window.alert('已將「' + product.name + '」加入購物車！');
            }
        }


        // 6.6 商品詳細頁：與商品列表共用 Excel 商品資料及購物車格式。
        if (document.body.dataset.page === 'product-detail' && document.getElementById('productContainer')) {
            initProductDetailPage();
        }

        function initProductDetailPage() {
            const container = document.getElementById('productContainer');
            const navButtons = document.getElementById('navButtons');
            const prevBtn = document.getElementById('prevProductBtn');
            const nextBtn = document.getElementById('nextProductBtn');
            let products = [];
            let currentProductIndex = -1;

            const params = new URLSearchParams(window.location.search);
            const rawId = params.get('id');
            const requestedId = rawId === null ? 0 : Number.parseInt(rawId, 10);

            if (typeof window.XLSX === 'undefined') {
                showStatus('Excel 讀取元件載入失敗，請確認網路連線後重新整理頁面。', true);
                return;
            }

            fetch('./多肉與玫瑰產品統計表.xlsx')
                .then(function (response) {
                    if (!response.ok) {
                        throw new Error('無法讀取商品 Excel 檔案（HTTP ' + response.status + '）');
                    }
                    return response.arrayBuffer();
                })
                .then(function (buffer) {
                    const workbook = window.XLSX.read(buffer, { type: 'array' });
                    const sheetName = '商品彙整';
                    if (!workbook.SheetNames.includes(sheetName)) {
                        throw new Error('找不到名為「' + sheetName + '」的資料表');
                    }

                    const rows = window.XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
                        header: 1,
                        defval: ''
                    });
                    if (rows.length < 2) {
                        showStatus('目前沒有商品資料。', false);
                        return;
                    }

                    const headers = rows[0].map(function (value) {
                        return String(value == null ? '' : value).trim();
                    });

                    function findColumn(candidates, fallbackIndex) {
                        const index = headers.findIndex(function (header) {
                            return candidates.some(function (candidate) {
                                return header === candidate || header.includes(candidate);
                            });
                        });
                        return index >= 0 ? index : fallbackIndex;
                    }

                    const nameIndex = findColumn(['商品名稱', '名稱'], 2);
                    const priceIndex = findColumn(['售價', '價格'], 3);
                    const descIndex = findColumn(['商品描述', '描述', '商品介紹', '簡介'], 4);
                    const imageIndex = findColumn(['圖檔檔名', '圖檔', '檔名'], 5);

                    // id 與商品列表相同，使用 Excel 標題列以下的原始資料列索引，
                    // 避免空白列被略過後，列表連結與詳細頁商品編號不一致。
                    products = rows.slice(1).map(function (row, rowIndex) {
                        if (!row || row.every(function (cell) {
                            return String(cell == null ? '' : cell).trim() === '';
                        })) return null;

                        const name = String(row[nameIndex] == null ? '' : row[nameIndex]).trim();
                        const rawPrice = row[priceIndex] == null ? '' : row[priceIndex];
                        const desc = String(row[descIndex] == null ? '' : row[descIndex]).trim();
                        const imgName = String(row[imageIndex] == null ? '' : row[imageIndex]).trim();

                        let price = '';
                        if (typeof rawPrice === 'number' && Number.isFinite(rawPrice)) {
                            price = 'NT$ ' + rawPrice.toLocaleString('zh-TW');
                        } else {
                            const priceText = String(rawPrice).trim();
                            if (priceText) {
                                price = /^NT\$\s*/i.test(priceText) ? priceText : 'NT$ ' + priceText;
                            }
                        }

                        return {
                            id: rowIndex,
                            name: name || '商品名稱',
                            price: price || 'NT$ 0',
                            desc: desc || '暫無商品詳細說明。',
                            imgName: imgName
                        };
                    }).filter(Boolean);

                    if (!products.length) {
                        showStatus('目前沒有商品資料。', false);
                        return;
                    }

                    const targetId = Number.isInteger(requestedId) && requestedId >= 0 ? requestedId : 0;
                    currentProductIndex = products.findIndex(function (product) {
                        return product.id === targetId;
                    });
                    if (currentProductIndex < 0) {
                        currentProductIndex = 0;
                    }

                    renderProduct(products[currentProductIndex]);
                    setupNavigation();
                })
                .catch(function (error) {
                    console.error('商品詳細資料讀取失敗：', error);
                    showStatus('商品載入失敗，請確認「多肉與玫瑰產品統計表.xlsx」位於網站根目錄，且包含「商品彙整」工作表。', true);
                });

            function showStatus(message, isError) {
                container.replaceChildren();
                const status = document.createElement('div');
                status.className = 'status-msg';
                status.textContent = message;
                if (isError) status.style.color = '#c00';
                container.appendChild(status);
                if (navButtons) navButtons.hidden = true;
            }

            function renderProduct(product) {
                container.replaceChildren();

                const imageBox = document.createElement('div');
                imageBox.className = 'product-detail-img-box';
                if (product.imgName) {
                    const image = document.createElement('img');
                    image.src = './images/' + product.imgName;
                    image.alt = product.name;
                    image.addEventListener('error', function () {
                        image.remove();
                        const placeholder = document.createElement('span');
                        placeholder.textContent = '圖片';
                        placeholder.style.color = '#888';
                        placeholder.style.fontSize = '1.5rem';
                        imageBox.appendChild(placeholder);
                    }, { once: true });
                    imageBox.appendChild(image);
                } else {
                    const placeholder = document.createElement('span');
                    placeholder.textContent = '圖片';
                    placeholder.style.color = '#888';
                    placeholder.style.fontSize = '1.5rem';
                    imageBox.appendChild(placeholder);
                }

                const info = document.createElement('div');
                info.className = 'product-detail-info';

                const title = document.createElement('div');
                title.className = 'product-detail-title';
                title.textContent = product.name;

                const price = document.createElement('div');
                price.className = 'product-detail-price';
                price.textContent = product.price;

                const description = document.createElement('div');
                description.className = 'product-detail-desc';
                description.textContent = product.desc;

                const addButton = document.createElement('button');
                addButton.type = 'button';
                addButton.className = 'add-to-cart-big-btn';
                addButton.textContent = '🛒 加入購物車';
                addButton.addEventListener('click', function () {
                    addDetailProductToCart(product);
                });

                info.append(title, price, description, addButton);
                container.append(imageBox, info);
                if (navButtons) navButtons.hidden = false;
            }

            function setupNavigation() {
                if (!prevBtn || !nextBtn) return;
                prevBtn.disabled = currentProductIndex <= 0;
                nextBtn.disabled = currentProductIndex >= products.length - 1;

                prevBtn.onclick = function () {
                    if (currentProductIndex > 0) {
                        window.location.href = './product-detail.html?id=' +
                            encodeURIComponent(products[currentProductIndex - 1].id);
                    }
                };
                nextBtn.onclick = function () {
                    if (currentProductIndex < products.length - 1) {
                        window.location.href = './product-detail.html?id=' +
                            encodeURIComponent(products[currentProductIndex + 1].id);
                    }
                };
            }

            function addDetailProductToCart(product) {
                let cart;
                try {
                    const storedCart = localStorage.getItem('shoppingCart');
                    cart = storedCart ? JSON.parse(storedCart) : [];
                    if (!Array.isArray(cart)) cart = [];
                } catch (error) {
                    window.alert('購物車資料無法讀取，請清除錯誤的購物車資料後再試。');
                    console.error('購物車資料解析失敗：', error);
                    return;
                }

                const existingItem = cart.find(function (item) {
                    return item && item.name === product.name;
                });
                if (existingItem) {
                    existingItem.quantity = (Number(existingItem.quantity) || 0) + 1;
                } else {
                    cart.push({
                        id: product.id,
                        name: product.name,
                        price: product.price,
                        imgName: product.imgName,
                        quantity: 1
                    });
                }

                try {
                    localStorage.setItem('shoppingCart', JSON.stringify(cart));
                } catch (error) {
                    window.alert('目前無法儲存購物車，請確認瀏覽器儲存空間或權限。');
                    console.error('儲存購物車失敗：', error);
                    return;
                }

                updateCartIconCount();
                window.alert('已將「' + product.name + '」加入購物車！');
            }
        }

        // 7. 種植雜記文章內容頁：僅在文章頁的必要元素存在時執行。
        const articleContainer = document.getElementById('articleContainer');
        if (articleContainer) {
            if (document.body.dataset.page === 'knowledge-detail') {
                initKnowledgeDetailPage();
            } else {
                initJournalDetailPage();
            }
        }

        function initJournalDetailPage() {
            const navButtons = document.getElementById('navButtons');
            const prevButton = document.getElementById('prevArticleBtn');
            const nextButton = document.getElementById('nextArticleBtn');
            const params = new URLSearchParams(window.location.search);
            const rawId = params.get('id');
            const parsedId = rawId === null || rawId.trim() === '' ? 0 : Number(rawId);
            let currentId = Number.isInteger(parsedId) && parsedId >= 0 ? parsedId : 0;
            let articles = [];

            if (typeof window.XLSX === 'undefined') {
                showDetailStatus('Excel 讀取元件載入失敗，請確認網路連線後重新整理頁面。', true);
                return;
            }

            fetch('./種植雜記.xlsx')
                .then(function (response) {
                    if (!response.ok) {
                        throw new Error('無法讀取「種植雜記.xlsx」檔案（HTTP ' + response.status + '）');
                    }
                    return response.arrayBuffer();
                })
                .then(function (buffer) {
                    const workbook = window.XLSX.read(buffer, { type: 'array' });
                    const sheetName = '雜記';
                    if (!workbook.SheetNames.includes(sheetName)) {
                        throw new Error('找不到名為「' + sheetName + '」的資料表');
                    }

                    const rows = window.XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
                        header: 1,
                        defval: ''
                    });
                    if (!rows.length) {
                        showDetailStatus('目前沒有文章資料。');
                        return;
                    }

                    const headers = rows[0].map(function (value) {
                        return String(value == null ? '' : value).trim();
                    });
                    const titleColumn = findDetailColumn(headers, ['標題']);
                    const contentColumn = findDetailColumn(headers, ['文章內容', '內容']);
                    const imageColumn = findDetailColumn(headers, ['圖檔檔名', '圖檔', '檔名']);

                    articles = rows.slice(1).reduce(function (result, row) {
                        if (!row || row.every(isDetailBlankCell)) return result;

                        // 優先依欄位名稱讀取；找不到時沿用原始 Excel 的 B、C、D 欄。
                        const title = titleColumn >= 0 ? row[titleColumn] : row[1];
                        const content = contentColumn >= 0 ? row[contentColumn] : row[2];
                        const imgName = imageColumn >= 0 ? row[imageColumn] : row[3];
                        result.push({
                            title: String(title == null ? '' : title).trim(),
                            content: String(content == null ? '' : content).trim(),
                            imgName: String(imgName == null ? '' : imgName).trim()
                        });
                        return result;
                    }, []);

                    if (articles.length === 0) {
                        showDetailStatus('目前沒有文章資料。');
                        return;
                    }

                    if (currentId >= articles.length) currentId = articles.length - 1;
                    renderDetailArticle(articles[currentId]);
                    setupDetailNavigation();
                })
                .catch(function (error) {
                    console.error('文章資料讀取失敗：', error);
                    showDetailStatus('文章載入失敗，請確認「種植雜記.xlsx」位於網站根目錄，且工作表名稱為「雜記」。', true);
                });

            function findDetailColumn(headers, keywords) {
                return headers.findIndex(function (header) {
                    return keywords.some(function (keyword) {
                        return header === keyword || header.includes(keyword);
                    });
                });
            }

            function isDetailBlankCell(value) {
                return value === '' || value === null || typeof value === 'undefined';
            }

            function showDetailStatus(message, isError) {
                articleContainer.replaceChildren();
                const status = document.createElement('div');
                status.className = 'status-msg';
                status.textContent = message;
                if (isError) status.style.color = '#c00';
                articleContainer.appendChild(status);
                if (navButtons) navButtons.style.display = 'none';
            }

            function renderDetailArticle(article) {
                articleContainer.replaceChildren();

                const imageBox = document.createElement('div');
                imageBox.className = 'article-img-box';
                if (article.imgName) {
                    const image = document.createElement('img');
                    image.src = './images/' + article.imgName;
                    image.alt = article.title || '文章圖片';
                    image.addEventListener('error', function () {
                        image.remove();
                        showImagePlaceholder(imageBox);
                    }, { once: true });
                    imageBox.appendChild(image);
                } else {
                    showImagePlaceholder(imageBox);
                }

                const title = document.createElement('div');
                title.className = 'article-title';
                title.textContent = article.title || '文章標題';

                const content = document.createElement('div');
                content.className = 'article-content';
                content.textContent = article.content || '文章內容';

                articleContainer.appendChild(imageBox);
                articleContainer.appendChild(title);
                articleContainer.appendChild(content);
                if (navButtons) navButtons.style.display = 'flex';
            }

            function showImagePlaceholder(imageBox) {
                const placeholder = document.createElement('span');
                placeholder.textContent = '圖片';
                placeholder.style.color = '#888';
                placeholder.style.fontSize = '1.5rem';
                imageBox.replaceChildren(placeholder);
            }

            function setupDetailNavigation() {
                configureNavigationButton(prevButton, currentId > 0, currentId - 1, '上一篇');
                configureNavigationButton(nextButton, currentId < articles.length - 1, currentId + 1, '下一篇');
            }

            function configureNavigationButton(button, isAvailable, targetId, label) {
                if (!button) return;
                button.classList.toggle('disabled', !isAvailable);
                button.disabled = !isAvailable;
                button.setAttribute('aria-label', label);
                if (isAvailable) {
                    button.onclick = function () {
                        window.location.href = './journal-detail.html?id=' + encodeURIComponent(targetId);
                    };
                } else {
                    button.onclick = null;
                }
            }
        }


        // 植栽知識庫文章內頁：使用「植栽知識庫.xlsx」的「知識庫」工作表。
        function initKnowledgeDetailPage() {
            const navButtons = document.getElementById('navButtons');
            const prevButton = document.getElementById('prevArticleBtn');
            const nextButton = document.getElementById('nextArticleBtn');
            const params = new URLSearchParams(window.location.search);
            const rawId = params.get('id');
            const parsedId = rawId === null || rawId.trim() === '' ? 0 : Number(rawId);
            let currentId = Number.isInteger(parsedId) && parsedId >= 0 ? parsedId : 0;

            if (typeof window.XLSX === 'undefined') {
                showKnowledgeDetailStatus('Excel 讀取元件載入失敗，請確認網路連線後重新整理頁面。', true);
                return;
            }

            fetch('./植栽知識庫.xlsx')
                .then(function (response) {
                    if (!response.ok) {
                        throw new Error('無法讀取「植栽知識庫.xlsx」檔案（HTTP ' + response.status + '）');
                    }
                    return response.arrayBuffer();
                })
                .then(function (buffer) {
                    const workbook = window.XLSX.read(buffer, { type: 'array' });
                    const sheetName = '知識庫';
                    if (!workbook.SheetNames.includes(sheetName)) {
                        throw new Error('找不到名為「' + sheetName + '」的資料表');
                    }

                    const rows = window.XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
                        header: 1,
                        defval: ''
                    });
                    if (!rows.length) {
                        showKnowledgeDetailStatus('目前沒有文章資料。');
                        return;
                    }

                    const headers = rows[0].map(function (value) {
                        return String(value == null ? '' : value).trim();
                    });
                    const mainCategoryColumn = findKnowledgeDetailColumn(headers, ['主分類']);
                    const subCategoryColumn = findKnowledgeDetailColumn(headers, ['次分類']);
                    const titleColumn = findKnowledgeDetailColumn(headers, ['文章標題', '標題']);
                    const contentColumn = findKnowledgeDetailColumn(headers, ['文章內容', '內容']);
                    const imageColumn = findKnowledgeDetailColumn(headers, ['圖檔檔名', '圖檔', '檔名']);

                    // 與知識庫列表頁採用相同欄位規則及資料順序，確保卡片 id 對應正確文章。
                    const articles = rows.slice(1).reduce(function (items, row) {
                        if (!row || row.every(isKnowledgeDetailBlankCell)) return items;
                        const mainCategory = mainCategoryColumn >= 0 ? row[mainCategoryColumn] : row[1];
                        const subCategory = subCategoryColumn >= 0 ? row[subCategoryColumn] : row[2];
                        const title = titleColumn >= 0 ? row[titleColumn] : row[3];
                        const content = contentColumn >= 0 ? row[contentColumn] : row[4];
                        const imageName = imageColumn >= 0 ? row[imageColumn] : row[5];
                        const mainText = cleanKnowledgeDetailText(mainCategory);
                        const subText = cleanKnowledgeDetailText(subCategory);
                        items.push({
                            categoryTag: mainText && subText ? mainText + ' / ' + subText : (mainText || subText),
                            title: cleanKnowledgeDetailText(title),
                            content: cleanKnowledgeDetailText(content),
                            imgName: cleanKnowledgeDetailText(imageName)
                        });
                        return items;
                    }, []);

                    if (articles.length === 0) {
                        showKnowledgeDetailStatus('目前沒有文章資料。');
                        return;
                    }

                    if (currentId >= articles.length) currentId = articles.length - 1;
                    renderKnowledgeDetailArticle(articles[currentId]);
                    setupKnowledgeDetailNavigation(currentId, articles.length);
                })
                .catch(function (error) {
                    console.error('植栽知識庫文章讀取失敗：', error);
                    showKnowledgeDetailStatus('文章載入失敗，請確認「植栽知識庫.xlsx」位於網站根目錄，且工作表名稱為「知識庫」。', true);
                });

            function findKnowledgeDetailColumn(headers, keywords) {
                return headers.findIndex(function (header) {
                    return keywords.some(function (keyword) {
                        return header === keyword || header.includes(keyword);
                    });
                });
            }

            function cleanKnowledgeDetailText(value) {
                return String(value == null ? '' : value).trim();
            }

            function isKnowledgeDetailBlankCell(value) {
                return value === '' || value === null || typeof value === 'undefined';
            }

            function showKnowledgeDetailStatus(message, isError) {
                articleContainer.replaceChildren();
                const status = document.createElement('div');
                status.className = 'status-msg';
                status.textContent = message;
                if (isError) status.style.color = '#c00';
                articleContainer.appendChild(status);
                if (navButtons) navButtons.style.display = 'none';
            }

            function renderKnowledgeDetailArticle(article) {
                articleContainer.replaceChildren();

                const imageBox = document.createElement('div');
                imageBox.className = 'article-img-box';
                if (article.imgName) {
                    const image = document.createElement('img');
                    image.src = './images/' + article.imgName;
                    image.alt = article.title || '文章圖片';
                    image.addEventListener('error', function () {
                        image.remove();
                        showKnowledgeDetailImagePlaceholder(imageBox);
                    }, { once: true });
                    imageBox.appendChild(image);
                } else {
                    showKnowledgeDetailImagePlaceholder(imageBox);
                }

                if (article.categoryTag) {
                    const category = document.createElement('div');
                    category.className = 'article-category-tag';
                    category.textContent = article.categoryTag;
                    articleContainer.appendChild(imageBox);
                    articleContainer.appendChild(category);
                } else {
                    articleContainer.appendChild(imageBox);
                }

                const title = document.createElement('div');
                title.className = 'article-title';
                title.textContent = article.title || '文章標題';

                const content = document.createElement('div');
                content.className = 'article-content';
                content.textContent = article.content || '文章內容';

                articleContainer.appendChild(title);
                articleContainer.appendChild(content);
                if (navButtons) navButtons.style.display = 'flex';
            }

            function showKnowledgeDetailImagePlaceholder(imageBox) {
                const placeholder = document.createElement('span');
                placeholder.textContent = '圖片';
                placeholder.style.color = '#888';
                placeholder.style.fontSize = '1.5rem';
                imageBox.replaceChildren(placeholder);
            }

            function setupKnowledgeDetailNavigation(current, total) {
                configureKnowledgeDetailButton(prevButton, current > 0, current - 1, '上一篇');
                configureKnowledgeDetailButton(nextButton, current < total - 1, current + 1, '下一篇');
            }

            function configureKnowledgeDetailButton(button, isAvailable, targetId, label) {
                if (!button) return;
                button.classList.toggle('disabled', !isAvailable);
                button.disabled = !isAvailable;
                button.setAttribute('aria-label', label);
                if (isAvailable) {
                    button.onclick = function () {
                        window.location.href = './knowledge-detail.html?id=' + encodeURIComponent(targetId);
                    };
                } else {
                    button.onclick = null;
                }
            }
        }


        // 8. 植栽知識庫頁：同樣使用 cardsGrid，但以 body[data-page="knowledge"] 與雜記列表區分。
        if (document.body.dataset.page === 'knowledge' && document.getElementById('cardsGrid')) {
            initKnowledgePage();
        }

        function initKnowledgePage() {
            const grid = document.getElementById('cardsGrid');
            const paginationBox = document.getElementById('paginationBox');
            const pageNumbers = document.getElementById('pageNumbers');
            const prevBtn = document.getElementById('prevBtn');
            const nextBtn = document.getElementById('nextBtn');
            const itemsPerPage = 12;
            let allKnowledgeData = [];
            let currentPage = 1;

            if (prevBtn) prevBtn.addEventListener('click', function () { changePage(-1); });
            if (nextBtn) nextBtn.addEventListener('click', function () { changePage(1); });

            if (typeof window.XLSX === 'undefined') {
                showKnowledgeStatus('Excel 讀取元件載入失敗，請確認網路連線後重新整理頁面。', true);
                return;
            }

            fetch('./植栽知識庫.xlsx')
                .then(function (response) {
                    if (!response.ok) throw new Error('無法讀取「植栽知識庫.xlsx」檔案（HTTP ' + response.status + '）');
                    return response.arrayBuffer();
                })
                .then(function (buffer) {
                    const workbook = window.XLSX.read(buffer, { type: 'array' });
                    const sheetName = '知識庫';
                    if (!workbook.SheetNames.includes(sheetName)) {
                        throw new Error('找不到名為「' + sheetName + '」的資料表');
                    }

                    const rows = window.XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
                        header: 1,
                        defval: ''
                    });
                    if (!rows.length) {
                        allKnowledgeData = [];
                        renderPage();
                        return;
                    }

                    const headers = rows[0].map(function (value) {
                        return String(value == null ? '' : value).trim();
                    });
                    const mainCategoryColumn = findColumn(headers, ['主分類']);
                    const subCategoryColumn = findColumn(headers, ['次分類']);
                    const titleColumn = findColumn(headers, ['文章標題', '標題']);
                    const imageColumn = findColumn(headers, ['圖檔檔名', '圖檔', '檔名']);

                    // 找不到欄位名稱時，沿用原程式的 B、C、D、F 欄位置。
                    allKnowledgeData = rows.slice(1).reduce(function (items, row) {
                        if (!row || row.every(isBlankCell)) return items;
                        const mainCategory = mainCategoryColumn >= 0 ? row[mainCategoryColumn] : row[1];
                        const subCategory = subCategoryColumn >= 0 ? row[subCategoryColumn] : row[2];
                        const title = titleColumn >= 0 ? row[titleColumn] : row[3];
                        const imageName = imageColumn >= 0 ? row[imageColumn] : row[5];
                        const mainText = cleanText(mainCategory);
                        const subText = cleanText(subCategory);
                        items.push({
                            categoryTag: mainText && subText ? mainText + ' / ' + subText : (mainText || subText),
                            title: cleanText(title),
                            imgName: cleanText(imageName)
                        });
                        return items;
                    }, []);

                    currentPage = 1;
                    renderPage();
                })
                .catch(function (error) {
                    console.error('植栽知識庫資料讀取失敗：', error);
                    showKnowledgeStatus('讀取資料失敗！請確認「植栽知識庫.xlsx」已放在網站根目錄，且工作表名稱為「知識庫」。', true);
                });

            function findColumn(headers, keywords) {
                return headers.findIndex(function (header) {
                    return keywords.some(function (keyword) {
                        return header === keyword || header.includes(keyword);
                    });
                });
            }

            function cleanText(value) {
                return String(value == null ? '' : value).trim();
            }

            function isBlankCell(value) {
                return value === '' || value === null || typeof value === 'undefined';
            }

            function showKnowledgeStatus(message, isError) {
                grid.replaceChildren();
                const status = document.createElement('div');
                status.className = 'status-message';
                status.textContent = message;
                if (isError) status.style.color = '#c00';
                grid.appendChild(status);
                if (paginationBox) paginationBox.style.display = 'none';
            }

            function renderPage() {
                grid.replaceChildren();
                const totalItems = allKnowledgeData.length;
                if (totalItems === 0) {
                    const status = document.createElement('div');
                    status.className = 'status-message';
                    status.textContent = '目前尚無知識庫文章資料。';
                    grid.appendChild(status);
                    if (paginationBox) paginationBox.style.display = 'none';
                    return;
                }

                const startIndex = (currentPage - 1) * itemsPerPage;
                const pageData = allKnowledgeData.slice(startIndex, startIndex + itemsPerPage);
                pageData.forEach(function (item, index) {
                    const realIndex = startIndex + index;
                    const title = item.title || '未命名文章';
                    const tag = item.categoryTag || '未分類';
                    const card = document.createElement('article');
                    card.className = 'journal-card';
                    card.tabIndex = 0;
                    card.setAttribute('role', 'link');
                    card.setAttribute('aria-label', '閱讀知識文章：' + title);

                    const imageBox = document.createElement('div');
                    imageBox.className = 'card-img-box';
                    if (item.imgName) {
                        const image = document.createElement('img');
                        image.src = './images/' + item.imgName;
                        image.alt = title;
                        image.loading = 'lazy';
                        image.addEventListener('error', function () {
                            image.remove();
                            showImagePlaceholder(imageBox);
                        }, { once: true });
                        imageBox.appendChild(image);
                    } else {
                        showImagePlaceholder(imageBox);
                    }

                    const tagElement = document.createElement('div');
                    tagElement.className = 'card-category-tag';
                    tagElement.textContent = tag;
                    const titleElement = document.createElement('div');
                    titleElement.className = 'card-title-text';
                    titleElement.textContent = title;
                    card.appendChild(imageBox);
                    card.appendChild(tagElement);
                    card.appendChild(titleElement);

                    function openArticle() {
                        window.location.href = './knowledge-detail.html?id=' + encodeURIComponent(realIndex);
                    }
                    card.addEventListener('click', openArticle);
                    card.addEventListener('keydown', function (event) {
                        if (event.key === 'Enter' || event.key === ' ') {
                            event.preventDefault();
                            openArticle();
                        }
                    });
                    grid.appendChild(card);
                });
                renderPagination(totalItems);
            }

            function showImagePlaceholder(imageBox) {
                const placeholder = document.createElement('span');
                placeholder.textContent = '圖片';
                placeholder.style.color = '#888';
                placeholder.style.fontSize = '1.2rem';
                imageBox.appendChild(placeholder);
            }

            function renderPagination(totalItems) {
                const totalPages = Math.ceil(totalItems / itemsPerPage);
                if (!paginationBox || !pageNumbers || !prevBtn || !nextBtn) return;
                if (totalPages <= 1) {
                    paginationBox.style.display = 'none';
                    return;
                }
                paginationBox.style.display = 'flex';
                prevBtn.disabled = currentPage === 1;
                nextBtn.disabled = currentPage === totalPages;
                pageNumbers.replaceChildren();
                for (let page = 1; page <= totalPages; page += 1) {
                    const button = document.createElement('button');
                    button.type = 'button';
                    button.className = 'page-num' + (page === currentPage ? ' active' : '');
                    button.textContent = String(page);
                    button.setAttribute('aria-label', '第 ' + page + ' 頁');
                    if (page === currentPage) button.setAttribute('aria-current', 'page');
                    button.addEventListener('click', function () {
                        currentPage = page;
                        renderPage();
                    });
                    pageNumbers.appendChild(button);
                }
            }

            function changePage(direction) {
                const totalPages = Math.ceil(allKnowledgeData.length / itemsPerPage);
                const nextPage = currentPage + direction;
                if (nextPage >= 1 && nextPage <= totalPages) {
                    currentPage = nextPage;
                    renderPage();
                }
            }
        }

    });
})();