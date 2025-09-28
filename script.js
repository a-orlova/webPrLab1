let iconCart = document.querySelector('.iconCart');
let cart = document.querySelector('.cart');
let container = document.querySelector('.container');
let close = document.querySelector('.close');

iconCart.addEventListener('click', ()=>{
    if(cart.style.right === '-100%' || cart.style.right === '' || getComputedStyle(cart).right === '-100%'){
        cart.style.right = '0';
        container.style.transform = 'translateX(-400px)';
    }else{
        cart.style.right = '-100%';
        container.style.transform = 'translateX(0)';
    }
})
close && close.addEventListener('click', ()=>{
    cart.style.right = '-100%';
    container.style.transform = 'translateX(0)';
})

let products = null;
fetch('products.json')
.then(response => response.json())
.then(data => {
    products = data;
    addDataToHTML();
})

function addDataToHTML(){
    let listProductHTML = document.querySelector('.listProduct');
    if(!listProductHTML) return;
    listProductHTML.innerHTML = '';

    if(products != null)
    {
        products.forEach(product => {
            let newProduct = document.createElement('div');
            newProduct.classList.add('item');
            newProduct.innerHTML = 
            `<img src="${product.image}">
            <h2>${product.name}</h2>
            <div class="price">$${product.price}</div>
            <button onclick="addCart(${product.id})">add to cart</button>`;

            listProductHTML.appendChild(newProduct);

        });
    }
}

let listCart = [];

function saveCart(){
    try{
        localStorage.setItem('listCart', JSON.stringify(listCart));
    }catch(e){
        console.error('saveCart: failed to save to localStorage', e);
    }
}

function checkCart(){
    const raw = localStorage.getItem('listCart');
    if(raw){
        try{
            listCart = JSON.parse(raw);
            if(!Array.isArray(listCart)){
                const tmp = [];
                Object.keys(listCart).forEach(k => tmp[k] = listCart[k]);
                listCart = tmp;
            }
        }catch(e){
            console.error('checkCart: invalid JSON in localStorage', e);
            listCart = [];
        }
    } else {
        var cookieValue = document.cookie.split('; ').find(row => row.startsWith('listCart='));
        if(cookieValue){
            try{
                const parsed = JSON.parse(cookieValue.split('=')[1]);
                listCart = Array.isArray(parsed) ? parsed : (function(){
                    const tmp = [];
                    Object.keys(parsed).forEach(k => tmp[k] = parsed[k]);
                    return tmp;
                })();
                saveCart();
                document.cookie = "listCart=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            }catch(e){
                console.error('checkCart: failed to parse cookie cart', e);
                listCart = [];
            }
        } else {
            listCart = [];
        }
    }
}
checkCart();
function addCart($idProduct){
    let productsCopy = JSON.parse(JSON.stringify(products));

    if(!listCart[$idProduct]) 
    {
        listCart[$idProduct] = productsCopy.filter(product => product.id == $idProduct)[0];
        listCart[$idProduct].quantity = 1;
    }else{

        listCart[$idProduct].quantity++;
    }
    saveCart();

    addCartToHTML();
}
addCartToHTML();
function addCartToHTML(){

    let listCartHTML = document.querySelector('.listCart');
    if(!listCartHTML) return;
    listCartHTML.innerHTML = '';

    let totalHTML = document.querySelector('.totalQuantity');
    let totalQuantity = 0;

    if(listCart){
        listCart.forEach(product => {
            if(product){
                let newCart = document.createElement('div');
                newCart.classList.add('item');
                newCart.innerHTML = 
                    `<img src="${product.image}">
                    <div class="content">
                        <div class="name">${product.name}</div>
                        <div class="price">$${product.price} / 1 product</div>
                    </div>
                    <div class="quantity">
                        <button onclick="changeQuantity(${product.id}, '-')">-</button>
                        <span class="value">${product.quantity}</span>
                        <button onclick="changeQuantity(${product.id}, '+')">+</button>
                    </div>`;
                listCartHTML.appendChild(newCart);
                totalQuantity = totalQuantity + product.quantity;
            }
        })
    }
    if(totalHTML) totalHTML.innerText = totalQuantity;
}
function changeQuantity($idProduct, $type){
    switch ($type) {
        case '+':
            listCart[$idProduct].quantity++;
            break;
        case '-':
            listCart[$idProduct].quantity--;

            if(listCart[$idProduct].quantity <= 0){
                delete listCart[$idProduct];
            }
            break;
    
        default:
            break;
    }
    saveCart();

    addCartToHTML();
}