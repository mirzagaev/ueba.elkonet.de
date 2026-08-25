{* ##################################################################
   ## Gemeinsamer Navigator fuer Lerneinheit/Kapitel/Thema-Seiten. ##
   ## Wird per {include file="v3/lerneinheit/nav.tpl"} eingebunden ##
   ## (keine Include-Parameter noetig - die benoetigten Variablen  ##
   ## werden bereits von site/ueba/v3/lerneinheit/funktionen.php   ##
   ## global zugewiesen):                                          ##
   ##   $lerneinheitPage - Seite vom Typ v3/lerneinheit             ##
   ##   $navTree         - verschachteltes Array, siehe funktionen.php ##
   ##   $page            - aktuell angezeigte Seite (Standard-Var) ##
   ##                                                                ##
   ## Der eigentliche Baum (Kapitel/Thema/Unter-Thema) steckt in    ##
   ## skin/ueba/v3/lerneinheit/nav-tree.tpl und wird von hier aus   ##
   ## zweimal eingebunden (Mobil-Variante + Desktop-Variante, siehe ##
   ## unten) - so muss der Baum nur an einer Stelle gepflegt werden.##
   ################################################################## *}

{* WICHTIG zur Mobil-/Desktop-Umschaltung und den "ln-*"-Klassen in den ueber
   {include_module_files} eingebundenen script.js-Dateien (lerneinheit/kapitel/thema):
   Diese Datei nutzte hier frueher ein eigenes, inline eingebettetes <style>{literal}...
   {/literal}</style>, weil skin/ueba/style_tailwind.css STATISCH vorkompiliert ist - sie
   enthaelt nur Utility-Kombinationen, die beim letzten Build tatsaechlich irgendwo im
   Projekt vorkamen (siehe Git-Historie fuer den Stand vor dieser Umstellung). Jetzt
   komplett auf Tailwind-Utility-Klassen direkt an den Elementen umgestellt - dafuer MUSS
   style_tailwind.css neu gebaut/deployt werden, sonst bleiben folgende, dort evtl. noch
   nicht enthaltene Utilities wirkungslos: "ease-[ease]" (Icon-Transition unten und in
   nav-tree.tpl/nav-thema-node.tpl), sowie in den script.js-Dateien "z-[9999]",
   "bg-black/85", "bg-white/10"/"bg-white/20" und der Schatten
   "shadow-[0_20px_25px_-5px_rgba(0,0,0,0.3)]" der Lightbox. Die Mobil-/Desktop-Sichtbarkeit
   unten ("block lg:hidden" / "hidden lg:block") ist unkritisch, die sind bereits im
   aktuellen Bundle enthalten. Die frueher hier definierte ".ln-hero-gradient"-Klasse war
   ungenutzt (siehe body.html der lerneinheit/kapitel/thema-Seiten: die nutzen bereits
   "bg-gradient-to-r from-neutral-800 opacity-80") und ist deshalb ganz entfallen.

   Zum <details>/<div>-Doppelblock selbst (unveraendert): moderne Browser rendern den
   aufklappbaren Bereich eines <details> intern ueber eine eigene ::details-content-Box,
   die sie selbst per content-visibility ein-/ausblenden - ein display:block !important auf
   einem KIND-Element davon reicht nicht zuverlaessig, um das zu erzwingen (das war die
   Ursache dafuer, dass der Navigator zuletzt auch auf Desktop ausgeblendet blieb). Deshalb
   gibt es hier bewusst ZWEI separate Bloecke statt eines einzigen erzwungenen <details>:
   - Mobil/Tablet (unter 1024px): echtes <details>/<summary>, unangetastetes
     natives Auf-/Zuklappverhalten.
   - Ab 1024px: ein normales <div>, das immer sichtbar ist - kein Kampf gegen die
     <details>-Interna noetig. *}

{* Mobil/Tablet (unter 1024px): per Tap auf den Kopfbereich ausklappbar. *}
<details class="block lg:hidden bg-primary rounded-2xl shadow-sm overflow-hidden">
	<summary class="list-none cursor-pointer flex items-center justify-between gap-3 py-4 px-6 bg-secondary">
		<div class="min-w-0">
			<span class="block text-xs uppercase tracking-wide text-secondary font-semibold mb-1">Lerneinheit</span>
			<a href="{page_url page=$lerneinheitPage}" class="block title-font font-bold leading-snug truncate">{$lerneinheitPage->field.title}</a>
		</div>
		<svg class="size-5 stroke-primary shrink-0 transition-transform duration-150 ease-[ease] ln-toggle-icon--down"><use xlink:href="#icon-down"></use></svg>
	</summary>
	<nav class="p-4 max-h-[32rem] overflow-y-auto">
		{include file="v3/lerneinheit/nav-tree.tpl"}
	</nav>
</details>

{* Ab 1024px: immer sichtbar. *}
<div class="hidden lg:block bg-primary rounded-2xl shadow-sm overflow-hidden">
	<div class="py-4 px-6 bg-secondary">
		<div class="text-xs uppercase tracking-wide text-secondary font-semibold mb-1">Lerneinheit</div>
		<a href="{page_url page=$lerneinheitPage}" class="block title-font font-bold leading-snug truncate">{$lerneinheitPage->field.title}</a>
	</div>
	<nav class="p-4">
		{include file="v3/lerneinheit/nav-tree.tpl"}
	</nav>
</div>

{if $lerneinheitPage->extra.glossar_link}
<div>
	<a href="{$lerneinheitPage->extra.glossar_link}" class="flex items-center justify-center gap-2 rounded-2xl bg-secondary text-secondary text-sm font-semibold px-4 py-3 hover:shadow-md shadow-sm">
		<svg class="size-4 fill-secondary shrink-0"><use xlink:href="#icon-glossar"></use></svg>
		Zum Glossar
	</a>
</div>
{/if}
