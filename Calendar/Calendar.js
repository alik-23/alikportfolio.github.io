function Calendar (options) {
  var elem = options.id;
  var year = options.year;
  var month = options.month;
  var timer = options.timer; // необязательный компонент для отображения времени (boolean)
  var picker = options.picker; // наличие ввода даты вручную - опционально

  var timerId; // таймер для часов
  var days = [1, 2, 3, 4, 5, 6, 0]; // вспомогательный массив для renderDateTable
  var today = new Date(); // сегодняшняя дата (статична) 
  var date = new Date(year, month, 1); // текущая дата (для отслеживания)
  if (picker) {
    var pickedDate = new Date(); // дата, заданная вручную
  }

  var meta = {}; 
  // дополнительные данные для навигации
  // position: 1 - month, 2 - year, 3 - decade; 
  // target: 1 - todaysDate, 2 - datePicker


  // генерация области виджета
  function renderVidgetArea() { 
    // часы, если задано в параметрах
    if (timer) {
      var clock = document.createElement('div'); // снаружи будет отдельная функция для времени
      clock.classList.add('clock');
      clock.innerHTML = '<span class="clock_hour">00</span>:<span class="clock_min">00</span>:<span class="clock_sec">00</span>';
      elem.appendChild(clock);
      clockStart()
    }
    // сегодняшняя дата    
    var todaysDate = document.createElement('div');
    todaysDate.classList.add('todaysDate');
    var settings = {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    todaysDate.innerHTML = today.toLocaleString("en-US", settings);
    // блок-навигатор
    var navigator = document.createElement('div');
    navigator.classList.add('navigator');
    // выбранный месяц/год/декада
    var currentDate = document.createElement('div');
    currentDate.classList.add('navigator__current-date');
    // стрелки для навигации
    var leftArrow = document.createElement('i');
    var rightArrow = document.createElement('i');
    leftArrow.classList.add('navigator__left', 'fas', 'fa-angle-left');
    rightArrow.classList.add('navigator__right', 'fas', 'fa-angle-right');
    // контейнер для самого календаря 
    var container = document.createElement('div');
    container.classList.add('container');

    elem.append( todaysDate, navigator, container );
    navigator.append( leftArrow, currentDate, rightArrow );

    // область ввода даты (опционально)
    if (picker) {
      var datePicker = document.createElement('div');
      datePicker.classList.add('datePicker');
      var icon = document.createElement('i');
      icon.classList.add('far', 'fa-calendar-alt');
      datePicker.appendChild(icon);
      todaysDate.after(datePicker);
      elem.addEventListener('click', function(e) { 
        if ( !e.target.classList.contains('fa-calendar-alt') ) return;
        togglePicker();
      });
    }
  }

  // генерация календаря (за 1 месяц)
  function renderDateTable() {  
    // шапка таблицы  
    var table = document.createElement('table');
    table.classList.add('dateTable');
    table.innerHTML = '<tr><th>Mo</th><th>Tu</th><th>We</th><th>Th</th><th>Fr</th><th>Sa</th><th>Su</th></tr>'; 
    // отслеживаемый месяц
    var settings = {
      year: 'numeric',
      month: 'long',
    };
    var currentMonth = date.getMonth();
    elem.querySelector('.navigator__current-date').innerHTML = date.toLocaleString("en-US", settings);
    // генерируем строки (недели)
    for ( var i = 0; i < 6; i++ ) {
      var row = document.createElement('tr');
      for ( var j = 0; j < 7; j++ ) {
        var cell = document.createElement('td');
        if ( date.getDay() == days[j]  ) {
          cell.innerHTML = date.getDate();
          if ( date.getMonth() == currentMonth ) {
            cell.classList.add('currentMonth'); // выделяем дни текущего месяца
           } else {
             cell.classList.add('notThisMonth')
           }
          date.setDate( date.getDate() + 1 );
          row.appendChild(cell);
        } else {
          // если день недели не соответствует -> откат на предыдущий день
          date.setDate( date.getDate() - 1 );
          j--;
        }
      }
      table.querySelector('tbody').appendChild(row);
      // если дошли до следующего месяца, то то нет смысла генерировать 6 строку в таблице 
      if ( date.getMonth() > currentMonth ) break;
    }
    elem.querySelector('.container').appendChild(table);
    date.setDate( date.getDate() - 15 ); // откатываемся на 15 дней, чтобы передвижение отображалось корректно
    meta.position = 1;
    // выделяем сегодняшний день с помощью класса
    if ( today.getFullYear() == date.getFullYear() && today.getMonth() == date.getMonth() ) {
      setTimeout(function () {
        elem.querySelectorAll('.currentMonth')[ today.getDate() - 1 ].classList.add('presentDay', 'focusedDate');
      }, 350);  
    }
  }

  // генерация календаря (по месяцам - за 1 год)
  function renderMonthTable() {  
    elem.querySelector('.navigator__current-date').innerHTML = date.getFullYear();
    var table = document.createElement('table');
    table.classList.add('monthTable');
    table.innerHTML = '<tr><td>Jan</td><td>Feb</td><td>Mar</td><td>Apr</td></tr><tr><td>May</td><td>Jun</td><td>Jul</td><td>Aug</td></tr><tr><td>Sep</td><td>Oct</td><td>Nov</td><td>Dec</td></tr>';
    elem.querySelector('.container').appendChild(table);
    var cells = elem.querySelectorAll('.monthTable td');
    cells.forEach( function(item) {
      item.classList.add('currentYear');
    });
    meta.position = 2;
    // выделяем текущий месяц
    if ( today.getFullYear() == date.getFullYear() ) {
      setTimeout(function () {
        elem.querySelectorAll('.currentYear')[ today.getMonth() ].classList.add('presentMonth');
      }, 350);  
    }
  }

  // генерация календаря (по годам)
  function renderYearTable() {  
    var year = '' + date.getFullYear();
    year = +( year.slice(0, -1) + '0' );
    var floor = year,
        ceiling = year + 9;  
    elem.querySelector('.navigator__current-date').innerHTML = floor + '-' + ceiling;
    var table = document.createElement('table');
    table.classList.add('yearTable');
    var n = -1;
    for ( var i = 0; i < 3; i++ ) {
      var row = document.createElement('tr');
      for ( var j = 0; j < 4; j++ ) {
        var cell = document.createElement('td');
        cell.innerHTML = year + n;
        if ( n > -1 && n < 10 ) {
          cell.classList.add('currentDecade'); // выделяем текущую декаду
        } else {
          cell.classList.add('notThisDecade');
        }
        n++;
        row.appendChild(cell);
      }
      table.appendChild(row);
    }
    elem.querySelector('.container').appendChild(table);
    meta.position = 3;
    // выделение текущего года
    if ( today.getFullYear() >= floor && today.getFullYear() <= ceiling ) {
      var yearIndex = today.getFullYear() - floor;
      setTimeout(function () {
        elem.querySelectorAll('.currentDecade')[yearIndex].classList.add('presentYear');
      }, 350); 
    }
  }


  // функция для навигации по месяцам/годам и т.д.
  function moveTable(forward) { // forward == true если нажата правая стрелка
    var tables = elem.getElementsByTagName('table');
    var oldTable = tables[ tables.length - 1 ]; 
    oldTable.style.position = 'absolute';     
    // старая таблица позиционируется абсолютно и, в зависимости от нажатой кнопки, уходит влево/вправо 
    oldTable.style.transform = 'translateX(' + (forward ? '-1' : '1') + '00%)' ;
    // проверяем, какой тип календаря показан, и выполняем соответстующий рендеринг (с учетом нажатой стрелки)
    if ( meta.target == 1 ) {
      date.setFullYear( today.getFullYear(), today.getMonth(), 1);
      renderDateTable();
    } else if ( meta.target == 2 ) {
      date.setFullYear( pickedDate.getFullYear(), pickedDate.getMonth(), 1);
      renderDateTable();
    } else if ( meta.position == 1 ) {
      date.setMonth( date.getMonth() + ( forward ? 1 : -1 ), 1);
      renderDateTable();
    } else if ( meta.position == 2 ) {
      date.setFullYear( date.getFullYear() + ( forward ? 1 : -1 ));
      renderMonthTable();
    } else if ( meta.position == 3 ) { 
      date.setFullYear( date.getFullYear() + ( forward ? 10 : -10 ));
      renderYearTable();
    }
    // поиск новой таблицы, добавление эффектов и удаление старых таблиц
    var newTable = elem.getElementsByTagName('table')[ tables.length - 1 ];  // находим новую таблицу (находится в конце)
    // снова проверка стрелки, но уже для новой таблицы
    newTable.style.transform = 'translateX(' + (forward ? '1' : '-1') + '00%)' ;
    setTimeout( function() {
      newTable.style.transform = 'translateX(0)';
    }, 0);
    // удаляем старые таблицы (с небольшой задержкой)
    setTimeout( function() {
      for (var i = 0; i < tables.length - 1; i++) {
        elem.querySelector('.container').removeChild( tables[i] ); 
      }
    }, 300)
  }

  // функция "всплытия" на верхний уровень
  function bubbleUp() {
    var tables = elem.getElementsByTagName('table');
    var oldTable =tables[ tables.length - 1 ]; 
    oldTable.style.position = 'absolute';
    oldTable.style.transform = 'scale(0, 0)';
    oldTable.style.opacity = '0';
    // проверяем на каком уровне мы находимся
    if ( meta.position == 2 ) {
      renderYearTable();
    } else if ( meta.position == 1 ) {
      renderMonthTable();
    }
    var newTable = elem.getElementsByTagName('table')[ tables.length - 1 ];
    newTable.style.transform = 'scale(3, 3)';
    newTable.style.opacity = '0';
    setTimeout( function() {
      newTable.style.transform = 'scale(1, 1)';
      newTable.style.opacity = '1';
    }, 50);
    setTimeout( function() {
      for (var i = 0; i < tables.length - 1; i++) {
        elem.querySelector('.container').removeChild( tables[i] ); 
      }
    }, 300)
  }

  // функция для "погружения" на нижний уровень
  function diveIn(e) {
    var tables = elem.getElementsByTagName('table');
    var oldTable =tables[ tables.length - 1 ]; 
    oldTable.style.position = 'absolute';
    oldTable.style.transform = 'scale(3, 3)';
    oldTable.style.opacity = '0';
    var cells = document.querySelectorAll('.container td'); // извлекаем HTML collection ячеек
    cells.indexOf = [].indexOf; // заимствуем метод массива
    // проверяем на каком уровне мы находимся
    if ( meta.target == 1 ) { 
      date = new Date(); // возвращаемся к сегодняшней дате
      date.setDate(1);
      renderDateTable();
    } else if ( meta.target == 2 ) {
      date.setFullYear( pickedDate.getFullYear(), pickedDate.getMonth(), 1 );
      renderDateTable();
    } else if ( meta.position == 2 ) {
      date.setMonth( cells.indexOf(e.target), 1 );
      renderDateTable();
    } else if ( meta.position == 3 ) {
      date.setFullYear( +e.target.innerHTML );
      renderMonthTable();
    } 
    var newTable = elem.getElementsByTagName('table')[ tables.length - 1 ];
    newTable.style.transform = 'scale(0.5, 0.5)';
    newTable.style.opacity = '0';
    setTimeout( function() {
      newTable.style.transform = 'scale(1, 1)';
      newTable.style.opacity = '1';
    }, 50);
    setTimeout( function() {
      for (var i = 0; i < tables.length - 1; i++) {
        elem.querySelector('.container').removeChild( tables[i] ); 
      }
    }, 300)
  }

  // функция для обновления времени
  function updateTime() {
    var clock = elem.querySelector('.clock');
    var d = new Date(); 
    var hours = d.getHours();
    if (hours < 10) hours = '0' + hours;
    clock.children[0].innerHTML = hours;
    var minutes = d.getMinutes();
    if (minutes < 10) minutes = '0' + minutes;
    clock.children[1].innerHTML = minutes;
    var seconds = d.getSeconds();
    if (seconds < 10) seconds = '0' + seconds;
    clock.children[2].innerHTML = seconds;
  }
  function clockStart() { // запустить часы
    timerId = setInterval(updateTime, 1000);
    updateTime();
  }
  function clockStop() { // остановить часы
    clearInterval(timerId);
    timerId = null;
  }

  // генерация (отображение) поля ввода даты
  function renderDatePicker() {
    var parent = document.querySelector('.datePicker');
    var field = document.createElement('div');
    field.classList.add('pickerField', 'pickerField_open');

    var yy = document.createElement('input');
    yy.type = 'number';
    yy.classList.add('pickerField__year');
    yy.value = today.getFullYear(); // значение по умолчанию - сегодняшняя дата
    yy.min = '1';
    yy.max = '10000'; // ставим лимиты

    var monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    var mm = document.createElement('select');
    mm.classList.add('pickerField__month');
    for ( var i = 0; i < 12; i++ ) {
      var opt = document.createElement('option');
      opt.value = i;
      opt.innerHTML = monthNames[i];
      mm.appendChild(opt);
    }
    mm.value = today.getMonth();

    var dd = document.createElement('input');
    dd.classList.add('pickerField__day');
    dd.type = 'number';
    dd.min = '1';
    dd.max = daysInMonth(yy.value, mm.value);
    dd.value = today.getDate(); // для каждого месяца свой максимальный лимит

    var ok = document.createElement('button');
    ok.type = 'button';
    ok.classList.add('pickerField__ok')
    ok.innerHTML = 'OK'

    // field.append('Year: ', yy, 'Month: ', mm, 'Day: ', dd, ok);
    field.append( yy,  mm, dd, ok);

    parent.appendChild(field);

    // здесь же назначаем обработчики
    ok.onclick = function() {
      // проверяем на положительность и целочисленность
      if ( !validate(dd) || !validate(yy) ) return; 
      meta.target = 2;
      pickedDate.setFullYear( yy.value, mm.value, dd.value ); 
      if ( yy.value == date.getFullYear() && mm.value == date.getMonth() ) var stillHere = true;
      enterDate(null, pickedDate, date);
      meta.target = null;
      // выделить выбранный день
      if (stillHere) {
        if ( elem.querySelector('.focusedDate') ) {
          elem.querySelector('.focusedDate').classList.remove('focusedDate');
        }
        elem.querySelectorAll('.currentMonth')[ pickedDate.getDate() - 1 ].classList.add('focusedDate');
      } else {
        setTimeout(function () {
          elem.querySelectorAll('.currentMonth')[ pickedDate.getDate() - 1 ].classList.add('focusedDate');
        }, 350);
      }
    }

    field.onkeydown = function(e) {
      if ( e.code == 'Enter' ) {
        ok.click(); // можно ввести дату с помощью нажатия на Enter
        if ( e.target == mm ) e.preventDefault(); // предотвратить выпадание поля select
      }
    }

    yy.oninput =  mm.onchange = function() {
      dd.max = daysInMonth(+yy.value, +mm.value); 
    }
  }

  function togglePicker() {
    if ( !elem.querySelector('.pickerField') ) {
      // если элемента нет, то осуществляем рендеринг
      renderDatePicker(); 
    } else {
      // иначе просто присваиваем/удаляем класс
      elem.querySelector('.pickerField').classList.toggle('pickerField_open');
    }
  }

  // функция для определения количества дней в месяце
  function daysInMonth (year, month) {
    return new Date(year, month + 1, 0).getDate();
  }

  // проверка на целочисленное значение
  function validate(date) {
    if ( +date.value < +date.min || +date.value > +date.max || !Number.isInteger(+date.value) ) {
      return false
    }
    return true;
  }

  // установка даты (сегодняшней или вручную)
  function enterDate(e, target, current) { 
    if ( meta.position != 1 ) {
      diveIn(e);
    } else {
      // двигаемся вперед или назад, в зависимости от того, где мы находимся
      if ( target.getFullYear() > current.getFullYear() ) {
        moveTable(true);
      } else if ( target.getFullYear() < current.getFullYear() ) {
        moveTable();
      } else if ( target.getMonth() > current.getMonth() ) {
        moveTable(true);
      } else if ( target.getMonth() < current.getMonth() ) {
        moveTable();
      }
    }
  }

  // функция для выделения ячейки при фокусировке
  function focusDate(e) {
    if ( elem.querySelector('.focusedDate') ) {
      elem.querySelector('.focusedDate').classList.remove('focusedDate');
    }
    e.target.classList.add('focusedDate');
  }


  // обработчики событий
  elem.addEventListener('click', function(e) {    // функции для стрелок
    if ( e.target.classList.contains('navigator__right') ) {
      moveTable(true); 
    } else if ( e.target.classList.contains('navigator__left') ) {
      moveTable();
    } 
  });
  elem.addEventListener('click', function(e) {   // возвращение к сегодняшней дате
    if ( e.target.classList.contains('todaysDate') ) {
      meta.target = 1;
      enterDate(e, today, date);
      meta.target = null;
    }
  });
  elem.addEventListener('click', function(e) { 
    if ( !e.target.classList.contains('navigator__current-date') ) return;
    if ( !this.querySelector('.yearTable') ) bubbleUp();  // всплытие
  });
  elem.addEventListener('click', function(e) {  
    if ( e.target.tagName != 'TD' ) return;
    if ( !this.querySelector('.dateTable') ) {
      diveIn(e); // если на верхнем уровне, то погружаемся
    } else {
      focusDate(e); // если на нижнем - получаем возможность выделения ячеек
    }
  });
  elem.addEventListener('wheel', function (e) { 
    ( e.deltaY > 0 ) ? moveTable(true) : moveTable(); 
    e.preventDefault();
  });




  this.renderVidgetArea = renderVidgetArea;
  this.renderDateTable = renderDateTable;
  this.moveForward = function() { moveTable(true) };
  this.moveBackward = moveTable;
  if (timer) {
    this.clockStart = clockStart;
    this.clockStop = clockStop;
  }
}
