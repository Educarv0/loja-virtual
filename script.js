
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
        // Elementos da DOM
        const loginButton = document.getElementById('login-button');
        const authSection = document.getElementById('auth-section');
        const loginModal = document.getElementById('login-modal');
        const closeModal = document.getElementById('close-modal');
        const submitLogin = document.getElementById('submit-login');
        const loginEmail = document.getElementById('login-email');
        const loginPassword = document.getElementById('login-password');
        const loginError = document.getElementById('login-error');
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
            const searchTerm = searchInput.value.toLowerCase().trim();
            
            if (searchTerm === '') {
                filterByCategory('all');
                categoryFilters.forEach(btn => btn.classList.remove('active'));
                return;
            }
            
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
                searchInput.value = '';
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
            loginError.style.display = 'none';
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
            const email = loginEmail.value.trim();
            const password = loginPassword.value.trim();
            
            if (!email || !password) {
                loginError.textContent = "Por favor, preencha todos os campos";
                loginError.style.display = 'block';
                return;
            }
            
            auth.signInWithEmailAndPassword(email, password)
                .then((userCredential) => {
                    updateUI(userCredential.user);
                    loginModal.style.display = 'none';
                    loginEmail.value = '';
                    loginPassword.value = '';
                })
                .catch((error) => {
                    loginError.textContent = getLoginErrorMessage(error.code);
                    loginError.style.display = 'block';
                });
        });

        function getLoginErrorMessage(errorCode) {
            switch(errorCode) {
                case 'auth/invalid-email':
                    return "Email inválido";
                case 'auth/user-disabled':
                    return "Usuário desativado";
                case 'auth/user-not-found':
                    return "Usuário não encontrado";
                case 'auth/wrong-password':
                    return "Senha incorreta";
                default:
                    return "Erro ao fazer login";
            }
        }

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

        // Inicialização
        filterByCategory('all');
