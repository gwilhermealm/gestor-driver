 
 // Verifica se o usuário está autenticado logo ao carregar o app
async function validarAcesso() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    window.location.href = 'login.html'; // Chuta de volta para o login se não houver sessão
  }
}
validarAcesso();
 
 
 
 // ==========================================
 //carregar usuario logado
document.addEventListener('DOMContentLoaded', async () => {
  const { data: { user }, error } = await supabaseClient.auth.getUser();

  if (error || !user) {
    console.warn('Sessão inválida ou expirada. Redirecionando...');
    window.location.href = 'login.html';
    return;
  }

  const email = user.email;
  const usernameBruto = email.split('@')[0];
  const nomeFormatado = usernameBruto
    .replace(/[._-]/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase());

  const headerName = document.getElementById('user-name');
  const profileName = document.getElementById('profile-user-name');
  const emailElement = document.getElementById('user-email');

  if (headerName) headerName.textContent = nomeFormatado;
  if (profileName) profileName.textContent = nomeFormatado;
  if (emailElement) emailElement.textContent = email;

  const btnLogout = document.getElementById('btnLogout');
  if (btnLogout) {
    btnLogout.addEventListener('click', async () => {
      await supabaseClient.auth.signOut();
      window.location.href = 'login.html';
    });
  }
});












 
 async function carregarDadosDoTurnoAtual() {
  if (!window.supabase || !supabaseClient) return;

  const dataTurno = document.body.dataset.activeDate || new Date().toISOString().split('T')[0];

  try {
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) {
      console.warn('Sessão inválida ao carregar turno atual. Redirecionando para login...');
      window.location.href = 'login.html';
      return;
    }

    // Busca o turno salvo no banco para a data selecionada do usuário autenticado atual
    const { data: turno, error } = await supabaseClient
      .from('turnos')
      .select('id, ganho_bruto, minutos_online, observacao')
      .eq('usuario_id', user.id)
      .eq('data', dataTurno)
      .maybeSingle();

    if (error && error.code !== 'PGRST116') throw error;

    // Elementos da interface
    const inputGross = document.getElementById('input-gross');
    const inputNotes = document.getElementById('input-expense-notes');
    const notesElement = document.getElementById('dashboard-turn-notes');
    const expenseInputs = document.querySelectorAll('.input-expense');

    // Reseta todos os campos de despesa primeiro
    expenseInputs.forEach(input => input.value = '0.00');

    if (turno) {
      // Preenche os dados do turno encontrado
      if (inputGross) inputGross.value = Number(turno.ganho_bruto || 0).toFixed(2);
      if (inputNotes) inputNotes.value = turno.observacao || '';

      if (notesElement) {
        if (turno.observacao && turno.observacao.trim() !== '') {
          const dataObservacao = new Date(`${dataTurno}T00:00:00`);
          const dataLabel = !Number.isNaN(dataObservacao.getTime())
            ? dataObservacao.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
            : dataTurno;

          notesElement.textContent = `"${turno.observacao}" — ${dataLabel}`;
          notesElement.classList.remove('text-on-surface-variant/60', 'not-italic');
          notesElement.classList.add('text-on-surface', 'italic');
        } else {
          notesElement.textContent = 'Nenhuma observação registada para este turno.';
          notesElement.classList.add('text-on-surface-variant/60');
          notesElement.classList.remove('italic');
        }
      }

      // Atualiza horas e minutos na interface
      const totalMinutos = turno.minutos_online || 0;
      const horas = Math.floor(totalMinutos / 60);
      const minutos = totalMinutos % 60;
      
      const displayHours = document.getElementById('display-hours');
      const displayMins = document.getElementById('display-mins');
      const badgeHoursDecimal = document.getElementById('badge-hours-decimal');

      if (displayHours) displayHours.textContent = horas;
      if (displayMins) displayMins.textContent = minutos === 0 ? '00' : minutos;
      if (badgeHoursDecimal) badgeHoursDecimal.textContent = (totalMinutos / 60).toFixed(1) + ' horas';

      // Busca as despesas vinculadas a esse turno
      const { data: despesas, error: errorDespesas } = await supabaseClient
        .from('despesas')
        .select('categoria, valor')
        .eq('turno_id', turno.id);

      if (!errorDespesas && despesas) {
        despesas.forEach(d => {
          const input = document.querySelector(`.input-expense[data-category="${d.categoria}"]`);
          if (input) input.value = Number(d.valor || 0).toFixed(2);
        });
      }
    } else {
      // Se não houver registro para o dia, zera a tela limpa
      if (inputGross) inputGross.value = '0.00';
      if (inputNotes) inputNotes.value = '';

      if (notesElement) {
        notesElement.textContent = 'Nenhuma observação registada para este turno.';
        notesElement.classList.add('text-on-surface-variant/60');
        notesElement.classList.remove('italic');
      }
      
      const displayHours = document.getElementById('display-hours');
      const displayMins = document.getElementById('display-mins');
      const badgeHoursDecimal = document.getElementById('badge-hours-decimal');
      if (displayHours) displayHours.textContent = '0';
      if (displayMins) displayMins.textContent = '00';
      if (badgeHoursDecimal) badgeHoursDecimal.textContent = '0.0 horas';
    }

    // Recalcula os totais e resumos visuais no cockpit
    if (typeof calculate === 'function') calculate();

  } catch (err) {
    console.error('Erro ao carregar dados do turno selecionado:', err.message);
  }
}
























