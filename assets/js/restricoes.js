document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('restricoes-form');
    const tableBody = document.getElementById('restricoes-table').getElementsByTagName('tbody')[0];
    const prevPageBtn = document.getElementById('prevPage');
    const nextPageBtn = document.getElementById('nextPage');
    const pageNumber = document.getElementById('pageNumber');
    const searchBar = document.getElementById('search-bar');
    const formMessages = document.getElementById('form-messages');
    const formMessageText = document.getElementById('form-message-text');
    const errorIcon = document.getElementById('error-icon');
    const successIcon = document.getElementById('success-icon');
    const disciplinaInput = document.getElementById('disciplina');
    const disciplinaDropdown = document.querySelector('.disciplina-dropdown');
    const disciplinasDropdownContent = document.getElementById('disciplinasDropdown');
    const professorInput = document.getElementById('professor');
    const diasDropdown = document.querySelector('.dias-dropdown');
    const dropdownContent = document.getElementById('diasDropdown');
    const diasRestritosInput = document.getElementById('dias-restritos');

    const rowsPerPage = 5;
    let currentPage = 1;
    let restricoes = [];
    let filteredRestricoes = [];
    let editIndex = -1;

    //array temporário de disciplinas para teste
    const disciplinas = [
        { disciplina: 'Matemática', professor: 'Prof. Silva' },
        { disciplina: 'Português', professor: 'Prof. Santos' },
        { disciplina: 'História', professor: 'Prof. Oliveira' },
        { disciplina: 'Geografia', professor: 'Prof. Costa' },
        { disciplina: 'Física', professor: 'Prof. Dias' }
    ];

    //ordenar disciplinas alfabeticamente
    disciplinas.sort((a, b) => a.disciplina.localeCompare(b.disciplina));

    //carregar disciplinas temporárias no dropdown
    disciplinas.forEach(({ disciplina, professor }) => {
        const option = document.createElement('div');
        option.className = 'dropdown-item';
        option.textContent = disciplina;
        option.dataset.professor = professor;
        disciplinasDropdownContent.appendChild(option);
    });

    //adicionar classe para comportamento de scroll se houver mais de 4 disciplinas
    if (disciplinas.length > 4) {
        disciplinasDropdownContent.classList.add('scrollable');
    }

    disciplinaInput.addEventListener('click', () => {
        if (disciplinaDropdown.classList.contains('open')) {
            slideUp(disciplinasDropdownContent, () => {
                disciplinaDropdown.classList.remove('open');
            });
        } else {
            slideDown(disciplinasDropdownContent, () => {
                disciplinaDropdown.classList.add('open');
            });
        }
    });

    disciplinasDropdownContent.addEventListener('click', (event) => {
        if (event.target.classList.contains('dropdown-item')) {
            disciplinaInput.value = event.target.textContent;
            professorInput.value = event.target.dataset.professor;
            slideUp(disciplinasDropdownContent, () => {
                disciplinaDropdown.classList.remove('open');
            });
            updatePlaceholder(disciplinaInput, 'Selecione a disciplina');
        }
    });

    diasRestritosInput.addEventListener('click', () => {
        if (diasDropdown.classList.contains('open')) {
            slideUp(dropdownContent, () => {
                diasDropdown.classList.remove('open');
            });
        } else {
            slideDown(dropdownContent, () => {
                diasDropdown.classList.add('open');
            });
        }
    });

    dropdownContent.addEventListener('change', () => {
        updateSelectedDays();
        slideUp(dropdownContent, () => {
            diasDropdown.classList.remove('open');
        });
        updatePlaceholder(diasRestritosInput, 'Selecione o(s) dia(s)');
    });

    function updateSelectedDays() {
        const selectedDays = Array.from(dropdownContent.querySelectorAll('input:checked')).map(input => input.value);
        diasRestritosInput.value = selectedDays.join(', ');
    }

    function updatePlaceholder(input, placeholder) {
        if (input.value.trim() === '') {
            input.setAttribute('placeholder', placeholder);
        } else {
            input.removeAttribute('placeholder');
        }
    }

    function slideDown(element, callback) {
        element.style.display = 'block';
        element.style.height = '0px';
        element.style.overflow = 'hidden';
        requestAnimationFrame(() => {
            element.style.transition = 'height 0.3s ease-in-out, opacity 0.3s ease-in-out';
            element.style.height = element.scrollHeight + 'px';
            element.style.opacity = '1';
        });
        element.addEventListener('transitionend', function transitionEnd(event) {
            if (event.propertyName === 'height') {
                element.style.height = '';
                element.style.overflow = '';
                element.style.transition = '';
                element.removeEventListener('transitionend', transitionEnd);
                if (callback) callback();
            }
        });
    }

    function slideUp(element, callback) {
        element.style.height = element.scrollHeight + 'px';
        element.style.overflow = 'hidden';
        requestAnimationFrame(() => {
            element.style.transition = 'height 0.3s ease-in-out, opacity 0.3s ease-in-out';
            element.style.height = '0px';
            element.style.opacity = '0';
        });
        element.addEventListener('transitionend', function transitionEnd(event) {
            if (event.propertyName === 'height') {
                element.style.display = 'none';
                element.style.height = '';
                element.style.overflow = '';
                element.style.transition = '';
                element.removeEventListener('transitionend', transitionEnd);
                if (callback) callback();
            }
        });
    }

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        console.log('Form submitted');

        const inputs = form.querySelectorAll('input, select');
        let formIsValid = true;
        let errorMessage = '';

        inputs.forEach(input => {
            if (input.value.trim() === '' && input.id !== 'professor') {
                formIsValid = false;
                errorMessage = 'Todos os campos são obrigatórios.';
                input.classList.add('error');
            } else if (input.type === 'number' && input.value <= 0) {
                formIsValid = false;
                errorMessage = 'Os valores numéricos devem ser maiores que zero.';
                input.classList.add('error');
            } else {
                input.classList.remove('error');
            }
        });

        if (!formIsValid) {
            showMessage(errorMessage, 'error');
            console.log('Form validation failed:', errorMessage);
            return;
        }

        const restricao = {
            disciplina: form.disciplina.value,
            professor: professorInput.value,
            horario: form.horario.value,
            aulas: form.aulas.value,
            diasRestritos: Array.from(dropdownContent.querySelectorAll('input:checked')).map(input => input.value)
        };

        console.log('Restrição criada:', restricao);

        if (editIndex === -1) {
            restricoes.push(restricao);
            showMessage('Restrição salva com sucesso!', 'success');
        } else {
            restricoes.splice(editIndex, 1, restricao);
            editIndex = -1;
            showMessage('Restrição editada com sucesso!', 'success');
        }

        console.log('Lista de restrições atualizada:', restricoes);

        applyFilter();
        form.reset();
        updatePlaceholder(disciplinaInput, 'Selecione a disciplina');
        updatePlaceholder(diasRestritosInput, 'Selecione o(s) dia(s)');
        currentPage = Math.ceil(filteredRestricoes.length / rowsPerPage);
        renderTable();
    });

    form.addEventListener('input', () => {
        clearMessages();
    });

    searchBar.addEventListener('input', () => {
        applyFilter();
    });

    function applyFilter() {
        const searchTerm = searchBar.value.toLowerCase();
        filteredRestricoes = restricoes.filter(restricao => {
            return restricao.disciplina.toLowerCase().includes(searchTerm);
        });
        currentPage = 1;
        renderTable();
    }

    function renderTable() {
        tableBody.innerHTML = '';

        const startIndex = (currentPage - 1) * rowsPerPage;
        const endIndex = startIndex + rowsPerPage;
        const pageItems = filteredRestricoes.slice(startIndex, endIndex);

        pageItems.forEach((restricao, index) => {
            const row = tableBody.insertRow();

            const cellDisciplina = row.insertCell(0);
            cellDisciplina.innerText = restricao.disciplina;
            if (restricao.disciplina.length > 21) {
                cellDisciplina.setAttribute('data-tooltip', restricao.disciplina);
            }

            const cellProfessor = row.insertCell(1);
            cellProfessor.innerText = restricao.professor;
            if (restricao.professor.length > 21) {
                cellProfessor.setAttribute('data-tooltip', restricao.professor);
            }

            const cellHorario = row.insertCell(2);
            cellHorario.innerText = restricao.horario;
            if (restricao.horario.length > 21) {
                cellHorario.setAttribute('data-tooltip', restricao.horario);
            }

            const cellAulas = row.insertCell(3);
            cellAulas.innerText = restricao.aulas;
            if (restricao.aulas.length > 21) {
                cellAulas.setAttribute('data-tooltip', restricao.aulas);
            }

            const cellDiasRestritos = row.insertCell(4);
            cellDiasRestritos.innerText = restricao.diasRestritos.join(', ');
            if (restricao.diasRestritos.join(', ').length > 21) {
                cellDiasRestritos.setAttribute('data-tooltip', restricao.diasRestritos.join(', '));
            }

            const actionsCell = row.insertCell(5);
            actionsCell.innerHTML = `
                <button class="edit-btn"><i class='bx bx-edit'></i></button>
                <button class="delete-btn"><i class='bx bx-trash'></i></button>
            `;

            actionsCell.querySelector('.edit-btn').addEventListener('click', () => editRestricao(index + startIndex));
            actionsCell.querySelector('.delete-btn').addEventListener('click', () => deleteRestricao(index + startIndex));
        });

        pageNumber.innerText = currentPage;
        prevPageBtn.disabled = currentPage === 1;
        nextPageBtn.disabled = endIndex >= filteredRestricoes.length;
    }

    function editRestricao(index) {
        const restricao = filteredRestricoes[index];
        editIndex = restricoes.indexOf(restricao);

        form.disciplina.value = restricao.disciplina;
        professorInput.value = restricao.professor;
        form.horario.value = restricao.horario;
        form.aulas.value = restricao.aulas;
        dropdownContent.querySelectorAll('input').forEach(input => {
            input.checked = restricao.diasRestritos.includes(input.value);
        });

        updateSelectedDays();
        renderTable();
    }

    function deleteRestricao(index) {
        const restricao = filteredRestricoes[index];
        restricoes.splice(restricoes.indexOf(restricao), 1);
        applyFilter();
        showMessage('Restrição deletada com sucesso!', 'success');
    }

    prevPageBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderTable();
        }
    });

    nextPageBtn.addEventListener('click', () => {
        if ((currentPage * rowsPerPage) < filteredRestricoes.length) {
            currentPage++;
            renderTable();
        }
    });

    function showMessage(message, type) {
        formMessages.className = `form-messages ${type}`;
        formMessageText.textContent = message;
        errorIcon.style.display = type === 'error' ? 'block' : 'none';
        successIcon.style.display = type === 'success' ? 'block' : 'none';
        formMessages.style.display = 'flex';
        setTimeout(() => {
            formMessages.style.opacity = '1';
        }, 10);
        setTimeout(() => {
            formMessages.style.opacity = '0';
            setTimeout(() => {
                formMessages.style.display = 'none';
            }, 500);
        }, 3000);
    }

    function clearMessages() {
        formMessages.style.display = 'none';
        formMessages.style.opacity = '0';
    }

    applyFilter();
});