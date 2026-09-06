// ==========================================
// JC BARBEARIA - SISTEMA DE AGENDAMENTOS
// ==========================================

const AGENDAMENTOS_KEY = "jc_barbearia_agendamentos";

// Pega os agendamentos salvos
function obterAgendamentos() {
    const dados = localStorage.getItem(AGENDAMENTOS_KEY);

    if (!dados) {
        return [];
    }

    try {
        return JSON.parse(dados);
    } catch (erro) {
        console.error("Erro ao carregar agendamentos:", erro);
        return [];
    }
}

// Salva os agendamentos
function salvarAgendamentos(agendamentos) {
    localStorage.setItem(
        AGENDAMENTOS_KEY,
        JSON.stringify(agendamentos)
    );
}

// Verifica se o horário já está ocupado
function horarioOcupado(data, horario) {
    const agendamentos = obterAgendamentos();

    return agendamentos.some(agendamento =>
        agendamento.data === data &&
        agendamento.horario === horario &&
        agendamento.status !== "cancelado"
    );
}

// Adiciona um novo agendamento
function adicionarAgendamento(dados) {
    if (!dados.data || !dados.horario) {
        return {
            sucesso: false,
            mensagem: "Informe a data e o horário."
        };
    }

    if (horarioOcupado(dados.data, dados.horario)) {
        return {
            sucesso: false,
            mensagem: "Este horário já está ocupado."
        };
    }

    const agendamentos = obterAgendamentos();

    const novoAgendamento = {
        id: Date.now(),
        nome: dados.nome || "",
        telefone: dados.telefone || "",
        servico: dados.servico || "",
        barbeiro: dados.barbeiro || "",
        data: dados.data,
        horario: dados.horario,
        observacao: dados.observacao || "",
        status: "confirmado",
        criadoEm: new Date().toISOString()
    };

    agendamentos.push(novoAgendamento);

    salvarAgendamentos(agendamentos);

    return {
        sucesso: true,
        mensagem: "Agendamento realizado com sucesso!",
        agendamento: novoAgendamento
    };
}

// Cancela um agendamento
function cancelarAgendamento(id) {
    const agendamentos = obterAgendamentos();

    const agendamento = agendamentos.find(item => item.id === id);

    if (!agendamento) {
        return false;
    }

    agendamento.status = "cancelado";

    salvarAgendamentos(agendamentos);

    return true;
}

// Remove definitivamente um agendamento
function excluirAgendamento(id) {
    const agendamentos = obterAgendamentos();

    const novosAgendamentos = agendamentos.filter(
        agendamento => agendamento.id !== id
    );

    salvarAgendamentos(novosAgendamentos);
}

// Lista os agendamentos
function listarAgendamentos() {
    return obterAgendamentos();
}

console.log("Sistema de agendamentos carregado.");
