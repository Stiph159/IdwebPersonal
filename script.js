// ====== VARIABLES GLOBALES ======
let cart = JSON.parse(localStorage.getItem('gototechCart')) || [];

// ====== DOM CARGADO ======
document.addEventListener("DOMContentLoaded", () => {
    // Actualizar contador del carrito
    updateCartCount();
    
    // Cargar productos si estamos en la página de carrito
    if (document.getElementById('cart-items')) {
        loadCartItems();
        updateCartTotal();
    }
    
    // Configurar formulario de contacto
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmit);
    }
    
    // Configurar menú móvil
    const menuBtn = document.getElementById('menuBtn');
    if (menuBtn) {
        menuBtn.addEventListener('click', () => {
            const nav = document.querySelector('.nav');
            nav.classList.toggle('active');
        });
    }
    
    // Animación de scroll
    setupScrollAnimation();
    
    // Efecto 3D en cards
    setup3DCards();
    
    // Pulsar botón de WhatsApp
    setupWhatsAppPulse();
    
    // Configurar botones de cantidad en carrito
    setupQuantityButtons();
});

// ====== FUNCIÓN: ACTUALIZAR CONTADOR DEL CARRITO ======
function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
}

// ====== FUNCIÓN: AGREGAR AL CARRITO ======
function addToCart(product) {
    // Verificar si el producto ya está en el carrito
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    // Guardar en localStorage
    localStorage.setItem('gototechCart', JSON.stringify(cart));
    
    // Actualizar contador
    updateCartCount();
    
    // Mostrar notificación
    showNotification('Producto agregado al carrito');
    
    // Actualizar carrito si estamos en esa página
    if (document.getElementById('cart-items')) {
        loadCartItems();
        updateCartTotal();
    }
}

// ====== FUNCIÓN: ELIMINAR DEL CARRITO ======
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('gototechCart', JSON.stringify(cart));
    updateCartCount();
    loadCartItems();
    updateCartTotal();
    showNotification('Producto eliminado del carrito');
}

// ====== FUNCIÓN: ACTUALIZAR CANTIDAD ======
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity < 1) {
            removeFromCart(productId);
            return;
        }
        localStorage.setItem('gototechCart', JSON.stringify(cart));
        updateCartCount();
        loadCartItems();
        updateCartTotal();
    }
}

// ====== FUNCIÓN: CARGAR ITEMS DEL CARRITO ======
function loadCartItems() {
    const cartItemsContainer = document.getElementById('cart-items');
    if (!cartItemsContainer) return;
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart fa-3x"></i>
                <h3>Tu carrito está vacío</h3>
                <p>Agrega productos desde la sección de accesorios</p>
                <a href="accesorios.html" class="btn-secondary">Ver productos</a>
            </div>
        `;
        return;
    }
    
    cartItemsContainer.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-details">
                <h3>${item.name}</h3>
                <p>${item.description}</p>
                <p class="price">S/. ${item.price.toFixed(2)}</p>
            </div>
            <div class="cart-quantity">
                <button class="quantity-btn" onclick="updateQuantity('${item.id}', -1)">-</button>
                <span>${item.quantity}</span>
                <button class="quantity-btn" onclick="updateQuantity('${item.id}', 1)">+</button>
            </div>
            <button class="btn-danger" onclick="removeFromCart('${item.id}')">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `).join('');
}

// ====== FUNCIÓN: ACTUALIZAR TOTAL DEL CARRITO ======
function updateCartTotal() {
    const totalElement = document.getElementById('cart-total');
    if (totalElement) {
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        totalElement.textContent = `S/. ${total.toFixed(2)}`;
    }
}

// ====== FUNCIÓN: MANEJAR ENVÍO DE FORMULARIO ======
async function handleContactSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const submitBtn = form.querySelector('button[type="submit"]');
    
    // Deshabilitar botón durante el envío
    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviando...';
    
    try {
        // En un entorno real, aquí enviarías los datos al servidor
        // Por ahora simulamos una petición exitosa
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Mostrar mensaje de éxito
        showNotification('Mensaje enviado correctamente. Te contactaremos pronto.', 'success');
        
        // Limpiar formulario
        form.reset();
        
        // En un entorno real con Python, aquí enviaríamos los datos
        // fetch('/api/contact', { method: 'POST', body: formData })
        
    } catch (error) {
        showNotification('Error al enviar el mensaje. Intenta nuevamente.', 'error');
    } finally {
        // Rehabilitar botón
        submitBtn.disabled = false;
        submitBtn.textContent = 'Enviar Mensaje';
    }
}

