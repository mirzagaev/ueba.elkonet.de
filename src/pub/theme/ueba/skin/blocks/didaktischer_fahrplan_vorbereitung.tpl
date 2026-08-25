<!-- Vorbereitung -->
<div>
<div class="text-sm uppercase tracking-wide font-semibold text-secondary mb-3">Vorbereitung</div>
<div class="grid md:grid-cols-2 gap-5 lg:gap-10">
	<div class="infobox bg-primary h-fit" id="vorbereitung-inhalt-open" data-accordion="open">
		<button type="button" class="bg-secondary w-full relative cursor-pointer kachelliste_headline inactiveAccordion" data-accordion-target="#vorbereitung-inhalt-open-body-1" aria-expanded="false" aria-controls="vorbereitung-inhalt-open-body-1">
			{value var="vorbereitung_inhalte_headline" type="content" title="< Überschrift >"}
			<svg data-accordion-icon class="w-4 h-4 absolute right-6 top-6 rotate-180 shrink-0" aria-hidden="true" fill="none"><use xlink:href="#icon-accordion-toggler"></use></svg>
		</button>
		<div id="vorbereitung-inhalt-open-body-1" class="hidden kachelliste">
			{value var="vorbereitung_inhalte" type="content" title="Inhalte"}
		</div>
	</div>
	<div class="infobox bg-primary h-fit" id="vorbereitung-ausstattung-open" data-accordion="open">
		<button type="button" class="bg-secondary w-full relative cursor-pointer kachelliste_headline inactiveAccordion" data-accordion-target="#vorbereitung-ausstattung-open-body-1" aria-expanded="false" aria-controls="vorbereitung-ausstattung-open-body-1">
			{value var="vorbereitung_ausstattung_headline" type="content" title="< Überschrift >"}
			<svg data-accordion-icon class="w-4 h-4 absolute right-6 top-6 rotate-180 shrink-0" aria-hidden="true" fill="none"><use xlink:href="#icon-accordion-toggler"></use></svg>
		</button>
		<div id="vorbereitung-ausstattung-open-body-1" class="hidden kachelliste">
			{value var="vorbereitung_ausstattung" type="content" title="Ausstattung"}
		</div>
	</div>
</div>
</div>