async function salvarTurnoNoSupabase() {
  const btnSave = document.getElementById('btn-save-record');
  const toast = document.getElementById('toast-success');

  const observacao = document.getElementById('input-expense-notes')?.value.trim() || '';
  
  // 1. Pega a data ativa selecionada pelo componente de data (formato YYYY-MM-DD)
  const dataTurno = document.body.dataset.activeDate || new Date().toISOString().split('T')[0];
  
  // 2. Coleta os valores do formulário
  const ganhoBruto = parseFloat(document.getElementById('input-gross')?.value) || 0;
  
  const displayHours = parseInt(document.getElementById('display-hours')?.textContent) || 0;
  const displayMins = parseInt(document.getElementById('display-mins')?.textContent) || 0;
  const totalMinutos = (displayHours * 60) + displayMins;

  // Desativa o botão temporariamente para evitar múltiplos cliques
  if (btnSave) btnSave.disabled = true;

  try {
    // 3. Obter ID do usuário autenticado (Supabase Auth - Retorna o UUID real)
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    
    if (userError || !user) {
      alert('Sessão expirada. Faça login novamente.');
      if (btnSave) btnSave.disabled = false;
      window.location.href = 'login.html';
      return;
    }

    const usuarioId = user.id; // ✅ Usa o UUID único do motorista logado

    // Busca se já existe turno gravado para essa mesma data
    const { data: turnoExistente, error: errorBuscaTurno } = await supabaseClient
      .from('turnos')
      .select('id')
      .eq('usuario_id', usuarioId)
      .eq('data', dataTurno)
      .maybeSingle();

    if (errorBuscaTurno && errorBuscaTurno.code !== 'PGRST116') {
      throw errorBuscaTurno;
    }

    if (turnoExistente?.id) {
      const { error: errorDeleteAntigo } = await supabaseClient
        .from('despesas')
        .delete()
        .eq('turno_id', turnoExistente.id);

      if (errorDeleteAntigo) {
        console.error('Erro ao apagar despesas antigas do turno atual:', errorDeleteAntigo);
      }
    }

    // 4. Inserir ou Atualizar (UPSERT) na tabela 'turnos'
    const { data: turno, error: errorTurno } = await supabaseClient
      .from('turnos')
      .upsert({
        usuario_id: usuarioId,
        data: dataTurno,
        ganho_bruto: ganhoBruto,
        minutos_online: totalMinutos,
        observacao: observacao
      }, { onConflict: 'usuario_id, data' })
      .select()
      .single();

    if (errorTurno) throw errorTurno;

    const { error: errorDelete } = await supabaseClient
      .from('despesas')
      .delete()
      .eq('turno_id', turno.id);

    if (errorDelete) {
      console.error('Erro ao limpar despesas do turno atual:', errorDelete);
    }

    // 6. Mapear e Inserir as novas despesas com valor > 0
    const despesasMap = new Map();
    document.querySelectorAll('.input-expense').forEach(input => {
      const categoria = String(input.dataset.category || 'outros').trim();
      const valor = parseFloat(input.value) || 0;

      if (categoria && valor > 0) {
        despesasMap.set(categoria, valor);
      }
    });

    const despesasParaInserir = Array.from(despesasMap.entries()).map(([categoria, valor]) => ({
      turno_id: turno.id,
      categoria,
      valor
    }));

    if (despesasParaInserir.length > 0) {
      const { error: errorDespesas } = await supabaseClient
        .from('despesas')
        .insert(despesasParaInserir);

      if (errorDespesas) throw errorDespesas;
    }

    // 7. Animação de sucesso (Toast)
    if (toast) {
      toast.classList.remove('-translate-y-24', 'opacity-0');
      toast.classList.add('translate-y-0', 'opacity-100');

      setTimeout(() => {
        toast.classList.remove('translate-y-0', 'opacity-100');
        toast.classList.add('-translate-y-24', 'opacity-0');
      }, 2500);
    }

    // Recarrega as métricas do dashboard após salvar
    if (typeof window.carregarMétricasDashboard === 'function') {
      await window.carregarMétricasDashboard();
    }

  } catch (err) {
    console.error('Erro ao salvar no Supabase:', err.message);
    alert('Erro ao salvar os dados do turno: ' + err.message);
  } finally {
    if (btnSave) btnSave.disabled = false;
  }
}

