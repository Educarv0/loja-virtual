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
const homePage = document.getElementById('home-page');
const categoryLinks = document.querySelectorAll('.category-link');
const categoryPages = {
    'camisas': document.getElementById('camisas-page'),
    'tenis': document.getElementById('tenis-page'),
    'acessorios': document.getElementById('acessorios-page')
};

// Navegação entre categorias
categoryLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const category = link.getAttribute('data-category');
        
        // Esconde todas as páginas
        homePage.style.display = 'none';
        Object.values(categoryPages).forEach(page => {
            page.style.display = 'none';
        });
        
        // Mostra a página da categoria selecionada
        categoryPages[category].style.display = 'block';
    });
});

// Voltar para home ao clicar no logo
document.querySelector('.logo').addEventListener('click', (e) => {
    e.preventDefault();
    homePage.style.display = 'block';
    Object.values(categoryPages).forEach(page => {
        page.style.display = 'none';
    });
});

// Abrir modal de login
loginButton.addEventListener('click', () => {
    loginModal.style.display = 'flex';
});

// Fechar modal de login
closeModal.addEventListener('click', () => {
    loginModal.style.display = 'none';
});

// Fechar modal ao clicar fora
window.addEventListener('click', (event) => {
    if (event.target === loginModal) {
        loginModal.style.display = 'none';
    }
});

// Realizar login
submitLogin.addEventListener('click', () => {
    const email = loginEmail.value;
    const password = loginPassword.value;
    
    auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Login bem-sucedido
            const user = userCredential.user;
            updateUI(user);
            loginModal.style.display = 'none';
        })
        .catch((error) => {
            alert("Erro ao fazer login: " + error.message);
        });
});

// Verificar estado de autenticação
auth.onAuthStateChanged((user) => {
    if (user) {
        // Usuário está logado
        updateUI(user);
    } else {
        // Usuário não está logado
        authSection.innerHTML = '<button class="auth-button" id="login-button">Login</button>';
        document.getElementById('login-button').addEventListener('click', () => {
            loginModal.style.display = 'flex';
        });
    }
});

// Atualizar a UI com as informações do usuário
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
