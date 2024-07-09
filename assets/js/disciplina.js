document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('disciplina-form');
    const tableBody = document.getElementById('disciplinas-table').getElementsByTagName('tbody')[0];
    const prevPageBtn = document.getElementById('prevPage');
    const nextPageBtn = document.getElementById('nextPage');
    const pageNumber = document.getElementById('pageNumber');

    const rowsPerPage = 8;
    let currentPage = 1;
    let disciplinas = [];

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const disciplina = {
            nome: form.nome.value,
            professor: form.professor.value,
            aulas: form.aulas.value,
            dias: form.dias.value,
            alunos: form.alunos.value,
        };

        disciplinas.push(disciplina);
        renderTable();
        form.reset();
    });

    function renderTable() {
        tableBody.innerHTML = '';

        const startIndex = (currentPage - 1) * rowsPerPage;
        const endIndex = startIndex + rowsPerPage;
        const pageItems = disciplinas.slice(startIndex, endIndex);

        pageItems.forEach((disciplina, index) => {
            const row = tableBody.insertRow();

            row.insertCell(0).innerText = disciplina.nome;
            row.insertCell(1).innerText = disciplina.professor;
            row.insertCell(2).innerText = disciplina.aulas;
            row.insertCell(3).innerText = disciplina.dias;
            row.insertCell(4).innerText = disciplina.alunos;

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
        nextPageBtn.disabled = endIndex >= disciplinas.length;
    }

    function editDisciplina(index) {
        const disciplina = disciplinas[index];

        form.nome.value = disciplina.nome;
        form.professor.value = disciplina.professor;
        form.aulas.value = disciplina.aulas;
        form.dias.value = disciplina.dias;
        form.alunos.value = disciplina.alunos;

        disciplinas.splice(index, 1);
        renderTable();
    }

    function deleteDisciplina(index) {
        disciplinas.splice(index, 1);
        renderTable();
    }

    prevPageBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderTable();
        }
    });

    nextPageBtn.addEventListener('click', () => {
        if ((currentPage * rowsPerPage) < disciplinas.length) {
            currentPage++;
            renderTable();
        }
    });

    renderTable();
});
