// beim Laden
if (localStorage.getItem('theme') === 'dark') {
  document.documentElement.classList.add('dark');
}

// beim Umschalten
function toggleDarkMode() {
  document.documentElement.classList.toggle('dark');
  localStorage.setItem('theme',
    document.documentElement.classList.contains('dark') ? 'dark' : 'light'
  );
}

$(document).ready(function() {

  $("#loginUebaBtn").click(function(event) {
    event.preventDefault();
    $("#loginUebaForm").show();
    $("#loginUebaBtn").hide();
    // $("#loginLernweltBtn").hide();
    return false;
  })

});