$(document).ready(function () {
  $('nav a').click(function navClickEvent() {
    // TODO: reset form
  });

  $('a[data-toggle="tab"]').on('show.bs.tab', function (e) {

    // unveil images
    var tab = $(e.target).attr('href');
    $(tab + ' img.lazy').unveil();
  });

  $('input[type=text]').searchFilter({
    targetSelector: '#list .active .item',
    charCount: 3
  });
});
