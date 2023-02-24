//===========================
// EVENT HANDLERS
//===========================

function addNewTodo(todo, callback) {
    $.post('/todos', todo)
        .done(callback)
        .catch(err => alert(err.statusText));
}

function deleteTodo(todo, callback) {
    $.ajax({
            type: 'DELETE',
            url: "/todos",
            data: todo,
        })
        .done(callback)
        .catch(err => alert(err.statusText));
}

function updateTodo(todo, callback) {
    $.ajax({
            type: 'PUT',
            url: '/todos',
            data: todo
        })
        .done(callback)
        .catch(err => alert(err.statusText));
}

//============================
// EVENT LISTENERS
//============================

/**
 * Add todo (on click)
 */
$('#addTodoBtn').on('click', () => {
    const newTodo = {
        task: $('#newTodoInput').val(),
        done: 0
    }
    addNewTodo(newTodo, location.reload());
    $('#newTodoInput').val('');
});

/**
 * Add todo (on enter)
 */
$('#newTodoInput').on('keyup', function (e) {
    if (e.keyCode !== 13) return;

    const newTodo = {
        task: $('#newTodoInput').val(),
        done: 0
    }
    addNewTodo(newTodo, location.reload());
    $('#newTodoInput').val('');
});

/**
 * Toggle todo
 */
$(document).on('click', '.toggleBtn', function () {
    const parent = $(this).parent().parent();
    const toggledTodo = {
        id: $(parent).attr('todoid'),
        task: $(parent).attr('todoname'),
        done: ($(parent).attr('tododone') == 1) ? 0 : 1, // Toggle 0 and 1
    }
    updateTodo(toggledTodo, location.reload());
});

/**
 * Delete todo
 */
$(document).on('click', '.deleteBtn', function () {
    const parent = $(this).parent().parent();
    const idToDelete = $(parent).attr('todoId');

    if (!idToDelete) return;

    deleteTodo({ id: idToDelete }, location.reload());
});

/**
 * Edit todo: show edit input
 */
$(document).on('click', '.taskBtn', function () {
    const taskInput = $(this).next();
    $(taskInput).show().focus();
    $(this).hide();
});

/**
 * Edit todo: (on blur) update todo and hide edit input
 */
$(document).on('blur', '.editTask', function () {
    $(this).prev().show(); // Task button
    $(this).hide(); // Input

    const parent = $(this).parent().parent();
    const updatedTask = $(this).val().trim();
    const originalTask = $(parent).attr('todotask');
    const updatedTodo = {
        id: parseInt($(parent).attr('todoid')),
        task: updatedTask,
        done: $(parent).attr('tododone')
    }

    if (updatedTask === originalTask || updatedTask.trim() === '') return;

    updateTodo(updatedTodo, location.reload());
});

/**
 * Edit todo: (on enter) update todo and hide edit input
 */
$(document).on('keyup', '.editTask', function (e) {
    if (e.keyCode !== 13) return;

    $(this).prev().show(); // Task button
    $(this).hide(); // Input

    const parent = $(this).parent().parent();
    const updatedTask = $(this).val().trim();
    const originalTask = $(parent).attr('todotask');
    const updatedTodo = {
        id: parseInt($(parent).attr('todoid')),
        task: updatedTask,
        done: $(parent).attr('tododone')
    }

    if (updatedTask === originalTask || updatedTask.trim() === '') return;

    updateTodo(updatedTodo, location.reload());
});