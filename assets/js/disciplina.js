document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('disciplina-form');
    const tableBody = document.getElementById('disciplinas-table').getElementsByTagName('tbody')[0];
    const prevPageBtn = document.getElementById('prevPage');
    const nextPageBtn = document.getElementById('nextPage');
    const pageNumber = document.getElementById('pageNumber');
    const searchBar = document.getElementById('search-bar');
    const formMessages = document.getElementById('form-messages');
    const formMessageText = document.getElementById('form-message-text');
    const errorIcon = document.getElementById('error-icon');
    const successIcon = document.getElementById('success-icon');

    const rowsPerPage = 5;
    let currentPage = 1;
    let disciplinas = [];
    let filteredDisciplinas = [];
    let editIndex = -1; 

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        
        const inputs = form.querySelectorAll('input');
        let formIsValid = true;
        let errorMessage = '';

        inputs.forEach(input => {
            if (input.value.trim() === '') {
                formIsValid = false;
                errorMessage = 'Todos os campos são obrigatórios.';
            } else if (input.type === 'number' && input.value <= 0) {
                formIsValid = false;
                errorMessage = 'Os valores numéricos devem ser maiores que zero.';
            }
        });

        if (!formIsValid) {
            showMessage(errorMessage, 'error');
            return;
        }

        const disciplina = {
            nome: form.nome.value,
            professor: form.professor.value,
            aulas: form.aulas.value,
            dias: form.dias.value,
            alunos: form.alunos.value,
        };

        if (editIndex === -1) {
            disciplinas.push(disciplina);
        } else {
            disciplinas.splice(editIndex, 1);
            disciplinas.push(disciplina);
            editIndex = -1;
        }

        applyFilter();
        form.reset();
        currentPage = Math.ceil(filteredDisciplinas.length / rowsPerPage);
        renderTable();
        showMessage('Disciplina salva com sucesso!', 'success');
    });

    form.addEventListener('input', () => {
        clearMessages();
    });

    searchBar.addEventListener('input', () => {
        applyFilter();
    });

    function applyFilter() {
        const searchTerm = searchBar.value.toLowerCase();
        filteredDisciplinas = disciplinas.filter(disciplina => {
            return (
                disciplina.nome.toLowerCase().includes(searchTerm) ||
                disciplina.professor.toLowerCase().includes(searchTerm)
            );
        });
        currentPage = 1;
        renderTable();
    }

    function renderTable() {
        tableBody.innerHTML = '';

        const startIndex = (currentPage - 1) * rowsPerPage;
        const endIndex = startIndex + rowsPerPage;
        const pageItems = filteredDisciplinas.slice(startIndex, endIndex);

        pageItems.forEach((disciplina, index) => {
            const row = tableBody.insertRow();

            const cellNome = row.insertCell(0);
            cellNome.innerText = disciplina.nome;
            if (disciplina.nome.length > 21) {
                cellNome.setAttribute('data-tooltip', disciplina.nome);
            }

            const cellProfessor = row.insertCell(1);
            cellProfessor.innerText = disciplina.professor;
            if (disciplina.professor.length > 21) {
                cellProfessor.setAttribute('data-tooltip', disciplina.professor);
            }

            const cellAulas = row.insertCell(2);
            cellAulas.innerText = disciplina.aulas;
            if (disciplina.aulas.length > 21) {
                cellAulas.setAttribute('data-tooltip', disciplina.aulas);
            }
            
            const cellDias = row.insertCell(3);
            cellDias.innerText = disciplina.dias;
            if (disciplina.dias.length > 21) {
                cellDias.setAttribute('data-tooltip', disciplina.dias);
            }

            const cellAlunos = row.insertCell(4);
            cellAlunos.innerText = disciplina.alunos;
            if (disciplina.alunos.length > 21) {
                cellAlunos.setAttribute('data-tooltip', disciplina.alunos);
            }
            
            const actionsCell = row.insertCell(5);
            actionsCell.innerHTML = `
                <button class="edit-btn"><i class='bx bx-edit'></i></button>
                <button class="delete-btn"><i class='bx bx-trash'></i></button>
            `;

            actionsCell.querySelector('.edit-btn').addEventListener('click', () => editDisciplina(index + startIndex));
            actionsCell.querySelector('.delete-btn').addEventListener('click', () => deleteDisciplina(index + startIndex));
        });

        pageNumber.innerText = currentPage;
        prevPageBtn.disabled = currentPage === 1;
        nextPageBtn.disabled = endIndex >= filteredDisciplinas.length;

        initializeTooltips();
    }

    function initializeTooltips() {
        const cells = tableBody.querySelectorAll('td[data-tooltip]');
        cells.forEach(cell => {
            cell.addEventListener('mouseenter', (e) => {
                const tooltip = document.createElement('div');
                tooltip.className = 'tooltip';
                tooltip.innerText = cell.getAttribute('data-tooltip');

                const rect = cell.getBoundingClientRect();
                tooltip.style.left = `${rect.left + window.pageXOffset}px`;
                tooltip.style.top = `${rect.top + window.pageYOffset - tooltip.offsetHeight}px`;
            });

            cell.addEventListener('mouseleave', () => {
                const tooltip = document.querySelector('.tooltip');
                if (tooltip) {
                    tooltip.remove();
                }
            });
        });
    }

    function editDisciplina(index) {
        const disciplina = filteredDisciplinas[index];
        editIndex = disciplinas.indexOf(disciplina); 

        form.nome.value = disciplina.nome;
        form.professor.value = disciplina.professor;
        form.aulas.value = disciplina.aulas;
        form.dias.value = disciplina.dias;
        form.alunos.value = disciplina.alunos;

        renderTable(); 
    }

    function deleteDisciplina(index) {
        const disciplina = filteredDisciplinas[index];
        disciplinas.splice(disciplinas.indexOf(disciplina), 1);
        applyFilter();
    }

    prevPageBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderTable();
        }
    });

    nextPageBtn.addEventListener('click', () => {
        if ((currentPage * rowsPerPage) < filteredDisciplinas.length) {
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
