$(document).ready(function() {

    $('html, body').animate({
        scrollTop: $('.quizwrap').offset().top
    }, 600);

    $(".quizradio:not(.disabled)").click(function () {
        $(".quizradio").removeClass("active");
        $(this).addClass("active");
    });

    $(".quizcheck input").on("change", function () {
        $(this).closest(".quizcheck").toggleClass("active");
    });
    
    $(".quizoptions").each(function() {
        var container = $(this);

        // bereits ausgewertete Frage? -> NICHT mischen
        if (container.find("input[disabled]").length > 0) return;

        var items = container.children(".w-full");

        items.sort(function() { return 0.5 - Math.random(); });

        container.append(items);
    });
});