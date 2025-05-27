// Filtro de categorias
        document.querySelectorAll('.category-filter').forEach(filter => {
            filter.addEventListener('click', function() {
                const category = this.getAttribute('data-category');
                
                // Ativa/desativa o botão de filtro
                document.querySelectorAll('.category-filter').forEach(btn => {
                    btn.classList.remove('active');
                });
                this.classList.add('active');
                
                // Mostra o título da categoria selecionada
                document.querySelectorAll('.category-title').forEach(title => {
                    title.classList.remove('active');
                });
                document.getElementById(`${category}-title`).classList.add('active');
                
                // Filtra os produtos
                const allProducts = document.querySelectorAll('.product-card');
                if (category === 'all') {
                    allProducts.forEach(product => {
                        product.style.display = 'block';
                    });
                    document.querySelectorAll('.category-title').forEach(title => {
                        title.classList.remove('active');
                    });
                } else {
                    allProducts.forEach(product => {
                        if (product.getAttribute('data-category') === category) {
                            product.style.display = 'block';
                        } else {
                            product.style.display = 'none';
                        }
                    });
                }
            });
        });

        // Botão "Todos os produtos" (logo)
        document.getElementById('all-products').addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove filtros
            document.querySelectorAll('.category-filter').forEach(btn => {
                btn.classList.remove('active');
            });
            
            document.querySelectorAll('.category-title').forEach(title => {
                title.classList.remove('active');
            });
            
            // Mostra todos os produtos
            document.querySelectorAll('.product-card').forEach(product => {
                product.style.display = 'block';
            });
        });

// Configuração do Firebase (substitua com suas credenciais)
const firebaseConfig = {
    apiKey: "AIzaSyAV89KI7W-3PnT3l73u2XSEYULY6s1D5Iw",
    authDomain: "loja-virtual-502f1.firebaseapp.com",
    projectId: "loja-virtual-502f1",
    storageBucket: "loja-virtual-502f1.firebasestorage.app",
    messagingSenderId: "462123732485",
    appId: "1:462123732485:web:e46f3e7aa69dc68c0b966c",
    measurementId: "G-H2GP6VX4T6"
  };


// Inicializa o Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();


        // Elementos da DOM
        const loginButton = document.getElementById('login-button');
        const authSection = document.getElementById('auth-section');
        const loginModal = document.getElementById('login-modal');
        const closeModal = document.getElementById('close-modal');
        const submitLogin = document.getElementById('submit-login');
        const loginEmail = document.getElementById('login-email');
        const loginPassword = document.getElementById('login-password');
        const searchInput = document.getElementById('search-input');
        const searchButton = document.getElementById('search-button');
        const allProductsBtn = document.getElementById('all-products');
        const categoryFilters = document.querySelectorAll('.category-filter');
        const productCards = document.querySelectorAll('.product-card');
        const categoryTitles = document.querySelectorAll('.category-title');

        // Função para filtrar produtos por categoria
        function filterByCategory(category) {
            productCards.forEach(card => {
                if (category === 'all') {
                    card.style.display = 'block';
                } else {
                    card.style.display = card.dataset.category === category ? 'block' : 'none';
                }
            });

            categoryTitles.forEach(title => title.classList.remove('active'));
            if (category !== 'all') {
                document.getElementById(`${category}-title`).classList.add('active');
            }
        }

        // Função para buscar produtos
        function searchProducts() {
            const searchTerm = searchInput.value.toLowerCase();
            
            productCards.forEach(card => {
                const title = card.querySelector('.product-title').textContent.toLowerCase();
                const description = card.querySelector('.product-description').textContent.toLowerCase();
                
                if (title.includes(searchTerm) || description.includes(searchTerm)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });

            categoryTitles.forEach(title => title.classList.remove('active'));
        }

        // Event Listeners
        categoryFilters.forEach(filter => {
            filter.addEventListener('click', function() {
                categoryFilters.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                filterByCategory(this.dataset.category);
            });
        });

        allProductsBtn.addEventListener('click', function(e) {
            e.preventDefault();
            categoryFilters.forEach(btn => btn.classList.remove('active'));
            categoryTitles.forEach(title => title.classList.remove('active'));
            filterByCategory('all');
            searchInput.value = '';
        });

        searchButton.addEventListener('click', searchProducts);
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') searchProducts();
        });

        // Login Modal
        loginButton.addEventListener('click', () => {
            loginModal.style.display = 'flex';
        });

        closeModal.addEventListener('click', () => {
            loginModal.style.display = 'none';
        });

        window.addEventListener('click', (e) => {
            if (e.target === loginModal) {
                loginModal.style.display = 'none';
            }
        });

        // Firebase Auth
        submitLogin.addEventListener('click', () => {
            const email = loginEmail.value;
            const password = loginPassword.value;
            
            auth.signInWithEmailAndPassword(email, password)
                .then((userCredential) => {
                    updateUI(userCredential.user);
                    loginModal.style.display = 'none';
                })
                .catch((error) => {
                    alert("Erro ao fazer login: " + error.message);
                });
        });

        auth.onAuthStateChanged((user) => {
            if (user) {
                updateUI(user);
            } else {
                authSection.innerHTML = '<button class="auth-button" id="login-button">Login</button>';
                document.getElementById('login-button').addEventListener('click', () => {
                    loginModal.style.display = 'flex';
                });
            }
        });

        function updateUI(user) {
            authSection.innerHTML = `
                <div class="user-info">
                    <span class="user-email">${user.email}</span>
                    <button class="logout-button" id="logout-button">Sair</button>
                </div>
            `;
            
            document.getElementById('logout-button').addEventListener('click', () => {
                auth.signOut();
            });
        }
