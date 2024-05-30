document.addEventListener('DOMContentLoaded', function() {
    const products = [
        { name: 'Course 1', price: 10 },
        { name: 'Course 2', price: 15 },
        { name: 'Course 3', price: 20 },
        { name: 'Course 4', price: 25 },
        { name: 'Course 5', price: 30 }
    ];

    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    // 确保函数名和调用一致，原代码中调用了 non-existent 函数
    function renderProducts() {
        let productList = '';
        for (let product of products) {
            productList += `
                <div class="product">
                    <h3>${product.name}</h3>
                    <p>$${product.price}</p>
                    <!-- 修改input的id为动态的，避免重复 -->
                    <input type="number" id="quantity-${products.indexOf(product)}" value="1" min="1">
                    <button class="add-to-cart" data-product="${product.name}">Add to Cart</button>
                </div>
            `;
        }
        document.getElementById('products').innerHTML = productList;
    }

    function renderCart() {
        let cartList = '';
        let total = 0;
        for (let [index, item] of cart.entries()) {
            total += item.quantity * item.product.price;
            cartList += `
                <p>${item.product.name} x ${item.quantity}</p>
                <button class="remove-item" data-index="${index}">Remove</button>
            `;
        }
        document.getElementById('cart').innerHTML = cartList;
        document.getElementById('total').innerText = '$' + total.toFixed(2);
    }

    // 修改事件委托，直接在products元素上监听click事件
    document.getElementById('products').addEventListener('click', function(e) {
        if (e.target.classList.contains('add-to-cart')) {
            const productName = e.target.getAttribute('data-product');
            const product = products.find(p => p.name === productName);
            const quantityInput = document.getElementById(`quantity-${products.indexOf(product)}`);
            const quantity = parseInt(quantityInput.value, 10);

            const existingItem = cart.find(item => item.product.name === productName);

            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                cart.push({ product, quantity });
            }
            localStorage.setItem('cart', JSON.stringify(cart));
            renderCart();
        }
    });

    document.getElementById('cart').addEventListener('click', function(e) {
        if (e.target.classList.contains('remove-item')) {
            const index = parseInt(e.target.getAttribute('data-index'), 10);
            cart.splice(index, 1);
            localStorage.setItem('cart', JSON.stringify(cart));
            renderCart();
        }
    });

    document.getElementById('checkout').addEventListener('click', checkout);
    // 假设页面中有一个清除购物车的按钮，这里需要在HTML中添加对应ID的元素
    document.getElementById('clearCart').addEventListener('click', clearCart);

    renderProducts();
    renderCart();

    function checkout() {
        alert('Thank you for your purchase!');
        clearCart();
    }

    function clearCart() {
        cart.length = 0;
        localStorage.removeItem('cart');
        renderCart();
    }
});