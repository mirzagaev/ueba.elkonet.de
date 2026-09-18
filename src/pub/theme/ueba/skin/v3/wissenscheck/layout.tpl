<section class="flex flex-col lg:flex-row gap-8 items-start">
{if $lerneinheitPage}
	<aside class="w-full lg:w-1/3 flex flex-col gap-8">
		{include file="v3/lerneinheit/nav.tpl"}
	</aside>
{/if}
	<article class="w-full{if $lerneinheitPage} lg:w-3/4{/if}">
    {if $mode == 1 && !$smarty.request.preview}

        {* TODO DEBUG ENTFERNEN: temporaere Diagnose fuer "Auswerten springt in falsche Frage" *}
        {if $debugInfo}<!-- WC-DEBUG {$debugInfo|@json_encode} -->{/if}

        {get_children page=$page query.where="type = 'v3/wissenscheck/entry'" var="fragen"}
        {assign var="frageId" value=$actualFrage-1}
        {assign var="fragePage" value=$fragen[$frageId]}
        {get_children page=$fragePage query.where="type = 'v3/wissenscheck/entry/choice'" var="opts"}

        {* MULTICHOICE feststellen *}
        {assign var="isMulti" value=false}
        {if $fragePage->extra.mehrfachauswahl == "1"}
            {assign var="isMulti" value=true}
        {/if}

        {* gespeicherte Antwort holen *}
        {assign var="antwortObj" value=$answers[$actualFrage]}
        {assign var="antwortArr" value=$antwortObj.answers}
        {assign var="isLocked"  value=$antwortObj.locked}

        <div class="quizwrap">
            <div class="quizicon">
                <svg><use xlink:href="#icon-wissenscheck"></use></svg>
            </div>
            <form method="post" action="{page_url page=$page}" class="quizbox">
                <div class="quizheader">
                    <button type="submit" name="prevQuestion" class="cursor-pointer" onclick="return confirmQuizNavigation(this, event);"><svg fill="none"><use xlink:href="#icon-quizleft"></use></svg></button>
                    <div class="grow">Frage {$actualFrage}/{$frageCount}</div>
                    {* Der "Weiter"-Pfeil dient nur zum Skippen einer Frage - bei der letzten
                       Frage gibt es nichts mehr zu skippen (dafuer stehen unten "Speichern &
                       Auswerten" bzw. "Gesamtauswertung" bereit), daher hier ausgeblendet. *}
                    {if $actualFrage < $frageCount}
                    <button type="submit" name="nextQuestion" class="cursor-pointer" onclick="return confirmQuizNavigation(this, event);"><svg fill="none"><use xlink:href="#icon-quizright"></use></svg></button>
                    {else}
                    <div class="size-6"></div>
                    {/if}
                </div>
                <div class="quizfrage">{$fragePage->field.content}</div>

                <div class="quizoptions">

                    {foreach from=$opts item=opt name=quizoptions}
                    {* Index → a,b,c,d erzeugen *}
                    {assign var="idx" value=$smarty.foreach.quizoptions.iteration-1}
                    {assign var="optKey" value=$idx+97}
                    {assign var="optKey" value=$optKey|@chr}

                    {* Ist die Option korrekt? *}
                    {assign var="isCorrect" value=false}
                    {if $opt->extra.correct == "1"}
                        {assign var="isCorrect" value=true}
                    {/if}

                    {* isChecked bestimmen *}
                    {assign var="isChecked" value=false}

                    {if $isMulti}
                        {if $antwortArr|@is_array && $optKey|@in_array:$antwortArr}
                            {assign var="isChecked" value=true}
                        {/if}
                    {else}
                        {if $antwortArr[0] == $optKey}
                            {assign var="isChecked" value=true}
                        {/if}
                    {/if}
                    
                    <div class="w-full">
                        <label class="quiz{if $isMulti}check{else}radio{/if}
                            {if $isLocked}
                                {if $isCorrect && $isChecked} border-green-700
                                {elseif !$isCorrect && $isChecked} border-red-600
                                {elseif $isCorrect && !$isChecked} border-green-600
                                {/if}
                                disabled
                            {/if}
                        ">
                            {* Checkbox oder Radio abhängig vom Extrafeld *}
                            {if $isMulti}
                                <input type="checkbox" 
                                    name="selectedOptions[]" 
                                    value="{$optKey}"
                                    {if $isChecked}checked{/if}
                                    {if $isLocked}disabled{/if}>
                            {else}
                                <input type="radio" 
                                    name="selectedOption" 
                                    value="{$optKey}" 
                                    {if $isChecked}checked{/if}
                                    {if $isLocked}disabled{/if}>
                            {/if}
                            <span class="font-semibold">
                                <div>{$opt->field.title}</div>
                                {* Antwortoptionen koennen zusaetzlich zum Titel ein eigenes RTE-Feld
                                   "content" mit Bild haben (siehe admin/navigation.ini der Seite
                                   v3/wissenscheck/entry/choice) - wurde bisher hier gar nicht
                                   ausgegeben. *}
                                {if $opt->field.content}
                                <div class="font-normal quizoption-content">{$opt->field.content}</div>
                                {/if}
                            </span>
                        </label>
                        {if $isLocked}
                            {if $isCorrect && $isChecked}
                                <div class="mt-2 font-bold text-green-700">Richtig!</div>
                            {elseif !$isCorrect && $isChecked}
                                <div class="mt-2 font-bold text-red-700">Leider falsch!</div>
                            {elseif $isCorrect && !$isChecked}
                                <div class="mt-2 font-bold text-green-700">Diese Antwort wäre richtig gewesen!</div>
                            {/if}
                        {/if}
                    </div>
                    {/foreach}
                </div>

                <div id="formelements">
                    <input type="hidden" name="mode" value="1">
                    <input type="hidden" name="frage" value="{$actualFrage}">
                    {* Reihenfolge im Markup bewusst so belassen (Primäraktion zuerst): Bei
                       Enter-Bestätigung im Formular nutzt der Browser den ERSTEN Submit-Button
                       im DOM - das muss "Speichern & Auswerten"/"Nächste Frage" bleiben, nicht
                       "Gesamtauswertung". Die Anzeige links/rechts wird stattdessen rein visuell
                       per CSS (order) getauscht, siehe .btn-auswerten/.btn-gesamtauswertung. *}
                    {if !$isLocked}
                        <button name="auswerten" value="1" type="submit" class="btn-auswerten">Speichern &amp; Auswerten</button>
                    {elseif $actualFrage < $frageCount}
                        {* Bei der letzten Frage gibt es keine "naechste Frage" mehr - nach dem
                           Auswerten bleibt hier nur noch der (immer sichtbare) Button
                           "Gesamtauswertung" als Weg zur Gesamtauswertung. *}
                        <button name="nextQuestion" value="1" type="submit" class="btn-auswerten">Nächste Frage</button>
                    {/if}
                    <button type="submit" name="showResult" value="1" class="btn-gesamtauswertung" onclick="return confirmQuizNavigation(this, event);">Gesamtauswertung</button>
                </div>
            </form>
        </div>
    {elseif $mode == 2 && !$smarty.request.preview}
        <div class="quizwrap">
            <div class="quizicon">
                <svg><use xlink:href="#icon-wissenscheck"></use></svg>
            </div>
            <form method="post" action="{page_url page=$page}" class="quizbox">
                <div class="quizheader">
                    <div class="grow">Auswertung</div>
                </div>
                <div class="quiz_auswertung flex flex-col gap-5">
                    <div>
                        <div class="py-6" id="pie-chart"></div>
                        <script src="{$url_dir}skin/{$site->skin}/v3/wissenscheck/apexcharts.min.js"></script>
                        <script>
                        {literal}
                        const getChartOptions = () => {
                            return {
                                series: [{/literal}{$percentageCorrect}{literal},{/literal}{$percentageWrong}{literal}, {/literal}{$percentageNotAnswered}{literal}],
                                colors: ["var(--color-green-600)", "var(--color-red-600)", "var(--color-neutral-600)"],
                                chart: {
                                    height: 400,
                                    width: "100%",
                                    type: "pie",
                                },
                                stroke: {
                                    colors: ["transparent"],
                                    lineCap: "",
                                },
                                plotOptions: {
                                    pie: {
                                        labels: {
                                            show: true,
                                        },
                                        size: "100%",
                                        dataLabels: {
                                            offset: -25
                                        }
                                    },
                                },
                                labels: ["Richtig", "Falsch", "Nicht beantwortet"],
                                dataLabels: {
                                    enabled: true,
                                    style: {
                                        fontFamily: "Inter, sans-serif",
                                    },
                                },
                                legend: {
                                    position: "bottom",
                                    fontFamily: "Inter, sans-serif",
                                },
                                yaxis: {
                                    labels: {
                                        formatter: function (value) {
                                            return value + "%"
                                        },
                                    },
                                },
                                xaxis: {
                                    labels: {
                                        formatter: function (value) {
                                            return value + "%"
                                        },
                                    },
                                    axisTicks: {
                                        show: false,
                                    },
                                    axisBorder: {
                                        show: false,
                                    },
                                },
                            }
                        }

                        const chart = new ApexCharts(document.getElementById("pie-chart"), getChartOptions());
                        chart.render();
                        {/literal}
                        </script>
                    </div>
                    <div class="grid grid-cols-1 xl:grid-cols-3 gap-5 text-center">
                        <p>Richtig: {$correctTotal} / {$frageCount}</p>
                        <p>Falsch: {$wrongTotal} / {$frageCount}</p>
                        <p>Nicht beantwortet: {$notAnsweredTotal} / {$frageCount}</p>
                    </div>
                    <div>
                        {* Bestehensgrenze kommt aus dem Extra-Feld "wissenscheck_bestehensgrenze" der
                        Seite (site/ueba/v3/wissenscheck/index.php, Standard 75%) - nicht mehr
                        hier fest verdrahtet, damit jede WissensCheck-Seite ihre eigene Grenze haben
                        kann. *}
                        {if $notAnsweredTotal == 0}
                            {if $percentage >= $bestehensgrenze}
                                <div class="w-full flex items-center py-3 px-8 mb-2 text-green-700 rounded-2xl bg-white dark:bg-neutral-900 dark:text-green-500" role="alert">
                                    <svg class="shrink-0 inline size-8 mr-6 fill-green-600 dark:fill-green-500"><use xlink:href="#icon-check"></use></svg>
                                    <div class="mx-auto">
                                        <span class="font-medium">Super!</span> Sie beherrschen das Thema richtig gut.
                                    </div>
                                </div>
                            {else}
                            <div class="w-full flex items-center py-3 px-8 mb-2 text-red-600 dark:text-red-500 rounded-2xl bg-white dark:bg-neutral-900 failed" role="alert">
                                <svg class="shrink-0 inline size-8 mr-6 fill-red-600 dark:fill-red-500"><use xlink:href="#icon-error"></use></svg>
                                <div class="mx-auto">
                                    <span class="font-medium">Schade!</span> Sie haben weniger als 75 % der Fragen richtig beantworten können. Versuchen Sie es erneut.
                                </div>
                            </div>
                            {/if}
                        {/if}
                    </div>
                    <div></div>
                </div>

                <div id="formelements" class="justify-center">
                    <input type="hidden" name="mode" value="0">
                    {if $notAnsweredTotal > 0}
                        <button type="submit" name="continueUnanswered" value="1" class="btn-auswerten">Unbeantwortete Fragen fortsetzen</button>
                    {/if}
                    <button type="submit" name="resetQuiz" value="1" class="btn-auswerten">Antworten zurücksetzen</button>
                </div>
            </form>
        </div>
    {else}
        {* MODE 0: Startseite *}
        <section data-edit-template="center">
            {$page->getBlocks("center")}
        </section>

        <form method="post" action="{page_url page=$page}" class="items-center text-center my-10">
            <input type="hidden" name="mode" value="1">
            <button type="submit" class="bg-primary cursor-pointer flex items-center w-fit mx-auto hover:shadow-md shadow-sm rounded-4xl p-4" href="{page_url page=$page params='mode=1'}">
                <svg class="size-5 fill-primary"><use xlink:href="#icon-next"></use></svg>
                <span class="ml-2 flex items-start flex-col leading-none title-font font-medium text-lg">Hier geht´s los</span>
            </button>
        </form>
    {/if}
	</article>
</section>