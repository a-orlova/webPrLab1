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
addCartToHTML();

function addCartToHTML(){

    let listCartHTML = document.querySelector('.returnCart .list');
    if(!listCartHTML) return;
    listCartHTML.innerHTML = '';

    let totalQuantityHTML = document.querySelector('.totalQuantity');
    let totalPriceHTML = document.querySelector('.totalPrice');
    let totalQuantity = 0;
    let totalPrice = 0;
    if(listCart){
        listCart.forEach(product => {
            if(product){
                let newCart = document.createElement('div');
                newCart.classList.add('item');
                newCart.innerHTML = 
                    `<img src="${product.image}">
                    <div class="info">
                        <div class="name">${product.name}</div>
                        <div class="price">$${product.price}/1 product</div>
                    </div>
                    <div class="quantity">${product.quantity}</div>
                    <div class="returnPrice">$${product.price * product.quantity}</div>`;
                listCartHTML.appendChild(newCart);
                totalQuantity = totalQuantity + product.quantity;
                totalPrice = totalPrice + (product.price * product.quantity);
            }
        })
    }
    if(totalQuantityHTML) totalQuantityHTML.innerText = totalQuantity;
    if(totalPriceHTML) totalPriceHTML.innerText = '$' + totalPrice;
}

let orderModal = document.getElementById('orderModal');
let orderOkBtn = document.getElementById('orderOkBtn');
let placeOrderBtn = document.querySelector('.buttonCheckout'); 

if(placeOrderBtn){
    placeOrderBtn.addEventListener('click', (e) => {
        e.preventDefault(); 
        orderModal.style.display = 'flex';
    });
}

if(orderOkBtn){
    orderOkBtn.addEventListener('click', () => {
        listCart = [];
        localStorage.removeItem('listCart');

        orderModal.style.display = 'none';
        window.location.href = 'index.html';
    });
}