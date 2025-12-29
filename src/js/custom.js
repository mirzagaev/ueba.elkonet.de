// beim Laden
if (localStorage.getItem('theme') === 'dark') {
  document.documentElement.classList.add('dark');
}

// Light/Dark Mode
function toggleDarkMode() {
  document.documentElement.classList.toggle('dark');
  localStorage.setItem('theme',
    document.documentElement.classList.contains('dark') ? 'dark' : 'light'
  );
}

$(document).ready(function() {
  /*  START: Startseite: Passwort anzeigen/ausblenden */
  if($("#password").val().length > 0) {
    $(".toggle-btn").show();
  } else {
    $(".toggle-btn").hide();
  }

  $("#password").keyup(function() {
    if($(this).val().length > 0) {
      $(".toggle-btn").show();
    } else {
      $(".toggle-btn").hide();
    }
  });

  $(".toggle-btn").click(function() {
    if ( $("#password").attr("type") === "password" ) {
      $("#password").attr("type", "text");
      $("#pwTogglerSVG").html('<use xlink:href="#icon-eye-slash"></use>');
    } else {
      $("#password").attr("type", "password");
      $("#pwTogglerSVG").html('<use xlink:href="#icon-eye"></use>');
    }
  });
  /*  ENDE: Startseite: Passwort anzeigen/ausblenden */


  // Slide-in login form logic for index-proposal.html
  $('#loginUebaBtn').on('click', function(event) {
    event.preventDefault();
    // Slide out options to the right
    $('#loginOptions').removeClass('translate-x-0').addClass('translate-x-full');
    // Slide in form from the left
    $('#loginUebaForm').removeClass('-translate-x-full').addClass('translate-x-0');
  });

  $('#backToLoginOptions').on('click', function(event) {
    event.preventDefault();
    // Slide in options from the left
    $('#loginOptions').removeClass('translate-x-full').addClass('translate-x-0');
    // Slide out form to the left
    $('#loginUebaForm').removeClass('translate-x-0').addClass('-translate-x-full');
  });

  $('.toggletextcontent').on('click', function () {
    const button = $(this);
    const textContainer = button.siblings('.text-collapse');

    const expanded = textContainer.hasClass('expanded');

    if (expanded) {
      // einklappen
      textContainer.removeClass('max-h-[1000px] expanded').addClass('max-h-[6rem]');
      button.text('mehr anzeigen');
    } else {
      // ausklappen
      textContainer.removeClass('max-h-[6rem]').addClass('max-h-[1000px] expanded');
      button.text('weniger anzeigen');
    }
  });

  $(".quizradio:not(.disabled)").click(function () {
    $(".quizradio").removeClass("active");
    $(this).addClass("active");
  });

  $(".quizcheck input").on("change", function () {
    $(this).closest(".quizcheck").toggleClass("active");
  });
});