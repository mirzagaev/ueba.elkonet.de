$(document).ready(function() {
  $('.toggletextcontent').on('click', function () {
    const button = $(this);
    const textContainer = button.siblings('.text-collapse');

    const expanded = textContainer.hasClass('expanded');

    if (expanded) {
      // einklappen
      textContainer.removeClass('max-h-full expanded').addClass('max-h-[13rem]');
      button.text('mehr anzeigen');
    } else {
      // ausklappen
      textContainer.removeClass('max-h-[13rem]').addClass('max-h-full expanded');
      button.text('weniger anzeigen');
    }
  });
});