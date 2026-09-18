// Warnt, wenn eine Frage geskippt wird, d.h. verlassen wird, OHNE sie zuvor
// per "Speichern & Auswerten" ausgewertet zu haben (per "Weiter"/"Zurück"-
// Pfeil oder "Gesamtauswertung"). Ist die Frage bereits ausgewertet
// (gesperrt), gibt es nichts zu skippen -> keine Meldung. Der Text
// unterscheidet sich je nachdem, ob schon eine Option ausgewaehlt wurde:
// - Option ausgewaehlt: wird beim Fortfahren automatisch uebernommen/
//   gewertet (siehe site/ueba/v3/wissenscheck/index.php), aber ohne die
//   Rueckmeldung (Richtig!/Falsch!) fuer diese Frage zu sehen.
// - keine Option ausgewaehlt: die Frage gilt danach als nicht beantwortet.
function confirmQuizNavigation(button, event) {
    var form = button.closest('form');
    var offeneEingaben = form.querySelectorAll('.quizoptions input:not([disabled])');

    // Frage ist bereits ausgewertet (gesperrt) - kein Skip, keine Meldung noetig.
    if (offeneEingaben.length === 0) {
        return true;
    }

    var hatAuswahl = form.querySelector('.quizoptions input:checked:not([disabled])');
    var nachricht = hatAuswahl
        ? 'Diese Frage wurde noch nicht ausgewertet. Wenn Sie fortfahren, wird Ihre Auswahl automatisch übernommen und gewertet, ohne dass Ihnen angezeigt wird, ob sie richtig war - eine spätere Änderung ist dann nicht mehr möglich.\n\nTrotzdem fortfahren?'
        : 'Sie haben diese Frage noch nicht beantwortet. Wenn Sie sie jetzt überspringen, zählt sie als nicht beantwortet.\n\nTrotzdem überspringen?';

    if (!confirm(nachricht)) {
        event.preventDefault();
        return false;
    }

    form.querySelectorAll('.quizoptions input').forEach(function (input) { input.disabled = true; });
    return true;
}

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