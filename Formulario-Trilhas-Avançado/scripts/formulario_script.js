document.addEventListener("DOMContentLoaded", function () {
    document.body.classList.add("fade-in");

    const checkboxes = document.querySelectorAll('.checkbox-hidden');

    function resetBorders() {
        const allCards = document.querySelectorAll('.card-checkbox');
        allCards.forEach(card => {
            card.style.borderColor = "#ccc";
        });
    }

    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function () {
            const card = this.closest('.card-checkbox');
            if (this.checked) {
                resetBorders();
                card.style.borderColor = "#F3541C";
            } else {
                card.style.borderColor = "#ccc";
            }
        });
    });

    const emailInput = document.getElementById('email');
    const emailError = document.getElementById('emailError');

    emailInput.addEventListener('input', function() {
        const emailValue = emailInput.value;
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (emailValue === "") {
            emailError.style.display = 'none';
            emailInput.classList.remove('invalid');
        } else if (!emailPattern.test(emailValue)) {
            emailError.style.display = 'flex';
            emailInput.classList.add('invalid');
        } else {
            emailError.style.display = 'none';
            emailInput.classList.remove('invalid');
        }
    });

    function formatCPF(cpf) {
        cpf = cpf.replace(/\D/g, '');
        cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
        cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
        cpf = cpf.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        return cpf;
    }

    const cpfInput = document.getElementById('cpf');
    cpfInput.addEventListener('input', function() {
        this.value = formatCPF(this.value);
    });

    document.getElementById('telefone').addEventListener('input', function () {
        let phone = this.value.replace(/\D/g, '');
        phone = phone.replace(/^(\d{2})(\d)/, '($1) $2');
        phone = phone.replace(/(\d{5})(\d{1,4})$/, '$1-$2');
        this.value = phone;
    });

    const dataInput = document.getElementById('dataNascimento');
    const dateError = document.getElementById('dataError');

    dataInput.addEventListener('input', function () {
        let date = this.value.replace(/\D/g, '');
        date = date.replace(/(\d{2})(\d)/, '$1/$2');
        date = date.replace(/(\d{2}\/\d{2})(\d)/, '$1/$2');
        this.value = date;
    });

    dataInput.addEventListener('blur', function () {
        const dateValue = this.value;
        const datePattern = /^(0[1-9]|1[0-9]|2[0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;

        if (dateValue === "") {
            dateError.style.display = 'none';
            this.classList.remove('invalid');
        } else if (!datePattern.test(dateValue)) {
            dateError.style.display = 'block';
            this.classList.add('invalid');
        } else {
            const [day, month, year] = dateValue.split('/').map(Number);
            const date = new Date(year, month - 1, day);

            if (year < 1900 || date.getDate() !== day || date.getMonth() !== month - 1 || date.getFullYear() !== year) {
                dateError.style.display = 'block';
                this.classList.add('invalid');
            } else {
                dateError.style.display = 'none';
                this.classList.remove('invalid');
            }
        }
    });

    document.getElementById("cep").addEventListener("input", function (e) {
        let cep = e.target.value.replace(/\D/g, '');
        if (cep.length > 5) {
            cep = cep.substring(0, 5) + "-" + cep.substring(5, 8);
        }
        e.target.value = cep;

        if (cep.length === 9) {
            buscarEndereco(cep.replace("-", ""));
        }
    });

    function buscarEndereco(cep) {
        fetch(`https://viacep.com.br/ws/${cep}/json/`)
            .then(response => response.json())
            .then(data => {
                if (!data.erro) {
                    document.getElementById("Rua").value = data.logradouro || "";
                    document.getElementById("cidade").value = data.localidade || "";
                    document.getElementById("estado").value = data.uf || "";
                } else {
                    alert("CEP não encontrado!");
                }
            })
            .catch(error => console.error("Erro ao buscar CEP:", error));
    }

    function validarDados() {
        const nomeInput = document.querySelector('input[type="text"][class="input__padrao1"]');
        if (nomeInput && !nomeInput.id) nomeInput.id = 'nomeCompleto';

        const sexoSelect = document.querySelector('select[name="Sexo"]');
        if (sexoSelect && !sexoSelect.id) sexoSelect.id = 'sexo';

        const camposObrigatorios = [
            'nomeCompleto', 'dataNascimento', 'cpf', 'sexo', 
            'email', 'telefone', 'cep', 'Rua', 'Numero', 
            'cidade', 'estado'
        ];

        for (const campoId of camposObrigatorios) {
            const elemento = document.getElementById(campoId);
            if (!elemento) {
                console.error(`Elemento não encontrado: ${campoId}`);
                continue;
            }

            const valor = elemento.value.trim();
            if (!valor) {
                alert(`Por favor, preencha o campo ${campoId.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
                elemento.focus();
                return false;
            }
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(document.getElementById('email').value)) {
            alert('Por favor, insira um e-mail válido');
            return false;
        }

        if (!document.querySelector('input[name="trilha"]:checked')) {
            alert('Por favor, selecione uma trilha de aprendizagem');
            return false;
        }

        if (!document.getElementById('termos_e_condicoes').checked) {
            alert('Você deve aceitar os Termos e Condições para continuar');
            return false;
        }

        if (!document.getElementById('senha').value || !document.getElementById('confirmarSenha').value) {
            alert('Por favor, preencha ambos os campos de senha!');
            return false;
        }
    
        return true;
    }

    window.validarDados = validarDados;

    function salvarDados() {
        if (!validarDados()) return false;

        const formData = {
            nomeCompleto: document.getElementById('nomeCompleto').value,
            dataNascimento: document.getElementById('dataNascimento').value,
            cpf: document.getElementById('cpf').value,
            sexo: document.getElementById('sexo').value,
            email: document.getElementById('email').value,
            telefone: document.getElementById('telefone').value,
            cep: document.getElementById('cep').value,
            rua: document.getElementById('Rua').value,
            numero: document.getElementById('Numero').value,
            cidade: document.getElementById('cidade').value,
            estado: document.getElementById('estado').value,
            trilha: document.querySelector('input[name="trilha"]:checked').value
        };

        localStorage.setItem('formularioInscricao', JSON.stringify(formData));
        alert('Dados salvos com sucesso! Você pode continuar mais tarde.');
        return true;
    }

    function carregarDados() {
        const savedData = localStorage.getItem('formularioInscricao');
        if (savedData) {
            const formData = JSON.parse(savedData);
            const fieldMap = {
                rua: 'Rua',
                numero: 'Numero'
            };

            for (const key in formData) {
                const elementId = fieldMap[key] || key;
                const element = document.getElementById(elementId);
                if (element) {
                    element.value = formData[key];
                }
            }

            if (formData.trilha) {
                const trilhas = document.querySelectorAll('input[name="trilha"]');
                trilhas.forEach(trilha => {
                    if (trilha.value === formData.trilha) {
                        trilha.checked = true;
                        trilha.dispatchEvent(new Event('change'));
                    }
                });
            }
        }
    }

    const botaoSalvar = document.getElementById('botaoSalvar');
    if (botaoSalvar) {
        botaoSalvar.addEventListener('click', salvarDados);
    }

    carregarDados();
});

document.getElementById('senha').addEventListener('input', function() {
    const senha = this.value;
    verificarForcaSenha(senha);
    verificarRequisitosSenha(senha);
    verificarSenhasIguais();
});

document.getElementById('confirmarSenha').addEventListener('input', verificarSenhasIguais);

function verificarSenhasIguais() {
    const senha = document.getElementById('senha').value;
    const confirmarSenha = document.getElementById('confirmarSenha').value;
    const feedback = document.getElementById('feedbackSenha');
    const icone = document.getElementById('iconeFeedback');
    const texto = document.getElementById('textoFeedback');

    if (confirmarSenha.length === 0) {
        feedback.style.display = 'none';
        return;
    }

    feedback.style.display = 'flex';

    if (senha === confirmarSenha && senha.length >= 6) {
        feedback.className = 'feedback-senha valido';
        icone.textContent = '✅';
        texto.textContent = 'Senhas coincidem!';
    } else {
        feedback.className = 'feedback-senha invalido';
        icone.textContent = '❌';
        texto.textContent = 'As senhas não coincidem';
    }
}

function verificarForcaSenha(senha) {
    const barra = document.getElementById('barraForca');
    let forca = 0;

    if (senha.length >= 6) forca += 1;
    if (/[0-9]/.test(senha)) forca += 1;
    if (/[A-Z]/.test(senha)) forca += 1;
    if (/[@$!%*?&]/.test(senha)) forca += 1;

    barra.className = 'barra';

    if (senha.length === 0) return;

    if (forca <= 1) barra.classList.add('fraca');
    else if (forca === 2) barra.classList.add('media');
    else if (forca === 3) barra.classList.add('forte');
    else barra.classList.add('muito-forte');
}

function verificarRequisitosSenha(senha) {
    const requisitos = {
        length: senha.length >= 6,
        number: /[0-9]/.test(senha),
        uppercase: /[A-Z]/.test(senha),
        special: /[@$!%*?&]/.test(senha)
    };

    Object.keys(requisitos).forEach(key => {
        const elemento = document.querySelector(`[data-requisito="${key}"]`);
        if (requisitos[key]) {
            elemento.classList.add('cumprido');
            elemento.querySelector('.icone').textContent = '✅';
        } else {
            elemento.classList.remove('cumprido');
            elemento.querySelector('.icone').textContent = '❌';
        }
    });
}

function confirmarInscricao() {
    if(event && event.preventDefault) event.preventDefault();

    if (
        validarDados() &&
        validarSenhas() &&
        validarArquivos() &&
        validarForcaSenha()
    ) {
        direcionarPagina('confirmacao_index.html');
    } else {
        console.log("Alguma validação falhou");
    }
}

function direcionarPagina(url) {
    document.body.classList.add("fade-out"); 
    setTimeout(() => {
        window.location.href = url; 
    }, 300); 
}

function validarSenhas() {
    const senha = document.getElementById('senha').value;
    const confirmarSenha = document.getElementById('confirmarSenha').value;
    
    if (senha !== confirmarSenha) {
        alert('As senhas não coincidem!');
        return false;
    }
    return true;
}

function validarArquivos() {
    const arquivos = document.querySelectorAll('input[type="file"][required]');
    for (const arquivo of arquivos) {
        if (!arquivo.files.length) {
            alert('Por favor, selecione todos os arquivos obrigatórios!');
            return false;
        }
    }
    return true;
}

function validarForcaSenha() {
    const senha = document.getElementById('senha').value;
    const requisitos = {
        length: senha.length >= 6,
        number: /[0-9]/.test(senha),
        uppercase: /[A-Z]/.test(senha),
        special: /[@$!%*?&]/.test(senha)
    };
    
    if (!Object.values(requisitos).every(v => v)) {
        alert('A senha não atende a todos os requisitos de segurança!');
        return false;
    }
    return true;
}

document.getElementById('limparDados').addEventListener('click', function () {
    localStorage.removeItem('formularioInscricao');
    alert('Dados removidos com sucesso!');
    direcionarPagina('formulario_index.html')
});