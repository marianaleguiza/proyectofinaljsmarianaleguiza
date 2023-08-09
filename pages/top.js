const fetchData = async () => {
    try {
        const response = await fetch('products.json');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        products = data;
        pintarCard(data);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};

window.addEventListener('load', () => {
    fetchData();
});


let addPrice = 0;
let monthPayments = 3;
let cartItems = [];

const gallery = document.querySelector(".grid-gallery");

function pintarCard(products) {
    products.forEach(product => {
        const div = document.createElement("div");
        div.classList = 'img' + product.id;

        div.innerHTML = `
            <a href="${product.thumbnailUrl}">
                <img class="img${product.id}" src="${product.thumbnailUrl}" alt="${product.title}">
                <h4>${product.title}</h4>
            </a>
            <p>${product.price}</p>
            <button class="addBtn" type="button" id="${product.id}">Add To Cart</button>
        `;

        gallery.appendChild(div);
    });

    const buttons = document.querySelectorAll(".addBtn");

    buttons.forEach(btn => btn.addEventListener("click", () => addToCart(btn.id)));
}


function addToCart(id) {
    const selectedProduct = products.find(prod => prod.id == id);

    if (selectedProduct) {
        const clonedProduct = { ...selectedProduct }; 
        cartItems.push(clonedProduct);
        displayCart();
        localStorage.setItem("cart", JSON.stringify(cartItems));
        calculate(cartItems);
    }
}


function displayCart() {
    const cartItemsDiv = document.getElementById("cart-items");

    cartItemsDiv.innerHTML = "";

    if (cartItems.length === 0) {
        cartItemsDiv.innerHTML = "<p>No items in the cart.</p>";
    } else {
        cartItems.forEach((item) => {
            const cartItem = document.createElement("div");
            cartItem.classList.add("cart-item");
            cartItem.innerHTML = ` <p > ${item.title} added to cart  ($${item.price} IVA included)</p></p>
            `;
            cartItemsDiv.appendChild(cartItem);
        });
    }
}

function calculate(cartItems) {
    let totalWithoutIva = 0;
    let subtotal = 0;
    let monthPaymentSubtotal = 0;
    const discount = 0.1;

    const cartSummaryDiv = document.getElementById("cart-summary");
    cartSummaryDiv.innerHTML = "";

    cartItems.forEach((item) => {
        const cartProduct = products.find((p) => p.id === item.id);

        if (cartProduct) {
            cartProduct.price += cartProduct.price * 0.21;
            totalWithoutIva += cartProduct.price - cartProduct.price * 0.21;

            if (cartProduct.price >= 20000) {
                cartProduct.price -= cartProduct.price * discount;
            }

            subtotal += cartProduct.price;
            monthPaymentSubtotal += cartProduct.price;
        }
    });

    const totalWithoutIvaInfo = document.createElement("p");
    totalWithoutIvaInfo.textContent = `Suma total: ARS$${totalWithoutIva}`;
    cartSummaryDiv.appendChild(totalWithoutIvaInfo);
    
}
const openCartButton = document.querySelector(".open-cart-button");
const cartContainer = document.querySelector(".cart-container");

openCartButton.addEventListener("click", () => {
    cartContainer.classList.toggle("cart-open");
});

const emptyCartButton = document.querySelector(".empty-cart-button");

emptyCartButton.addEventListener("click", () => {
    cartItems = []; 
    displayCart(); 
    localStorage.removeItem("cart");
    calculate(cartItems); 
});







