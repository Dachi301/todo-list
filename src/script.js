'use strict';

// DOM Variables
const search = document.querySelector('.search__todo--items');
const todoItems = document.querySelector('.todo__items');
const todoTxt = document.querySelectorAll('.todo__txt');
const todoTime = document.querySelector('.todo__time');
const todoTxtTitle = document.querySelector('.todo__txt--title');
const todos = document.querySelectorAll('.todo__item');
const addTodoBtn = document.querySelector('.add__todo--btn');
const todoAddPopup = document.querySelector('.todo__add--popup');
const todoCreateBtn = document.querySelector('.todo__create--btn');
const closeBtn = document.querySelector('.x__close--btn');
const mainContainer = document.querySelector('.main__container');
const headerBg = document.querySelector('.header__background');

// Global variables
let data = JSON.parse(localStorage.getItem('todos'));

// Clear all innerHTML
todoItems.innerHTML = '';

// Popup functionality
addTodoBtn.addEventListener('click', function () {
  helperPopup('grid');
});

closeBtn.addEventListener('click', function () {
  helperPopup('none');
});

const helperPopup = (displayText) => {
  todoAddPopup.style.display = displayText;
};

// Render todo
let todosArr = [];
let uniqueTodosArr = [...todosArr];

const renderTodo = function (title) {
  if (title === '') return;

  const html = `<div class="todo__item">
  <h2 class="todo__txt">${title}</h2>
  <h2 class="completed__task">Completed</h2>
  <div class="check__icons">
  <i class="fas fa-trash-alt" id="btn" title="წაშლა" onclick="deleteTodo()"></i>
  <i class="fas fa-edit" id="todo__edit" title="დეტალების შეცვლა" onclick="editTodo()"></i>
  </div>
  </div>
  <hr class="todo__line"/>
  `;

  // Insert todos
  todoItems.insertAdjacentHTML('beforeend', html);
  todoAddPopup.style.display = 'none';
  todoTxtTitle.value = '';

  const setLocalStorage = function () {
    const txt = stringToHtml(html);
    uniqueTodosArr.push(txt);
    localStorage.setItem('todos', JSON.stringify(uniqueTodosArr));
  };

  setLocalStorage();
};

const stringToHtml = function (str) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(str, 'text/html');
  const txt = doc.body.childNodes[0].children[0].textContent;
  return txt;
};

const getLocalStorage = function () {
  const data = JSON.parse(localStorage.getItem(localStorage.key('todos')));
  if (!data) return;

  todosArr = data;

  todosArr.forEach((todo) => {
    renderTodo(todo);
  });
};

// Create todos();

const createTodos = function () {
  todoCreateBtn.addEventListener('click', function () {
    renderTodo(todoTxtTitle.value);
    window.location = 'index.html';
  });
};

// Delete todos

const deleteTodo = function (e) {
  e = e || window.event;
  let txt = e.target.closest('.todo__item').childNodes[1];

  if (confirm('დარწმუნებული ხართ, რომ ამის წაშლა გსურთ?')) {
    const data = JSON.parse(localStorage.getItem('todos'));
    data.forEach((todoTitle, index, arr) => {
      if (todoTitle === txt.textContent) {
        arr.splice(index, 1);
        localStorage.setItem('todos', JSON.stringify(arr));
        window.location = 'index.html';
      }
    });
    e.target.closest('.todo__item').nextElementSibling.classList.add('hidden');
    e.target.closest('.todo__item').style.display = 'none';
    e.target.closest('.todo__item').classList.remove('todo__item');
    e.target.parentElement.parentElement.innerHTML = '';
  }
};

// Edit todos

const editTodo = function (e) {
  e = e || window.event;
  let targetTxt = e.target.parentElement.parentElement.childNodes[1];
  let changedTxt = prompt('ტექსტის შეცვლა');

  // Validation
  if (changedTxt === null) {
    return;
  }

  const insert = function (array, index, ...elementsArray) {
    array.splice(index, 0, ...elementsArray);
  };

  if (changedTxt !== '') {
    if (todosArr.includes(targetTxt.textContent)) {
      const startingPosition = todosArr.indexOf(targetTxt.textContent);
      insert(todosArr, startingPosition, changedTxt);
      todosArr.splice(todosArr.indexOf(targetTxt.textContent), 1);
      targetTxt.textContent = changedTxt;
      localStorage.setItem('todos', JSON.stringify(todosArr));
    }
  }
};

// Other stuff

const searchEngine = function () {
  search.addEventListener('input', function () {
    let filter = search.value.toUpperCase();
    for (let i = 0; i < todoItems.children.length; i++) {
      if (i % 2 === 0) {
        if (
          todoItems.children[i].innerHTML.toUpperCase().indexOf(filter) > -1
        ) {
          todoItems.children[i].style.display = '';
        } else {
          todoItems.children[i].style.display = 'none';
        }
      }
    }
  });
};

// Create todos onkeydown

const createTodosOnKeypress = function () {
  document.documentElement.addEventListener('keydown', function (e) {
    if (e.code === 'Enter' || e.code === 'NumpadEnter') {
      if (todoAddPopup.style.display === 'grid') {
        renderTodo(todoTxtTitle.value);
      }
    }
  });
};

const init = function () {
  createTodos();
  getLocalStorage();
  createTodosOnKeypress();
  searchEngine();
};

init();
