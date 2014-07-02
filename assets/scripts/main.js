var api, item;
var limit = 100;
var iterator = 0;
var list = document.getElementById('list');

for (api in APIS) {
  if (APIS.hasOwnProperty(api)) {
    if (iterator >= limit) {
      break;
    }

    item = document.createElement('div');
    item.className = 'item';
    item.innerHTML = template(APIS[api]);

    list.appendChild(item);

    iterator++;
  }
}
