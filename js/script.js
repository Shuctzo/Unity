// Script para garantir que apenas um formulário esteja aberto por vez
const collapseElements = document.querySelectorAll('.collapse');

document.querySelectorAll('[data-bs-toggle="collapse"]').forEach(button => {
    button.addEventListener('click', function() {
        const target = this.getAttribute('data-bs-target');
        
        // Fechar todos os outros formulários
        collapseElements.forEach(element => {
            if (element.id !== target.substring(1)) {
                const bsCollapse = new bootstrap.Collapse(element, {toggle: false});
                bsCollapse.hide();
            }
        });
    });
});

// Animação de seta para voltar ao topo da tela
const arrowUp = document.querySelector('.arrow-up');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            arrowUp.style.scale = '0';
        } else {
            arrowUp.style.scale = '1';
        }
    });
}, {
    threshold: 0.1
});

const alvo = document.querySelector('.top-section');
observer.observe(alvo);

// Função pra preview de entrada de dados em relatos de baixa prioridade.
function modalBaixaPreview() {
    const cpf = document.getElementById('cpf-baixa').value;
    const comunity = document.getElementById('comun-baixa').value;
    const date = document.getElementById('data-baixa').value;
    const tel = document.getElementById('tel-baixa').value;
    const coords = document.getElementById('coords-bai').value;
    const problemType = document.getElementById('tipo-baixa').value;
    const problemDesc = document.getElementById('desc-baixa').value;
    const attachments = document.getElementById('anexo-baixa').files;
    const modalContent = document.querySelector('#modalPreviewBaixa .modal-content');
    const modal = new bootstrap.Modal(document.getElementById('modalPreviewBaixa'));

    let anexosHtml = '';
    for (let i = 0; i < attachments.length; i++) {
        anexosHtml += `<span class="badge bg-secondary">${attachments[i].name}</span>`;
    }

    const content = `
        <div class="modal-header bg-success text-white">
            <h5 class="modal-title" id="modalPreviewBaixaLabel">
                <i class="bi bi-eye-fill me-2"></i>Confirme seu Relato
            </h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>

        <div class="modal-body">
            <div class="alert alert-success">
                <i class="bi bi-info-circle-fill me-2"></i>
                Por favor, confira todas as informações antes de enviar seu relato
            </div>

            <div class="preview-section mb-4">
                <h6 class="fw-bold text-success border-bottom pb-2 mb-3">
                    <i class="bi bi-person-badge me-2"></i>Dados Pessoais
                </h6>
                <div class="row">
                    <div class="col-md-6 mb-2">
                        <span class="text-muted">CPF:</span>
                        <span class="d-block fw-medium">${cpf}</span>
                    </div>
                    <div class="col-md-6 mb-2">
                        <span class="text-muted">Telefone:</span>
                        <span class="d-block fw-medium">${tel}</span>
                    </div>
                </div>
            </div>

            <div class="preview-section mb-4">
                <h6 class="fw-bold text-success border-bottom pb-2 mb-3">
                    <i class="bi bi-geo-alt me-2"></i>Localização
                </h6>
                <div class="row">
                    <div class="col-md-6 mb-2">
                        <span class="text-muted">Comunidade:</span>
                        <span class="d-block fw-medium">${comunity}</span>
                    </div>
                    <div class="col-md-6 mb-2">
                        <span class="text-muted">Data:</span>
                        <span class="d-block fw-medium">${date}</span>
                    </div>
                    <div class="col-md-12 mb-2">
                        <span class="text-muted">Coordenadas:</span>
                        <span class="d-block fw-medium">${coords}</span>
                    </div>
                </div>
            </div>

            <div class="preview-section mb-4">
                <h6 class="fw-bold text-success border-bottom pb-2 mb-3">
                    <i class="bi bi-exclamation-triangle me-2"></i>Detalhes do Problema
                </h6>
                <div class="row">
                    <div class="col-md-6 mb-2">
                        <span class="text-muted">Tipo:</span>
                        <span class="d-block fw-medium">${problemType}</span>
                    </div>
                    <div class="col-md-12 mb-2">
                        <span class="text-muted">Descrição:</span>
                        <p class="bg-light p-3 rounded mt-2">${problemDesc}</p>
                    </div>
                </div>
            </div>

            <div class="preview-section">
                <h6 class="fw-bold text-success border-bottom pb-2 mb-3">
                    <i class="bi bi-paperclip me-2"></i>Anexos
                </h6>
                <div class="d-flex flex-wrap gap-2">
                    ${anexosHtml || '<span class="text-muted">Nenhum anexo</span>'}
                </div>
            </div>
        </div>

        <div class="modal-footer">
            <button type="button" class="btn btn-success" id="btn-confirmar-envio" data-bs-dismiss="modal">
                <i class="bi bi-send-check me-2"></i>Confirmar Envio
            </button>
            <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">
                <i class="bi bi-pencil me-2"></i>Corrigir Dados
            </button>
        </div>
    `;

    modalContent.innerHTML = content;
    setTimeout(() => {
        const confirmBtn = document.getElementById('btn-confirmar-envio');
        if (confirmBtn) {
            confirmBtn.addEventListener('click', () => {
                mostrarAlerta();
                addCardReport();
            });
        }
    }, 10);
    modal.show();
}

