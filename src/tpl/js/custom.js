// System-Design: 'dark' | 'light' | 'auto' (Default: 'auto', folgt der Systemeinstellung)
// beim Laden sowie bei jedem Aufruf angewendet:
function applyTheme() {
  var theme = localStorage.getItem('theme') || 'auto';
  var shouldBeDark = theme === 'auto'
    ? window.matchMedia('(prefers-color-scheme: dark)').matches
    : theme === 'dark';

  document.documentElement.classList.toggle('dark', shouldBeDark);
}
applyTheme();

// reagiert live auf einen Wechsel der Systemeinstellung, solange 'auto' aktiv ist
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function () {
  if ((localStorage.getItem('theme') || 'auto') === 'auto') {
    applyTheme();
  }
});

// von der Einstellungen-Seite (site/ueba/v3/settings) aufgerufen: mode = 'dark' | 'light' | 'auto'
function setSystemStyle(mode) {
  localStorage.setItem('theme', mode);
  applyTheme();
}

// bisheriger binaerer Umschalt-Button (noch verwendet in skin/ueba/login/body.html);
// beruecksichtigt keinen 'auto'-Modus, schaltet nur zwischen hell/dunkel
function toggleDarkMode() {
  var isDark = document.documentElement.classList.contains('dark');
  setSystemStyle(isDark ? 'light' : 'dark');
}

$(document).ready(function() {
  /*  START: Passwort anzeigen/ausblenden */
  if($("#password").length && $("#password").val().length > 0) {
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
  /*  ENDE: Passwort anzeigen/ausblenden */

  $("a.berichtsheftLinks").each(function() {
    var actBerBeruf = $(this).attr("data-berichtsheftlinkfuerberuf");
    var actBerBerufLink = $(this).attr("href");

    $("a[data-berichtsheftfuerberuf='"+actBerBeruf+"']").attr("href", actBerBerufLink);
  });

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
});

function getContent() {
  // y = document.getElementById("theContent");
  let htmlContent = $("div.templateLayout").html();
  $("#theContent").text(htmlContent);
}