// Vincula unicamente o evento de clique ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
  const btnSave = document.getElementById('btn-save-record');
  if (btnSave) {
    btnSave.onclick = function() {
      salvarTurnoNoSupabase();
    };
  }
});












 
 
 
 
 
 
 
 
 
 // Micro-interações táteis nos botões de período
  document.querySelectorAll('section button').forEach(btn => {
    btn.addEventListener('click', function() {
      // Feedback tátil leve através de haptic nativo caso disponível no navegador móvel
      if (window.navigator && window.navigator.vibrate) {
        window.navigator.vibrate(10);
      }
    });
  });


  (function() {
    let hours = 0;
    let mins = 0;

    const inputGross = document.getElementById('input-gross');
    const btnClearGross = document.getElementById('btn-clear-gross');
    const quickAddBtns = document.querySelectorAll('.btn-quick-add');
    const expenseInputs = document.querySelectorAll('.input-expense');
    
    const displayHours = document.getElementById('display-hours');
    const displayMins = document.getElementById('display-mins');
    const badgeHoursDecimal = document.getElementById('badge-hours-decimal');
    const btnSubHours = document.getElementById('btn-sub-hours');
    const btnAddHours = document.getElementById('btn-add-hours');

    const badgeTotalExpenses = document.getElementById('badge-total-expenses');
    const summaryGross = document.getElementById('summary-gross');
    const summaryExpenses = document.getElementById('summary-expenses');
    const summaryNet = document.getElementById('summary-net');
    const formulaHourly = document.getElementById('formula-hourly');
    const summaryHourly = document.getElementById('summary-hourly');
    const btnSave = document.getElementById('btn-save-record');
    const toast = document.getElementById('toast-success');

    function formatBRL(val) {
      return val.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    function calculate() {
      const grossVal = parseFloat(inputGross.value) || 0;
      let totalExpenses = 0;
      expenseInputs.forEach(inp => {
        totalExpenses += parseFloat(inp.value) || 0;
      });

      const netVal = grossVal - totalExpenses;
      const totalHoursDecimal = hours + (mins / 60);

      // Atualiza valores nas métricas
      badgeTotalExpenses.textContent = 'R$ ' + formatBRL(totalExpenses);
      summaryGross.textContent = 'R$ ' + formatBRL(grossVal);
      summaryExpenses.textContent = '- R$ ' + formatBRL(totalExpenses);
      summaryNet.textContent = formatBRL(netVal);

      if (totalHoursDecimal > 0) {
        const hourlyRate = netVal / totalHoursDecimal;
        formulaHourly.textContent = 'R$ ' + formatBRL(netVal) + ' ÷ ' + totalHoursDecimal.toFixed(1) + 'h';
        summaryHourly.textContent = 'R$ ' + formatBRL(Math.max(0, hourlyRate));
      } else {
        formulaHourly.textContent = '0 horas registradas';
        summaryHourly.textContent = 'R$ 0,00';
      }
    }

    // Handlers para botões rápidos de ganho
    quickAddBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const addAmount = parseFloat(btn.getAttribute('data-add')) || 0;
        const currentGross = parseFloat(inputGross.value) || 0;
        inputGross.value = (currentGross + addAmount).toFixed(2);
        calculate();
      });
    });

    btnClearGross.addEventListener('click', () => {
      inputGross.value = '0.00';
      inputGross.focus();
      calculate();
    });

    inputGross.addEventListener('input', calculate);
    expenseInputs.forEach(inp => inp.addEventListener('input', calculate));

    // Controle Stepper de Horas
    function updateHoursUI() {
      displayHours.textContent = hours;
      displayMins.textContent = mins === 0 ? '00' : mins;
      const decimal = (hours + mins / 60).toFixed(1);
      badgeHoursDecimal.textContent = decimal + ' horas';
      calculate();
    }

    btnSubHours.addEventListener('click', () => {
      if (hours === 0 && mins <= 30) return;
      if (mins === 30) {
        mins = 0;
      } else {
        mins = 30;
        hours = Math.max(0, hours - 1);
      }
      updateHoursUI();
    });

    btnAddHours.addEventListener('click', () => {
      if (hours >= 24) return;
      if (mins === 0) {
        mins = 30;
      } else {
        mins = 0;
        hours += 1;
      }
      updateHoursUI();
    });

    // Inicialização
    if (inputGross) inputGross.value = '0.00';
    updateHoursUI();
    calculate();
  })();


  (function() {
    var views = document.querySelectorAll('main > [id^="view-"]');
    var navLinks = document.querySelectorAll('.nav-link');
    var headerSubtitle = document.getElementById('header-subtitle');
    var labels = { dashboard: 'Dashboard', registrar: 'Registrar', historico: 'Histórico', perfil: 'Perfil' };

    function activateTab(path) {
      views.forEach(function(v) { v.style.display = 'none'; });
      var target = document.getElementById('view-' + path);
      if (target) target.style.display = '';

      navLinks.forEach(function(link) {
        var isActive = link.dataset.path === path;
        link.classList.toggle('text-primary', isActive);
        link.classList.toggle('font-bold', isActive);
        link.classList.toggle('text-on-surface-variant', !isActive);
        if (isActive) {
          link.setAttribute('aria-current', 'page');
        } else {
          link.removeAttribute('aria-current');
        }
      });

      if (headerSubtitle) headerSubtitle.textContent = labels[path] || '';
    }

    navLinks.forEach(function(link) {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        activateTab(link.dataset.path);
      });
    });

    // Estado inicial: Dashboard ativo
    activateTab('dashboard');
  })();


  (function() {
  let activeDate = new Date();

  const labelActiveDate = document.getElementById('label-active-date');
  const inputDatePicker = document.getElementById('input-date-picker');
  const btnYesterday = document.getElementById('btn-yesterday');
  const btnToday = document.getElementById('btn-today');

  // Converte o objeto Date para a string no formato 'YYYY-MM-DD'
  function formatDateToISO(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // Formata o texto visível do botão central
  function formatDateToLabel(date) {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const isToday = date.toDateString() === today.toDateString();
    const isYesterday = date.toDateString() === yesterday.toDateString();

    const dayName = date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });

    if (isToday) return `Hoje, ${dayName}`;
    if (isYesterday) return `Ontem, ${dayName}`;
    
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  // Atualiza os elementos da interface e guarda a data ativa no DOM
  function updateDateUI() {
    if (labelActiveDate) {
      labelActiveDate.textContent = formatDateToLabel(activeDate);
    }
    if (inputDatePicker) {
      inputDatePicker.value = formatDateToISO(activeDate);
    }

    // Armazena a data selecionada no dataset do body (ex: '2026-09-25')
    document.body.dataset.activeDate = formatDateToISO(activeDate);
    carregarDadosDoTurnoAtual();
  }

  // Evento: Seleção direta pelo calendário
  if (inputDatePicker) {
    inputDatePicker.addEventListener('change', function(e) {
      if (e.target.value) {
        const parts = e.target.value.split('-');
        activeDate = new Date(parts[0], parts[1] - 1, parts[2]);
        updateDateUI();
      }
    });
  }

  // Evento: Botão "Ontem"
  if (btnYesterday) {
    btnYesterday.addEventListener('click', function() {
      activeDate.setDate(activeDate.getDate() - 1);
      updateDateUI();
    });
  }

  // Evento: Botão "Hoje"
  if (btnToday) {
    btnToday.addEventListener('click', function() {
      activeDate = new Date();
      updateDateUI();
    });
  }

  // Executa ao carregar a página
  updateDateUI();
})();





