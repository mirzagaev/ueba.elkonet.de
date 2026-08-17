$(document).ready(function() {
  $("#loginUebaBtn").click(function(event) {
    event.preventDefault();
    $("#loginUebaForm").show();
    $("#loginUebaBtn").hide();
    // $("#loginLernweltBtn").hide();
    return false;
  })
});