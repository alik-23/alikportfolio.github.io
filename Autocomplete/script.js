'use strict'
function Autocomplete({element, list}) {
  
  const input = element.querySelector('input');
  
  // поиск совпадений
  function scanForMatches(arr) {
    removeList();
    if (!input.value) return;
    createList();
    let matchingList = element.querySelector('.matching-list');
    // для каждого совпадения создаем элемент
    for ( let i = 0; i < arr.length; i++ ) {
      let index = arr[i].toUpperCase().indexOf(input.value.toUpperCase());
      if ( index != -1 ) {
        let item = document.createElement('li');
        item.innerHTML = arr[i].slice(0, index);
        item.innerHTML += '<span class="matching-piece">' + arr[i].slice(index, index + input.value.length) + '</span>';
        item.innerHTML += arr[i].slice(index + input.value.length);
        item.dataset.country = arr[i];
        // если начинается с этой буквы/сочетания, то вставляем в начало (*)
        index == 0 ? matchingList.prepend(item) : matchingList.append(item);
        // ограничение длины списка
        if ( matchingList.children.length > 9 ) break;
      }
    }
  }
  
  // навигация стрелками
  function navigate(down) {
    // проверка наличия списка или элементов
    let matchingList = element.querySelector('.matching-list');
    if (!matchingList) return;
    let items = matchingList.children;
    if (!items.length) return;
    // поиск выбранного (активного) элемента 
    let active = element.querySelector('.active');
    let next = active ? active.nextElementSibling : null;
    let prev = active ? active.previousElementSibling : null;
    // переход по элементам
    switch (down) {
      case true:
      if (active) {
        if (next) {
          next.classList.add('active');
          active.classList.remove('active');
        } else {
          active.classList.remove('active');
          items[0].classList.add('active');
        }
      } else {
        items[0].classList.add('active');
      }
      break;
      case false:
      if (active) {
        if (prev) {
          prev.classList.add('active');
          active.classList.remove('active');
        } else {
          active.classList.remove('active');
          items[items.length -1].classList.add('active');
        }
      } else {
        items[items.length -1].classList.add('active');
      }
      break;
    }
    // останавливаем eventListener
    input.oninput = null;
    input.value = element.querySelector('.active').dataset.country;
  }
  
  // выбор с помощью клика
  function select(e) {
    input.value = e.target.dataset.country;
    submit();
  }
  
  // отправка (какое-либо действие)
  function submit() {
    removeList();
    console.log(`Submit: ${input.value}`);
  }

  function removeList() {
    let matchingList = element.querySelector('.matching-list');
    if (!matchingList) return;
    element.removeChild(matchingList);
  }

  function createList() {
    let matchingList = document.createElement('ul');
    matchingList.className = 'matching-list';
    element.append(matchingList);
  }
 
  // обработчики
  input.oninput = () => scanForMatches(countries);
  input.addEventListener('keydown', (e) => {
    switch (e.code) {
      case 'ArrowDown':
        e.preventDefault();
        navigate(true);
        break;
        case 'ArrowUp':
        e.preventDefault();
        navigate(false);
        break;
      case 'Escape':
        removeList();
        break;
      case 'Enter':
        submit();
        break;
      default:
        input.oninput = () => scanForMatches(countries);
        break;
    }
  });
  element.addEventListener('click', (e) => {
    if ( !e.target.dataset.country ) return;
    select(e);
  });
  document.addEventListener('click', () => removeList())

}






const countries = ["Afghanistan","Albania","Algeria","Andorra","Angola","Anguilla","Antigua &amp; Barbuda","Argentina","Armenia","Aruba","Australia","Austria","Azerbaijan","Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bermuda","Bhutan","Bolivia","Bosnia &amp; Herzegovina","Botswana","Brazil","British Virgin Islands","Brunei","Bulgaria","Burkina Faso","Burundi","Cambodia","Cameroon","Canada","Cape Verde","Cayman Islands","Central Arfrican Republic","Chad","Chile","China","Colombia","Congo","Cook Islands","Costa Rica","Cote D Ivoire","Croatia","Cuba","Curacao","Cyprus","Czech Republic","Denmark","Djibouti","Dominica","Dominican Republic","Ecuador","Egypt","El Salvador","Equatorial Guinea","Eritrea","Estonia","Ethiopia","Falkland Islands","Faroe Islands","Fiji","Finland","France","French Polynesia","French West Indies","Gabon","Gambia","Georgia","Germany","Ghana","Gibraltar","Greece","Greenland","Grenada","Guam","Guatemala","Guernsey","Guinea","Guinea Bissau","Guyana","Haiti","Honduras","Hong Kong","Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland","Isle of Man","Israel","Italy","Jamaica","Japan","Jersey","Jordan","Kazakhstan","Kenya","Kiribati","Kosovo","Kuwait","Kyrgyzstan","Laos","Latvia","Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg","Macau","Macedonia","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Marshall Islands","Mauritania","Mauritius","Mexico","Micronesia","Moldova","Monaco","Mongolia","Montenegro","Montserrat","Morocco","Mozambique","Myanmar","Namibia","Nauro","Nepal","Netherlands","Netherlands Antilles","New Caledonia","New Zealand","Nicaragua","Niger","Nigeria","North Korea","Norway","Oman","Pakistan","Palau","Palestine","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal","Puerto Rico","Qatar","Reunion","Romania","Russia","Rwanda","Saint Pierre &amp; Miquelon","Samoa","San Marino","Sao Tome and Principe","Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore","Slovakia","Slovenia","Solomon Islands","Somalia","South Africa","South Korea","South Sudan","Spain","Sri Lanka","St Kitts &amp; Nevis","St Lucia","St Vincent","Sudan","Suriname","Swaziland","Sweden","Switzerland","Syria","Taiwan","Tajikistan","Tanzania","Thailand","Timor L'Este","Togo","Tonga","Trinidad &amp; Tobago","Tunisia","Turkey","Turkmenistan","Turks &amp; Caicos","Tuvalu","Uganda","Ukraine","United Arab Emirates","United Kingdom","United States of America","Uruguay","Uzbekistan","Vanuatu","Vatican City","Venezuela","Vietnam","Virgin Islands (US)","Yemen","Zambia","Zimbabwe"];





