// ==========================================
// FILTRO DE PERÍODO DO DASHBOARD
// ==========================================
(function() {
  let selectedPeriod = 'month';
  let startDate = null;
  let endDate = null;

  const periodButtons = document.querySelectorAll('.period-btn');
  const customPanel = document.getElementById('custom-period-picker');
  const customStartInput = document.querySelector('[data-custom-start]');
  const customEndInput = document.querySelector('[data-custom-end]');

  function toISO(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  function calculateDateRange(period) {
    const now = new Date();

    if (period === 'today') {
      startDate = toISO(now);
      endDate = toISO(now);
    } else if (period === 'week') {
      const firstDayOfWeek = new Date(now);
      const day = now.getDay() || 7;
      firstDayOfWeek.setDate(now.getDate() - (day - 1));
      startDate = toISO(firstDayOfWeek);
      endDate = toISO(now);
    } else if (period === 'month') {
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      startDate = toISO(firstDayOfMonth);
      endDate = toISO(now);
    } else if (period === 'custom') {
      startDate = customStartInput && customStartInput.value ? customStartInput.value : startDate;
      endDate = customEndInput && customEndInput.value ? customEndInput.value : endDate;
    }

    if (customStartInput) customStartInput.value = startDate || '';
    if (customEndInput) customEndInput.value = endDate || '';
  }

  function setActivePeriodButton(activeButton) {
    periodButtons.forEach((btn) => {
      const isActive = btn === activeButton;
      btn.classList.toggle('bg-primary-container', isActive);
      btn.classList.toggle('text-on-primary-container', isActive);
      btn.classList.toggle('font-bold', isActive);
      btn.classList.toggle('shadow-sm', isActive);
      btn.classList.toggle('bg-surface-container-high', !isActive);
      btn.classList.toggle('text-on-surface-variant', !isActive);
      btn.classList.toggle('hover:text-on-surface', !isActive);

      const dot = btn.querySelector('span.w-1\\.5');
      if (dot) {
        dot.style.visibility = isActive ? 'visible' : 'hidden';
      }
    });
  }

  function formatBRL(value) {
    return Number(value || 0).toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  function setDashboardNumericValues(gross, expenses, net) {
    const dashboardNet = document.getElementById('dashboard-net-value');
    const dashboardGross = document.getElementById('dashboard-gross-value');
    const dashboardExpenses = document.getElementById('dashboard-expenses-value');
    const dashboardMetricGross = document.getElementById('dashboard-metric-gross-value');
    const dashboardMetricExpenses = document.getElementById('dashboard-metric-expenses-value');
    const dashboardProfitRate = document.getElementById('dashboard-profit-rate');
    const summaryGross = document.getElementById('summary-gross');
    const summaryExpenses = document.getElementById('summary-expenses');
    const summaryNet = document.getElementById('summary-net');

    if (dashboardNet) dashboardNet.textContent = 'R$ ' + formatBRL(net);
    if (dashboardGross) dashboardGross.textContent = 'R$ ' + formatBRL(gross);
    if (dashboardMetricGross) dashboardMetricGross.textContent = 'R$ ' + formatBRL(gross);
    if (dashboardExpenses) dashboardExpenses.textContent = 'R$ ' + formatBRL(expenses);
    if (dashboardMetricExpenses) dashboardMetricExpenses.textContent = 'R$ ' + formatBRL(expenses);

    const profitRate = gross > 0 ? (net / gross) * 100 : 0;
    if (dashboardProfitRate) dashboardProfitRate.textContent = `${profitRate.toFixed(1)}%`;

    if (summaryGross) summaryGross.textContent = 'R$ ' + formatBRL(gross);
    if (summaryExpenses) summaryExpenses.textContent = '- R$ ' + formatBRL(expenses);
    if (summaryNet) summaryNet.textContent = 'R$ ' + formatBRL(net);
  }

  function updateAppTimeMetrics(turnos) {
    const totalMinutes = (turnos || []).reduce((sum, turno) => sum + Number(turno.minutos_online || 0), 0);
    const totalHours = totalMinutes / 60;
    const avgHours = (turnos || []).length ? totalHours / (turnos || []).length : 0;

    const appTime = document.getElementById('app-time-total');
    const appAverage = document.getElementById('app-time-average');
    const hourlyRate = document.getElementById('dashboard-hourly-rate');

    if (appTime) {
      const hours = Math.floor(totalHours);
      const minutes = Math.round((totalHours - hours) * 60);
      appTime.textContent = `${hours}h ${String(minutes).padStart(2, '0')}m`;
    }

    if (appAverage) {
      appAverage.textContent = `Média ${(avgHours || 0).toFixed(1)}h/dia`;
    }

    const netValue = (turnos || []).reduce((sum, turno) => sum + Number(turno.ganho_bruto || 0), 0);
    const netAfterExpenses = Number(netValue || 0) - (turnos || []).reduce((sum, turno) => sum + Number(turno.ganho_bruto || 0), 0) * 0.32;

    if (hourlyRate) {
      const hourly = totalHours > 0 ? netAfterExpenses / totalHours : 0;
      hourlyRate.innerHTML = `R$ ${formatBRL(hourly)}<span class="text-xs font-normal text-on-surface-variant">/h</span>`;
    }
  }

  function updateCategoryMetrics(expensesList) {
    const normalizeCategory = (value) => {
      if (value === null || value === undefined) return 'alimentacao';

      return String(value)
        .trim()
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, ' ')
        .trim();
    };

    const categoryMap = {
      combustivel: 'combustivel',
      gasolina: 'combustivel',
      alcool: 'combustivel',
      gas: 'combustivel',
      oleo: 'oleo',
      fluido: 'oleo',
      fluidos: 'oleo',
      manutencao: 'manutencao',
      oficina: 'manutencao',
      peca: 'manutencao',
      emergencia: 'emergencia',
      emergencias: 'emergencia',
      pneu: 'emergencia',
      reboque: 'emergencia',
      pedagio: 'emergencia',
      alimentacao: 'alimentacao',
      lanche: 'alimentacao',
      lanches: 'alimentacao',
      refeicao: 'alimentacao',
      cafe: 'alimentacao',
      agua: 'alimentacao'
    };

    const categoryAmounts = {
      combustivel: 0,
      oleo: 0,
      manutencao: 0,
      emergencia: 0,
      alimentacao: 0
    };

    (expensesList || []).forEach((item) => {
      const rawCategory = normalizeCategory(item.categoria || 'alimentacao');
      const category = categoryMap[rawCategory] || 'alimentacao';
      categoryAmounts[category] = (categoryAmounts[category] || 0) + Number(item.valor || 0);
    });

    const totalExpenses = Object.values(categoryAmounts).reduce((sum, value) => sum + value, 0);
    const totalElement = document.getElementById('category-total-amount');
    if (totalElement) totalElement.textContent = 'R$ ' + formatBRL(totalExpenses);

    const entries = [
      { key: 'combustivel', label: 'Gasolina & Álcool', color: 'tertiary', bar: 'category-gasolina-bar', value: 'category-gasolina-value', percent: 'category-gasolina-percent', donut: 'donut-gasolina' },
      { key: 'manutencao', label: 'Manutenção Preventiva', color: 'secondary-container', bar: 'category-manutencao-bar', value: 'category-manutencao-value', percent: 'category-manutencao-percent', donut: 'donut-manutencao' },
      { key: 'alimentacao', label: 'Alimentação & Lanches', color: 'primary', bar: 'category-alimentacao-bar', value: 'category-alimentacao-value', percent: 'category-alimentacao-percent', donut: 'donut-alimentacao' },
      { key: 'emergencia', label: 'Emergências & Troca de Óleo', color: 'outline', bar: 'category-emergencia-bar', value: 'category-emergencia-value', percent: 'category-emergencia-percent', donut: 'donut-emergencia' }
    ];

    const ranked = entries
      .map((entry) => ({
        ...entry,
        value: categoryAmounts[entry.key] || 0,
        percent: totalExpenses > 0 ? ((categoryAmounts[entry.key] || 0) / totalExpenses) * 100 : 0
      }))
      .sort((a, b) => b.value - a.value);

    ranked.forEach((entry, index) => {
      const bar = document.getElementById(entry.bar);
      const valueEl = document.getElementById(entry.value);
      const percentEl = document.getElementById(entry.percent);
      const donutEl = document.getElementById(entry.donut);

      const width = totalExpenses > 0 ? Math.max(4, entry.percent) : 0;
      if (bar) bar.style.width = `${width}%`;
      if (valueEl) valueEl.innerHTML = `R$ ${formatBRL(entry.value)} <span class="text-on-surface-variant font-normal">(${Math.round(entry.percent)}%)</span>`;
      if (percentEl) percentEl.textContent = `(${Math.round(entry.percent)}%)`;
      if (donutEl) {
        const circumference = 88;
        const dash = totalExpenses > 0 ? (entry.percent / 100) * circumference : 0;
        donutEl.setAttribute('stroke-dasharray', `${dash} ${circumference}`);
        donutEl.setAttribute('stroke-dashoffset', `${totalExpenses > 0 ? -index * 18 : 0}`);
      }
    });

    const major = ranked[0];
    const majorLabel = document.getElementById('category-most-label');
    const majorValue = document.getElementById('category-most-value');

    if (major && totalExpenses > 0) {
      if (majorLabel) majorLabel.textContent = `${major.label} (${Math.round(major.percent)}%)`;
      if (majorValue) majorValue.textContent = `R$ ${formatBRL(major.value)} gastos`;
    } else {
      if (majorLabel) majorLabel.textContent = 'Sem despesas no período';
      if (majorValue) majorValue.textContent = 'R$ 0,00 gastos';
    }
  }

  async function carregarMétricasDashboard(periodStart, periodEnd, periodName) {
    if (!window.supabase || !supabaseClient) {
      console.warn('Supabase ainda não está disponível.');
      return;
    }

    try {
      const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
      if (userError || !user) {
        console.warn('Sessão inválida ao carregar métricas do dashboard. Redirecionando para login...');
        window.location.href = 'login.html';
        return;
      }

      const start = periodStart || toISO(new Date(new Date().getFullYear(), new Date().getMonth(), 1));
      const end = periodEnd || toISO(new Date());

      const { data: turnos, error: errorTurnos } = await supabaseClient
        .from('turnos')
        .select('id, data, ganho_bruto, minutos_online')
        .eq('usuario_id', user.id)
        .gte('data', start)
        .lte('data', end)
        .order('data', { ascending: true });

      if (errorTurnos) throw errorTurnos;

      const turnoIds = (turnos || []).map((turno) => turno.id);
      let despesas = [];

      if (turnoIds.length > 0) {
        const { data: despesasData, error: errorDespesas } = await supabaseClient
          .from('despesas')
          .select('turno_id, categoria, valor')
          .in('turno_id', turnoIds);

        if (errorDespesas) throw errorDespesas;
        despesas = despesasData || [];
      }

      const gross = (turnos || []).reduce((sum, turno) => sum + Number(turno.ganho_bruto || 0), 0);
      const expenses = despesas.reduce((sum, despesa) => sum + Number(despesa.valor || 0), 0);
      const net = gross - expenses;
      const despesasPorCategoria = despesas.reduce((acc, despesa) => {
        const categoria = String(despesa.categoria || 'outros').trim().toLowerCase();
        acc[categoria] = (acc[categoria] || 0) + Number(despesa.valor || 0);
        return acc;
      }, {});

      setDashboardNumericValues(gross, expenses, net);
      updateAppTimeMetrics(turnos || []);
      updateCategoryMetrics(despesas);
      renderizarDespesasPorCategoria(despesasPorCategoria, expenses);
      console.log(`[Dashboard] Dados carregados do Supabase: ${periodName || 'periodo'} | bruto=${gross} | despesas=${expenses} | liquido=${net}`);
    } catch (error) {
      console.error('Erro ao consultar métricas do dashboard no Supabase:', error);
      setDashboardNumericValues(0, 0, 0);
      updateAppTimeMetrics([]);
      updateCategoryMetrics([]);
    }
  }

  function applyDashboardFilter() {
    console.log(`[Dashboard] Filtrando de ${startDate} até ${endDate}`);

    if (typeof carregarMétricasDashboard === 'function') {
      carregarMétricasDashboard(startDate, endDate, selectedPeriod);
    }
  }

  function toggleCustomPanel(show) {
    if (!customPanel) return;
    customPanel.classList.toggle('hidden', !show);
  }

  periodButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const period = btn.dataset.period;
      selectedPeriod = period;

      if (period === 'custom') {
        toggleCustomPanel(true);
        setActivePeriodButton(btn);
        return;
      }

      toggleCustomPanel(false);
      calculateDateRange(period);
      setActivePeriodButton(btn);
      applyDashboardFilter();
    });
  });

  function applyCustomRange() {
    if (!customStartInput || !customEndInput) return;
    if (!customStartInput.value || !customEndInput.value) {
      alert('Por favor, selecione a data de início e de fim.');
      return;
    }

    selectedPeriod = 'custom';
    startDate = customStartInput.value;
    endDate = customEndInput.value;

    const customButton = document.querySelector('.period-btn[data-period="custom"]');
    setActivePeriodButton(customButton);
    toggleCustomPanel(false);
    applyDashboardFilter();
  }

  if (customStartInput && customEndInput) {
    customStartInput.addEventListener('change', () => {
      if (customStartInput.value && customEndInput.value) {
        applyCustomRange();
      }
    });

    customEndInput.addEventListener('change', () => {
      if (customStartInput.value && customEndInput.value) {
        applyCustomRange();
      }
    });
  }

  window.carregarMétricasDashboard = carregarMétricasDashboard;

  const defaultButton = document.querySelector('.period-btn[data-period="month"]');
  calculateDateRange('month');
  setActivePeriodButton(defaultButton || periodButtons[0]);
  applyDashboardFilter();
})();