function mostrarAlerta() {
    const alerta = `
        <div class="alert alert-success alert-dismissible fade show" role="alert" style="position: fixed; left: 2%; top: 2%; z-index: 10; ">
            <p class="fw-bold">Seu relato foi enviado com sucesso!</p>
            <p class="fw-bold">Protocolo: BP2025-1607-1951.</p>
            <span>Você também por acompanhar o andamento do seu relato em em seu perfil.</span>
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Fechar"></button>
        </div>
    `;
    document.getElementById('alertPlaceholder').innerHTML = alerta;
}

function addCardReport() {
    const cardContainer = document.getElementById('report-container');
    const reportData = {
        cpf: document.getElementById('cpf-baixa').value,
        comunity: document.getElementById('comun-baixa').value,
        date: document.getElementById('data-baixa').value,
        tel: document.getElementById('tel-baixa').value,
        coords: document.getElementById('coords-bai').value,
        problemType: document.getElementById('tipo-baixa').value,
        problemDesc: document.getElementById('desc-baixa').value,
        attachments: document.getElementById('anexo-baixa').files
    };

    const card = document.createElement('div');
    card.className = 'card mb-3 shadow priority-card col-lg-6 low h-100';

    card.innerHTML = `
        <div class="card-body">
            <i class="bi bi-check-circle-fill text-success priority-indicator"></i>
            <h5 class="card-title text-success mb-4">Relato de Baixa Prioridade</h5>
            <p class="mb-3"><strong><i class="bi bi-tags-fill text-success me-2"></i> Protocolo:</strong> BP2025-1607-1951</p>
            <div class="row g-3 mb-3">
                <div class="col-md-6">
                    <p class="mb-2"><strong><i class="bi bi-person-vcard-fill text-success me-2"></i> CPF:</strong> ${reportData.cpf}</p>
                </div>
                <div class="col-md-6">
                    <p class="mb-2"><strong><i class="bi bi-people-fill text-success me-2"></i> Comunidade:</strong> ${reportData.comunity}</p>
                </div>
                <div class="col-md-6">
                    <p class="mb-2"><strong><i class="bi bi-calendar-check-fill text-success me-2"></i> Data:</strong> ${reportData.date}</p>
                </div>
                <div class="col-md-6">
                    <p class="mb-2"><strong><i class="bi bi-telephone-fill text-success me-2"></i> Telefone:</strong> ${reportData.tel}</p>
                </div>
                <div class="col-12">
                    <p class="mb-2"><strong><i class="bi bi-geo-alt-fill text-success me-2"></i> Coordenadas:</strong> ${reportData.coords}</p>
                </div>
                <div class="col-12">
                    <p class="mb-2"><strong><i class="bi bi-tag-fill text-success me-2"></i> Tipo de Problema:</strong> ${reportData.problemType}</p>
                </div>
                <div class="col-12">
                    <p class="mb-2"><strong><i class="bi bi-chat-left-text-fill text-success me-2"></i> Descrição:</strong></p>
                    <div class="alert bg-light-success p-3 rounded">
                        ${reportData.problemDesc}
                    </div>
                </div>
                <div class="col-12">
                    <p class="mb-2"><strong><i class="bi bi-paperclip text-success me-2"></i> Anexos:</strong></p>
                    <div class="d-flex flex-wrap gap-2">
                        ${reportData.attachments.length > 0 
                            ? attachmentsList(reportData.attachments) 
                            : '<span class="badge bg-light text-dark">Nenhum anexo</span>'}
                    </div>
                </div>
            </div>
            
            <div class="d-flex justify-content-between align-items-center mt-4">
                <span class="badge bg-success">Baixa Prioridade</span>
                <span class="badge bg-unity2">Em Tratamento</span>
                <span class="text-muted small">Previsão: 30 dias</span>
            </div>
        </div>
    `

    cardContainer.appendChild(card);
}

