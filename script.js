document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const addTaskButton = document.getElementById('addTaskButton');
    const taskList = document.getElementById('taskList');
    const viewTasksButton = document.getElementById('viewTasksButton');
    const modal = document.getElementById('modal');
    const modalTaskList = document.getElementById('modalTaskList');
    const closeButton = document.querySelector('.close-button');

    addTaskButton.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTask();
    });

    viewTasksButton.addEventListener('click', showModal);
    closeButton.addEventListener('click', closeModal);
    window.addEventListener('click', (event) => {
        if (event.target == modal) closeModal();
    });

    function addTask() {
        const taskText = taskInput.value.trim();
        if (taskText !== '') {
            const taskItem = createTaskItem(taskText, new Date().toLocaleString(), null);
            taskList.appendChild(taskItem);
            taskInput.value = '';
            saveTasks();
        }
    }

    function createTaskItem(text, createdDate, completedDate) {
        const taskItem = document.createElement('li');
        taskItem.className = 'task-item';

        const taskContent = document.createElement('span');
        taskContent.textContent = text;
        taskItem.appendChild(taskContent);

        const taskDates = document.createElement('div');
        taskDates.className = 'task-dates';
        taskDates.innerHTML = `<span>Criado em: ${createdDate}</span><br><span>${completedDate ? `Concluído em: ${completedDate}` : ''}</span>`;
        taskItem.appendChild(taskDates);

        const taskActions = document.createElement('div');
        taskActions.className = 'task-actions';

        const completeButton = document.createElement('button');
        completeButton.textContent = 'Completar';
        completeButton.addEventListener('click', () => {
            taskItem.classList.toggle('completed');
            if (taskItem.classList.contains('completed')) {
                taskDates.innerHTML = `<span>Criado em: ${createdDate}</span><br><span>Concluído em: ${new Date().toLocaleString()}</span>`;
            } else {
                taskDates.innerHTML = `<span>Criado em: ${createdDate}</span><br><span></span>`;
            }
            saveTasks();
        });
        taskActions.appendChild(completeButton);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Excluir';
        deleteButton.addEventListener('click', () => {
            taskList.removeChild(taskItem);
            saveTasks();
        });
        taskActions.appendChild(deleteButton);

        taskItem.appendChild(taskActions);

        return taskItem;
    }

    function saveTasks() {
        const tasks = [];
        document.querySelectorAll('.task-item').forEach(taskItem => {
            const taskDates = taskItem.querySelector('.task-dates').innerHTML.split('<br>');
            tasks.push({
                text: taskItem.querySelector('span').textContent,
                createdDate: taskDates[0].replace('Criado em: ', ''),
                completedDate: taskDates[1] ? taskDates[1].replace('Concluído em: ', '') : null,
                completed: taskItem.classList.contains('completed')
            });
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach(task => {
            const taskItem = createTaskItem(task.text, task.createdDate, task.completedDate);
            if (task.completed) taskItem.classList.add('completed');
            taskList.appendChild(taskItem);
        });
    }

    function showModal() {
        modalTaskList.innerHTML = '';
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach(task => {
            const taskItem = document.createElement('li');
            taskItem.className = 'task-item';
            if (task.completed) taskItem.classList.add('completed');

            const taskContent = document.createElement('span');
            taskContent.textContent = task.text;
            taskItem.appendChild(taskContent);

            const taskDates = document.createElement('div');
            taskDates.className = 'task-dates';
            taskDates.innerHTML = `<span>Criado em: ${task.createdDate}</span><br><span>${task.completedDate ? `Concluído em: ${task.completedDate}` : ''}</span>`;
            taskItem.appendChild(taskDates);

            modalTaskList.appendChild(taskItem);
        });
        modal.style.display = 'block';
    }

    function closeModal() {
        modal.style.display = 'none';
    }

    loadTasks();
});
