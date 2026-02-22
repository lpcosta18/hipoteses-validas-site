// header.js - Carrega header e footer em todas as páginas
(function() {
    console.log('📋 header.js iniciado');
    
    function loadComponents() {
        console.log('📋 A carregar componentes...');
        
        // Mostrar conteúdo imediatamente (caso algo falhe)
        document.body.style.opacity = 1;
        
        // Carregar header
        fetch('header.html')
            .then(response => {
                if (!response.ok) throw new Error('Header não encontrado');
                return response.text();
            })
            .then(headerHTML => {
                // Inserir header no início do body
                const headerElement = document.createElement('div');
                headerElement.innerHTML = headerHTML;
                document.body.insertBefore(headerElement.firstElementChild, document.body.firstChild);
                console.log('✅ Header carregado');
                
                // Carregar footer
                return fetch('footer.html');
            })
            .then(response => {
                if (!response.ok) throw new Error('Footer não encontrado');
                return response.text();
            })
            .then(footerHTML => {
                // Inserir footer no fim do body
                const footerElement = document.createElement('div');
                footerElement.innerHTML = footerHTML;
                document.body.appendChild(footerElement.firstElementChild);
                console.log('✅ Footer carregado');
                
                // Atualizar menu ativo
                updateActiveMenu();
                
                // Inicializar menu mobile
                initMobileMenu();
            })
            .catch(error => {
                console.error('❌ Erro:', error);
                // Criar header/footer de emergência
                createEmergencyHeader();
                createEmergencyFooter();
            });
    }
    
    function updateActiveMenu() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        console.log('📌 Página atual:', currentPage);
        
        document.querySelectorAll('.nav-link, .mobile-link').forEach(link => {
            const linkHref = link.getAttribute('href');
            link.classList.remove('active');
            if (linkHref === currentPage) {
                link.classList.add('active');
            }
        });
    }
    
    function initMobileMenu() {
        const menuBtn = document.querySelector('.menu-mobile-btn');
        const menuMobile = document.querySelector('.menu-mobile');
        
        if (menuBtn && menuMobile) {
            console.log('🍔 Menu mobile encontrado');
            
            menuBtn.addEventListener('click', function() {
                this.classList.toggle('active');
                menuMobile.classList.toggle('active');
            });
        }
    }
    
    function createEmergencyHeader() {
        const emergencyHeader = `
            <header style="background: #333; padding: 1rem; color: white; text-align: center;">
                <a href="index.html" style="color: #c59e43; margin-right: 1rem;">Início</a>
                <a href="sobre.html" style="color: white; margin-right: 1rem;">Sobre</a>
                <a href="servicos.html" style="color: white; margin-right: 1rem;">Serviços</a>
                <a href="contacto.html" style="color: white;">Contactos</a>
            </header>
        `;
        document.body.insertAdjacentHTML('afterbegin', emergencyHeader);
    }
    
    function createEmergencyFooter() {
        const emergencyFooter = `
            <footer style="background: #333; color: white; padding: 2rem; text-align: center;">
                <p>📞 968 481 817</p>
                <p>geral@hipoteses-validas.pt</p>
                <p>Rua Joaquim Maria Simões, 1, Torres Vedras</p>
                <p>© 2026 Hipóteses Válidas</p>
            </footer>
        `;
        document.body.insertAdjacentHTML('beforeend', emergencyFooter);
    }
    
    // Iniciar
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadComponents);
    } else {
        loadComponents();
    }
})();