function attachmentsList(fileList) {
    return Array.from(fileList)
        .map(file => `<span class="badge bg-secondary me-1">${file.name}</span>`)
        .join('');
}

// Função para simular votação
function comunityVote() {
    const selectedVote = document.querySelector('input[name="vote"]:checked');
    
    if (!selectedVote) {
        alert('Por favor, selecione uma opção para votar.');
        return;
    }

    const label = document.querySelector(`label[for="${selectedVote.id}"]`);
    alert(`Voto registrado para: ${label.textContent}`);
}

function resetForm() {
    document.getElementById('topicTitle').value = '';
    document.getElementById('topicCategory').selectedIndex = 0;
    document.getElementById('topicPriority').selectedIndex = 0;
    document.getElementById('topicContent').value = '';
    document.getElementById('topicImages').value = '';
}

// Simular envio de formulário
function addTopic() {
    alert('Tópico criado com sucesso! Será revisado pela moderação antes de aparecer no fórum.');
    const modal = bootstrap.Modal.getInstance(document.getElementById('newTopicModal'));
    modal.hide();
    resetForm();
}

document.addEventListener('DOMContentLoaded', function() {
    // Inicializa os gráficos
    initBarChart();
    initLineChart();
    
    // Configura os filtros e simulador
    setupFilters();
    setupSimulator();
});

// Gráfico de Barras
function initBarChart() {
    const ctx = document.getElementById('barChart').getContext('2d');
    const barChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Água/Saneamento', 'Saúde', 'Educação', 'Segurança', 'Transporte', 'Meio Ambiente'],
            datasets: [{
                label: 'Problemas Reportados',
                data: [125, 87, 64, 93, 56, 42],
                backgroundColor: [
                    'rgba(75, 66, 120, 0.7)',
                    'rgba(174, 36, 75, 0.7)',
                    'rgba(142, 172, 48, 0.7)',
                    'rgba(231, 111, 36, 0.7)',
                    'rgba(8, 20, 29, 0.7)',
                    'rgba(100, 149, 237, 0.7)'
                ],
                borderColor: [
                    'rgba(75, 66, 120, 1)',
                    'rgba(174, 36, 75, 1)',
                    'rgba(142, 172, 48, 1)',
                    'rgba(231, 111, 36, 1)',
                    'rgba(8, 20, 29, 1)',
                    'rgba(100, 149, 237, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        afterLabel: function(context) {
                            return 'Clique para detalhes';
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Número de Problemas'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Categorias'
                    }
                }
            },
            onClick: (e, elements) => {
                if (elements.length > 0) {
                    const index = elements[0].index;
                    const label = barChart.data.labels[index];
                    alert(`Você clicou na categoria: ${label}\nTotal de problemas: ${barChart.data.datasets[0].data[index]}`);
                }
            }
        }
    });
}

// Gráfico de Linha
function initLineChart() {
    const ctx = document.getElementById('lineChart').getContext('2d');
    const lineChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
            datasets: [
                {
                    label: 'Água/Saneamento',
                    data: [45, 52, 48, 55, 60, 65, 70, 68, 72, 75, 80, 85],
                    borderColor: 'rgba(75, 66, 120, 1)',
                    backgroundColor: 'rgba(75, 66, 120, 0.1)',
                    tension: 0.3,
                    fill: true
                },
                {
                    label: 'Saúde',
                    data: [30, 35, 40, 42, 45, 50, 55, 60, 65, 70, 75, 80],
                    borderColor: 'rgba(174, 36, 75, 1)',
                    backgroundColor: 'rgba(174, 36, 75, 0.1)',
                    tension: 0.3,
                    fill: true
                },
                {
                    label: 'Educação',
                    data: [20, 25, 28, 30, 32, 35, 38, 40, 45, 50, 55, 60],
                    borderColor: 'rgba(142, 172, 48, 1)',
                    backgroundColor: 'rgba(142, 172, 48, 0.1)',
                    tension: 0.3,
                    fill: true
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Número de Problemas'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Meses'
                    }
                }
            },
            interaction: {
                mode: 'nearest',
                axis: 'x',
                intersect: false
            }
        }
    });
}

