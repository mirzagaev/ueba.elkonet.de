<div>
	<div class="page_headline mt-4 lg:my-12">
		<h2 class="text-2xl xl:text-3xl font-bold flex items-center">{value var="fahrplan_headline" type="content" title="< Überschrift >"}</h2>
		{capture name="fahrplan_intro"}{value var="fahrplan_intro" type="content" title="Einleitung"}{/capture}
		{if $smarty.capture.fahrplan_intro|trim != "" || $smarty.request.preview}
			<div class="text-lg xl:text-xl mt-5">{$smarty.capture.fahrplan_intro}</div>
		{/if}
	</div>

	{capture name="fahrplan_hinweis"}{value var="fahrplan_hinweis" type="content" title="Hinweis"}{/capture}
	{if $smarty.capture.fahrplan_hinweis|trim != "" || $smarty.request.preview}
		<div class="xl:container mx-auto w-full bg-sky-100 border-l-4 border-sky-700 text-sky-700 p-4 rounded" role="alert">
			{$smarty.capture.fahrplan_hinweis}
		</div>
	{/if}

	<!-- Vorbereitung -->
	<div class="text-sm uppercase tracking-wide font-semibold text-gray-500 mt-12 mb-3">Vorbereitung</div>
	<div class="grid md:grid-cols-2 gap-10">
		<div class="infobox bg-primary h-fit">
			{value var="vorbereitung_inhalte_headline" type="content" attr.class="bg-secondary kachelliste_headline" title="< Überschrift >"}
			<div class="kachelliste">
				{value var="vorbereitung_inhalte" type="content" title="Inhalte"}
			</div>
		</div>

		<div class="infobox bg-primary h-fit">
			{value var="vorbereitung_ausstattung_headline" type="content" attr.class="bg-secondary kachelliste_headline" title="< Überschrift >"}
			<div class="kachelliste">
				{value var="vorbereitung_ausstattung" type="content" title="Ausstattung"}
			</div>
		</div>
	</div>

	<!-- Ablauf der Ausbildungswoche -->
	<div class="text-sm uppercase tracking-wide font-semibold text-gray-500 mt-12 mb-3">Ablauf der Ausbildungswoche</div>

	<!-- EINFÜHRUNG -->
	<div class="infobox bg-primary" id="einfuehrung-open" data-accordion="open">
		<button type="button" class="bg-gray-600 text-white text-left shadow-lg w-full relative cursor-pointer kachelliste_headline inactiveAccordion" data-accordion-target="#einfuehrung-open-body-1" aria-expanded="false" aria-controls="einfuehrung-open-body-1">Einführung
			<svg data-accordion-icon class="w-4 h-4 absolute right-6 top-6 rotate-180 shrink-0"><use xlink:href="#icon-accordion-open"></use></svg>
		</button>
		<div id="einfuehrung-open-body-1" class="hidden kachelliste">
			<div class="grid gap-6 md:grid-cols-3 md:gap-8">
				<div>
					<h4 class="font-bold text-lg mb-3 pb-2 border-b-2 border-gray-200 dark:border-gray-700">Was ist zu tun?</h4>
					<span class="inline-flex items-center gap-1 mb-3 rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700 sm:text-sm dark:bg-gray-800 dark:text-gray-300">Zeitbedarf: {value var="einfuehrung_zeit" type="text" title="Einführung: Zeit"}</span>
					{value var="einfuehrung_tun" type="content" title="Einführung: Was ist zu tun?"}
				</div>
				<div>
					<h4 class="font-bold text-lg mb-3 pb-2 border-b-2 border-gray-200 dark:border-gray-700">Lernmaterial für Auszubildende</h4>
					{value var="einfuehrung_lern" type="content" title="Einführung: Lernmaterial für Auszubildende"}
				</div>
				<div>
					<h4 class="font-bold text-lg mb-3 pb-2 border-b-2 border-gray-200 dark:border-gray-700">Lehrmaterial für Ausbilder/-in</h4>
					{value var="einfuehrung_lehr" type="content" title="Einführung: Lehrmaterial für Ausbilder/-in"}
				</div>
			</div>
		</div>
	</div>

	<!-- ANALYSE -->
	<div class="infobox bg-primary mt-6" id="analyse-open" data-accordion="open">
		<button type="button" class="bg-analyse text-white text-left shadow-lg w-full relative cursor-pointer kachelliste_headline inactiveAccordion" data-accordion-target="#analyse-open-body-1" aria-expanded="false" aria-controls="analyse-open-body-1">
			<div class="flex items-center gap-3">
				<svg fill="none" class="size-8 mr-3 lg:mr-5 fill-white"><use xlink:href="#icon-analyse"></use></svg> Analyse
			</div>
			<svg data-accordion-icon class="w-4 h-4 absolute right-6 top-6 rotate-180 shrink-0"><use xlink:href="#icon-accordion-open"></use></svg>
		</button>
		<div id="analyse-open-body-1" class="hidden kachelliste">
			<div class="grid gap-6 md:grid-cols-3 md:gap-8">
				<div>
					<h4 class="font-bold text-lg mb-3 pb-2 border-b-2 border-gray-200 dark:border-gray-700">Was ist zu tun?</h4>
					<span class="inline-flex items-center gap-1 mb-3 rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700 sm:text-sm dark:bg-gray-800 dark:text-gray-300">Zeitbedarf: {value var="analyse_zeit" type="text" title="Analyse: Zeit"}</span>
					{value var="analyse_tun" type="content" title="Analyse: Was ist zu tun?"}
				</div>
				<div>
					<h4 class="font-bold text-lg mb-3 pb-2 border-b-2 border-gray-200 dark:border-gray-700">Lernmaterial für Auszubildende</h4>
					{value var="analyse_lern" type="content" title="Analyse: Lernmaterial für Auszubildende"}
				</div>
				<div>
					<h4 class="font-bold text-lg mb-3 pb-2 border-b-2 border-gray-200 dark:border-gray-700">Lehrmaterial für Ausbilder/-in</h4>
					{value var="analyse_lehr" type="content" title="Analyse: Lehrmaterial für Ausbilder/-in"}
				</div>
			</div>
		</div>
	</div>

	<!-- PLANUNG -->
	<div class="infobox bg-primary mt-6" id="planung-open" data-accordion="open">
		<button type="button" class="bg-planung text-white text-left shadow-lg w-full relative cursor-pointer kachelliste_headline inactiveAccordion" data-accordion-target="#planung-open-body-1" aria-expanded="false" aria-controls="planung-open-body-1">
			<div class="flex items-center gap-3">
				<svg fill="none" class="size-8 mr-3 lg:mr-5 fill-white"><use xlink:href="#icon-planung"></use></svg> Planung
			</div>
			<svg data-accordion-icon class="w-4 h-4 absolute right-6 top-6 rotate-180 shrink-0"><use xlink:href="#icon-accordion-open"></use></svg>
		</button>
		<div id="planung-open-body-1" class="hidden kachelliste">
			<div class="grid gap-6 md:grid-cols-3 md:gap-8">
				<div>
					<h4 class="font-bold text-lg mb-3 pb-2 border-b-2 border-gray-200 dark:border-gray-700">Was ist zu tun?</h4>
					<span class="inline-flex items-center gap-1 mb-3 rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700 sm:text-sm dark:bg-gray-800 dark:text-gray-300">Zeitbedarf: {value var="planung_zeit" type="text" title="Planung: Zeit"}</span>
					{value var="planung_tun" type="content" title="Planung: Was ist zu tun?"}
				</div>
				<div>
					<h4 class="font-bold text-lg mb-3 pb-2 border-b-2 border-gray-200 dark:border-gray-700">Lernmaterial für Auszubildende</h4>
					{value var="planung_lern" type="content" title="Planung: Lernmaterial für Auszubildende"}
				</div>
				<div>
					<h4 class="font-bold text-lg mb-3 pb-2 border-b-2 border-gray-200 dark:border-gray-700">Lehrmaterial für Ausbilder/-in</h4>
					{value var="planung_lehr" type="content" title="Planung: Lehrmaterial für Ausbilder/-in"}
				</div>
			</div>
		</div>
	</div>

	<!-- DURCHFÜHRUNG -->
	<div class="infobox bg-primary mt-6" id="durchfuehrung-open" data-accordion="open">
		<button type="button" class="bg-durchfuehrung text-white text-left shadow-lg w-full relative cursor-pointer kachelliste_headline inactiveAccordion" data-accordion-target="#durchfuehrung-open-body-1" aria-expanded="false" aria-controls="durchfuehrung-open-body-1">
			<div class="flex items-center gap-3">
				<svg fill="none" class="size-8 mr-3 lg:mr-5 fill-white"><use xlink:href="#icon-durchfuehrung"></use></svg> Durchführung
			</div>
			<svg data-accordion-icon class="w-4 h-4 absolute right-6 top-6 rotate-180 shrink-0"><use xlink:href="#icon-accordion-open"></use></svg>
		</button>
		<div id="durchfuehrung-open-body-1" class="hidden kachelliste">
			<div class="grid gap-6 md:grid-cols-3 md:gap-8">
				<div>
					<h4 class="font-bold text-lg mb-3 pb-2 border-b-2 border-gray-200 dark:border-gray-700">Was ist zu tun?</h4>
					<span class="inline-flex items-center gap-1 mb-3 rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700 sm:text-sm dark:bg-gray-800 dark:text-gray-300">Zeitbedarf: {value var="durchfuehrung_zeit" type="text" title="Durchführung: Zeit"}</span>
					{value var="durchfuehrung_tun" type="content" title="Durchführung: Was ist zu tun?"}
				</div>
				<div>
					<h4 class="font-bold text-lg mb-3 pb-2 border-b-2 border-gray-200 dark:border-gray-700">Lernmaterial für Auszubildende</h4>
					{value var="durchfuehrung_lern" type="content" title="Durchführung: Lernmaterial für Auszubildende"}
				</div>
				<div>
					<h4 class="font-bold text-lg mb-3 pb-2 border-b-2 border-gray-200 dark:border-gray-700">Lehrmaterial für Ausbilder/-in</h4>
					{value var="durchfuehrung_lehr" type="content" title="Durchführung: Lehrmaterial für Ausbilder/-in"}
				</div>
			</div>
		</div>
	</div>

	<!-- AUSWERTUNG -->
	<div class="infobox bg-primary mt-6" id="auswertung-open" data-accordion="open">
		<button type="button" class="bg-auswertung text-white text-left shadow-lg w-full relative cursor-pointer kachelliste_headline inactiveAccordion" data-accordion-target="#auswertung-open-body-1" aria-expanded="false" aria-controls="auswertung-open-body-1">
			<div class="flex items-center gap-3">
				<svg fill="none" class="size-8 mr-3 lg:mr-5 fill-white"><use xlink:href="#icon-auswertung"></use></svg> Auswertung
			</div>
			<svg data-accordion-icon class="w-4 h-4 absolute right-6 top-6 rotate-180 shrink-0"><use xlink:href="#icon-accordion-open"></use></svg>
		</button>
		<div id="auswertung-open-body-1" class="hidden kachelliste">
			<div class="grid gap-6 md:grid-cols-3 md:gap-8">
				<div>
					<h4 class="font-bold text-lg mb-3 pb-2 border-b-2 border-gray-200 dark:border-gray-700">Was ist zu tun?</h4>
					<span class="inline-flex items-center gap-1 mb-3 rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700 sm:text-sm dark:bg-gray-800 dark:text-gray-300">Zeitbedarf: {value var="auswertung_zeit" type="text" title="Auswertung: Zeit"}</span>
					{value var="auswertung_tun" type="content" title="Auswertung: Was ist zu tun?"}
				</div>
				<div>
					<h4 class="font-bold text-lg mb-3 pb-2 border-b-2 border-gray-200 dark:border-gray-700">Lernmaterial für Auszubildende</h4>
					{value var="auswertung_lern" type="content" title="Auswertung: Lernmaterial für Auszubildende"}
				</div>
				<div>
					<h4 class="font-bold text-lg mb-3 pb-2 border-b-2 border-gray-200 dark:border-gray-700">Lehrmaterial für Ausbilder/-in</h4>
					{value var="auswertung_lehr" type="content" title="Auswertung: Lehrmaterial für Ausbilder/-in"}
				</div>
			</div>
		</div>
	</div>
</div>