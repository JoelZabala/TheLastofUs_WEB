// Function to load cart items from localStorage and display them
	function loadCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItemsDiv = document.getElementById('cart-items');
    let totalPrice = 0;

    // Clear existing items in case this function is called again
    cartItemsDiv.innerHTML = '';

    cart.forEach((item, index) => {
        const itemDiv = document.createElement('div');
        itemDiv.innerHTML = `
            <div style="display: flex; align-items: center; margin-bottom: 10px;">
                <p>${item.productName} - $${item.price} 
                <button onclick="removeFromCart(${index})">Remove</button></p>
            </div>`;
        cartItemsDiv.appendChild(itemDiv);

        totalPrice += item.price; // No quantity multiplication
    });

    // Display total price
    document.getElementById('total-price').innerText = totalPrice.toFixed(2); // Display total as a fixed 2 decimal number

    return totalPrice; // Return total price to use in PayPal transaction
}

// Function to remove an item from the cart
function removeFromCart(index) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Remove item at the specified index
    cart.splice(index, 1);

    // Save the updated cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));

    // Reload the cart display
    loadCart();
}

// Load cart when the page loads
window.onload = function () {
    const totalPrice = loadCart();

    // Render the PayPal button
    paypal.Buttons({
        createOrder: function (data, actions) {
            return actions.order.create({
                purchase_units: [{
                    amount: {
                        value: totalPrice.toFixed(2) 
                    }
                }]
				
            });
        },
        onApprove: function (data, actions) {
            return actions.order.capture().then(function (details) {
                localStorage.removeItem('cart');
                window.location.href = "confirmation.html";
            });
        },
        onError: function (err) {
            console.error(err);
            alert('Payment could not be processed.');
        }
    }).render('#paypal-button-container'); // Display PayPal button
	
}