// Configuração dos Filtros
function setupFilters() {
    const aplicarFiltrosBtn = document.getElementById('aplicar-filtros');

    aplicarFiltrosBtn.addEventListener('click', function() {
        const tema = document.getElementById('tema').value;
        const periodo = document.getElementById('periodo').value;
        const regiao = document.getElementById('regiao').value;

        // Aqui você implementaria a lógica para filtrar os dados
        // Por enquanto, apenas mostra um alerta com os filtros selecionados
        alert(`Filtros aplicados:\nTema: ${tema}\nPeríodo: ${periodo}\nRegião: ${regiao}`);

        // Simulação de atualização dos gráficos com novos dados filtrados
        // Na implementação real, você faria uma requisição AJAX para obter os dados filtrados
        console.log('Atualizando gráficos com os novos filtros...');
    });
}

// Configuração do Simulador
function setupSimulator() {
    const runSimulationBtn = document.getElementById('run-simulation');
    const simulationResults = document.getElementById('simulation-results');

    runSimulationBtn.addEventListener('click', function() {
        const scenario = document.getElementById('simulator-scenario').value;
        const region = document.getElementById('simulator-region').value;
        const duration = document.getElementById('simulator-duration').value;

        // Mostra os resultados da simulação
        simulationResults.classList.remove('d-none');

        // Rola a página até os resultados
        simulationResults.scrollIntoView({ behavior: 'smooth' });

        // Atualiza os resultados com base nos parâmetros da simulação
        updateSimulationResults(scenario, region, duration);
    });
}

function updateSimulationResults(scenario, region, duration) {
    // Esta função atualizaria os resultados com base nos parâmetros
    // Aqui está uma implementação simulada

    const progressBars = document.querySelectorAll('#simulation-results .progress-bar');
    const alertBox = document.querySelector('#simulation-results .alert');

    // Valores base para a simulação
    let healthImpact = 20 + Math.random() * 10;
    let employmentImpact = 10 + Math.random() * 10;
    let safetyImpact = 5 + Math.random() * 10;

    // Ajusta com base no cenário
    if (scenario === 'investimento-educacao') {
        employmentImpact += 5;
        healthImpact += 2;
    } else if (scenario === 'melhoria-saneamento') {
        healthImpact += 10;
    } else if (scenario === 'seguranca-publica') {
        safetyImpact += 15;
    } else if (scenario === 'programa-emprego') {
        employmentImpact += 15;
    }

    // Ajusta com base na duração
    const durationFactor = duration / 12;
    healthImpact *= durationFactor;
    employmentImpact *= durationFactor;
    safetyImpact *= durationFactor;

    // Atualiza as barras de progresso
    progressBars[0].style.width = `${healthImpact}%`;
    progressBars[0].textContent = `Redução de ${Math.round(healthImpact)}% em problemas de saúde`;

    progressBars[1].style.width = `${employmentImpact}%`;
    progressBars[1].textContent = `Aumento de ${Math.round(employmentImpact)}% na empregabilidade`;

    progressBars[2].style.width = `${safetyImpact}%`;
    progressBars[2].textContent = `Redução de ${Math.round(safetyImpact)}% na violência`;

    // Atualiza a mensagem de alerta
    let alertMessage = '';
    if (healthImpact > 25 || employmentImpact > 20 || safetyImpact > 15) {
        alertMessage = '<i class="bi bi-lightbulb me-2"></i> Esta simulação sugere que o investimento terá um impacto positivo significativo na comunidade.';
        alertBox.className = 'alert alert-success mt-3';
    } else {
        alertMessage = '<i class="bi bi-exclamation-triangle me-2"></i> Esta simulação sugere que o investimento terá um impacto moderado. Considere ajustar os parâmetros.';
        alertBox.className = 'alert alert-warning mt-3';
    }

    alertBox.innerHTML = alertMessage;
}

// Configuração da Votação de Prioridades
function setupPriorityVoting() {
    const selectedPriorities = [];
    document.querySelectorAll('.priority-voting input:checked').forEach(checkbox => {
        selectedPriorities.push(checkbox.nextElementSibling.textContent);
    });

    if (selectedPriorities.length === 0) {
        alert('Por favor, selecione uma prioridade para votar.');
        return;
    }

    // Simulação de envio dos votos
    alert(`Obrigado por votar!\nPrioridade selecionada:\n- ${selectedPriorities.join('\n- ')}`);
}