// ====== FUNCIÓN: ANIMACIÓN DE SCROLL ======
function setupScrollAnimation() {
    const scrollElements = document.querySelectorAll('.service-card, .card, .feature, .gallery-item');
    
    const elementInView = (el, offset = 0) => {
        const elementTop = el.getBoundingClientRect().top;
        return elementTop <= (window.innerHeight || document.documentElement.clientHeight) - offset;
    };
    
    const displayScrollElement = (el) => {
        el.classList.add('scrolled');
    };
    
    const handleScrollAnimation = () => {
        scrollElements.forEach(el => {
            if (elementInView(el, 100)) {
                displayScrollElement(el);
            }
        });
    };
    
    // Animar elementos visibles al cargar
    handleScrollAnimation();
    
    // Animar al hacer scroll
    window.addEventListener('scroll', handleScrollAnimation);
}

// ====== FUNCIÓN: EFECTO 3D EN CARDS ======
function setup3DCards() {
    const cards = document.querySelectorAll('.service-card, .card, .feature');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const cx = rect.width / 2;
            const cy = rect.height / 2;
            const dx = (x - cx) / 20;
            const dy = (y - cy) / 20;
            
            card.style.transform = `rotateY(${dx}deg) rotateX(${-dy}deg) translateY(-5px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = `rotateY(0deg) rotateX(0deg) translateY(0px)`;
        });
    });
}

// ====== FUNCIÓN: PULSAR BOTÓN WHATSAPP ======
function setupWhatsAppPulse() {
    const whatsappBtn = document.querySelector('.whatsapp-btn');
    if (whatsappBtn) {
        setInterval(() => {
            whatsappBtn.classList.toggle('pulse');
        }, 2000);
    }
}

// ====== FUNCIÓN: BOTONES DE CANTIDAD ======
function setupQuantityButtons() {
    // Los botones ya se manejan con onclick en el HTML
}

// ====== FUNCIÓN: MOSTRAR NOTIFICACIÓN ======
function showNotification(message, type = 'info') {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Estilos para la notificación
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#17a2b8'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        gap: 10px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        z-index: 9999;
        animation: slideIn 0.3s ease;
    `;
    
    // Agregar al documento
    document.body.appendChild(notification);
    
    // Remover después de 3 segundos
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// ====== PRODUCTOS DE EJEMPLO PARA EL CARRITO ======
const sampleProducts = [
    {
        id: '1',
        name: 'Teclado Mecánico RGB',
        description: 'Teclado gaming con retroiluminación RGB',
        price: 150.00,
        image: 'https://via.placeholder.com/80/0076ff/ffffff?text=Teclado'
    },
    {
        id: '2',
        name: 'Mouse Inalámbrico',
        description: 'Mouse ergonómico con conexión Bluetooth',
        price: 80.00,
        image: 'https://via.placeholder.com/80/0076ff/ffffff?text=Mouse'
    },
    {
        id: '3',
        name: 'Audífonos Gaming',
        description: 'Audífonos con micrófono y sonido envolvente',
        price: 200.00,
        image: 'https://via.placeholder.com/80/0076ff/ffffff?text=Audifonos'
    }
];

// Función para agregar productos de ejemplo (usar en páginas de productos)
function addSampleProduct(productId) {
    const product = sampleProducts.find(p => p.id === productId);
    if (product) {
        addToCart(product);
    }
}

// ====== ESTILOS DINÁMICOS PARA NOTIFICACIONES ======
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .empty-cart {
        text-align: center;
        padding: 50px 20px;
        color: #666;
    }
    
    .empty-cart i {
        color: #0076ff;
        margin-bottom: 20px;
    }
`;
document.head.appendChild(style);

// ====== FUNCIONES PARA EL CARRITO ======

// Función global para agregar al carrito
function addToCart(product) {
    // Obtener carrito actual
    let cart = JSON.parse(localStorage.getItem('gototechCart')) || [];
    
    // Verificar si el producto ya está en el carrito
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    // Guardar en localStorage
    localStorage.setItem('gototechCart', JSON.stringify(cart));
    
    // Actualizar contador
    updateCartCount();
    
    // Mostrar notificación
    showNotification(`${product.name} agregado al carrito`, 'success');
}

// Función para actualizar el contador del carrito
function updateCartCount() {
    const cartCountElements = document.querySelectorAll('#cart-count');
    const cart = JSON.parse(localStorage.getItem('gototechCart')) || [];
    
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    
    cartCountElements.forEach(element => {
        element.textContent = totalItems;
    });
}

// Función para mostrar notificaciones
function showNotification(message, type = 'success') {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Estilos
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#28a745' : '#17a2b8'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        gap: 10px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        z-index: 9999;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Remover después de 3 segundos
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Agregar estilos CSS para las animaciones
if (!document.querySelector('#notification-styles')) {
    const style = document.createElement('style');
    style.id = 'notification-styles';
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// Inicializar contador del carrito cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
});