function formatBRL(value) {
  return Number(value || 0).toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

function renderizarDespesasPorCategoria(despesasPorCategoria, totalDespesas) {
  const container = document.getElementById('category-expenses-list');
  if (!container) return;

  const categorias = Object.keys(despesasPorCategoria);

  // Se não houver despesas no período
  if (categorias.length === 0 || totalDespesas === 0) {
    container.innerHTML = `
      <p class="text-body-sm text-on-surface-variant text-center py-3">
        Nenhuma despesa registrada neste período.
      </p>`;
    return;
  }

  // Mapeamento para nomes e cores amigáveis das categorias
  const configCategorias = {
    combustivel: { label: 'Combustível', color: 'bg-primary' },
    manutencao: { label: 'Manutenção', color: 'bg-tertiary' },
    alimentacao: { label: 'Alimentação', color: 'bg-secondary' },
    outros: { label: 'Outros', color: 'bg-outline' }
  };

  // Ordena da maior para a menor despesa
  const despesasOrdenadas = categorias
    .map(cat => ({
      key: cat,
      valor: despesasPorCategoria[cat],
      pct: ((despesasPorCategoria[cat] / totalDespesas) * 100).toFixed(1)
    }))
    .sort((a, b) => b.valor - a.valor);

  // Gera a estrutura HTML para cada categoria
  container.innerHTML = despesasOrdenadas.map(item => {
    const config = configCategorias[item.key] || { 
      label: item.key.charAt(0).toUpperCase() + item.key.slice(1), 
      color: 'bg-primary' 
    };

    return `
      <div>
        <div class="flex justify-between text-body-sm mb-1">
          <span class="font-medium text-on-surface">${config.label}</span>
          <span class="text-on-surface-variant font-metric-tabular">
            R$ ${formatBRL(item.valor)} <span class="text-xs text-outline font-normal">(${item.pct}%)</span>
          </span>
        </div>
        <!-- Barra de Progresso Horizontal -->
        <div class="w-full bg-surface-variant rounded-full h-2.5 overflow-hidden">
          <div class="${config.color} h-2.5 rounded-full transition-all duration-500" 
               style="width: ${item.pct}%"></div>
        </div>
      </div>
    `;
  }).join('');
}