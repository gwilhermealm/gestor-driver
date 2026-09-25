// src/login.js

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const btnLogin = document.getElementById('btnLogin');
  const togglePasswordBtn = document.getElementById('togglePassword');
  const eyeIcon = document.getElementById('eyeIcon');

  // Alternar visibilidade da senha (mostrar / ocultar)
  if (togglePasswordBtn && passwordInput && eyeIcon) {
    togglePasswordBtn.addEventListener('click', () => {
      const isPassword = passwordInput.type === 'password';
      passwordInput.type = isPassword ? 'text' : 'password';
      eyeIcon.textContent = isPassword ? 'visibility_off' : 'visibility';
    });
  }

  // Evento de submit para realizar o login no Supabase
  if (loginForm) {
    loginForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      const email = emailInput.value.trim();
      const password = passwordInput.value;

      if (!email || !password) {
        alert('Por favor, preencha o e-mail e a senha.');
        return;
      }

      // Desabilita o botão e exibe estado de carregamento
      const btnText = btnLogin ? btnLogin.querySelector('span') : null;
      const textOriginal = btnText ? btnText.textContent : '';
      if (btnText) btnText.textContent = 'Entrando...';
      if (btnLogin) btnLogin.disabled = true;

      try {
        // Chamada à API de Autenticação do Supabase
        const { data, error } = await supabaseClient.auth.signInWithPassword({
          email: email,
          password: password,
        });

        if (error) {
          alert('Erro no login: ' + error.message);
          if (btnText) btnText.textContent = textOriginal;
          if (btnLogin) btnLogin.disabled = false;
          return;
        }

        console.log('Login efetuado com sucesso:', data.user);
        
        // Redireciona o usuário logado para o App Principal
        window.location.href = 'app.html';

      } catch (err) {
        console.error('Exceção ao autenticar:', err);
        alert('Ocorreu um erro ao tentar entrar. Tente novamente em instantes.');
        if (btnText) btnText.textContent = textOriginal;
        if (btnLogin) btnLogin.disabled = false;
      }
    });
  }
});