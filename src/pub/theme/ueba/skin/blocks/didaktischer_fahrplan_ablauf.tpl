<div>
<!-- Ablauf der Ausbildungswoche -->
<div class="text-sm uppercase tracking-wide font-semibold text-secondary mb-3">Ablauf der Ausbildungswoche</div>

<!-- EINFÜHRUNG -->
<div class="infobox bg-primary" id="einfuehrung-open" data-accordion="open">
	<button type="button" class="bg-gray-600 text-white text-left shadow-lg w-full relative cursor-pointer kachelliste_headline inactiveAccordion" data-accordion-target="#einfuehrung-open-body-1" aria-expanded="false" aria-controls="einfuehrung-open-body-1">
		<div class="flex items-center gap-3">
			<svg fill="none" class="stroke-white"><use xlink:href="#icon-flag"></use></svg> 
			Einführung
		</div>
		<svg data-accordion-icon fill="none" class="w-4 h-4 absolute right-6 top-6 rotate-180 shrink-0"><use xlink:href="#icon-accordion-toggler"></use></svg>
	</button>
	<div id="einfuehrung-open-body-1" class="hidden">
		<div class="grid gap-6 md:grid-cols-3 md:gap-8 accordion_content">
			<div>
				<h4 class="font-bold text-lg mb-3 pb-2 border-b-2 border-subnav">Was ist zu tun?</h4>
				<div class="flex flex-col gap-1">{value var="einfuehrung_tun" type="content" title="Einführung: Was ist zu tun?"}</div>
				<div class="zeitbedarf bg-secondary"><svg fill="none" class="size-6 inline-block mr-2"><use xlink:href="#icon-uhr"></use></svg>Zeitbedarf: {value var="einfuehrung_zeit" type="text" title="1h"}</div>
			</div>
			<div>
				<h4 class="font-bold text-lg mb-3 pb-2 border-b-2 border-subnav">Lernmaterial für Auszubildende</h4>
				<div class="flex flex-col gap-1">{value var="einfuehrung_lern" type="content"  title="Einführung: Lernmaterial für Auszubildende"}</div>
			</div>
			<div>
				<h4 class="font-bold text-lg mb-3 pb-2 border-b-2 border-subnav">Lehrmaterial für Ausbilder/-in</h4>
				<div class="flex flex-col gap-1">{value var="einfuehrung_lehr" type="content" title="Einführung: Lehrmaterial für Ausbilder/-in"}</div>
			</div>
		</div>
	</div>
</div>

<!-- ANALYSE -->
<div class="infobox bg-primary mt-5" id="analyse-open" data-accordion="open">
	<button type="button" class="bg-analyse text-white text-left shadow-lg w-full relative cursor-pointer kachelliste_headline inactiveAccordion" data-accordion-target="#analyse-open-body-1" aria-expanded="false" aria-controls="analyse-open-body-1">
		<div class="flex items-center gap-3">
			<svg fill="none" class="fill-white"><use xlink:href="#icon-analyse"></use></svg> 
			Analyse
		</div>
		<svg data-accordion-icon fill="none" class="w-4 h-4 absolute right-6 top-6 rotate-180 shrink-0"><use xlink:href="#icon-accordion-toggler"></use></svg>
	</button>
	<div id="analyse-open-body-1" class="hidden">
		<div class="grid gap-6 md:grid-cols-3 md:gap-8 accordion_content">
			<div>
				<h4 class="font-bold text-lg mb-3 pb-2 border-b-2 border-subnav">Was ist zu tun?</h4>
				<div class="flex flex-col gap-1">{value var="analyse_tun" type="content" title="Analyse: Was ist zu tun?"}</div>
				<div class="zeitbedarf bg-secondary"><svg fill="none" class="size-6 inline-block mr-2"><use xlink:href="#icon-uhr"></use></svg>Zeitbedarf: {value var="analyse_zeit" type="text" title="1h"}</div>
			</div>
			<div>
				<h4 class="font-bold text-lg mb-3 pb-2 border-b-2 border-subnav">Lernmaterial für Auszubildende</h4>
				<div class="flex flex-col gap-1">{value var="analyse_lern" type="content" title="Analyse: Lernmaterial für Auszubildende"}</div>
			</div>
			<div>
				<h4 class="font-bold text-lg mb-3 pb-2 border-b-2 border-subnav">Lehrmaterial für Ausbilder/-in</h4>
				<div class="flex flex-col gap-1">{value var="analyse_lehr" type="content" title="Analyse: Lehrmaterial für Ausbilder/-in"}</div>
			</div>
		</div>
	</div>
</div>

<!-- PLANUNG -->
<div class="infobox bg-primary mt-5" id="planung-open" data-accordion="open">
	<button type="button" class="bg-planung text-white text-left shadow-lg w-full relative cursor-pointer kachelliste_headline inactiveAccordion" data-accordion-target="#planung-open-body-1" aria-expanded="false" aria-controls="planung-open-body-1">
		<div class="flex items-center gap-3">
			<svg fill="none" class="fill-white"><use xlink:href="#icon-planung"></use></svg>
			Planung
		</div>
		<svg data-accordion-icon fill="none" class="w-4 h-4 absolute right-6 top-6 rotate-180 shrink-0"><use xlink:href="#icon-accordion-toggler"></use></svg>
	</button>
	<div id="planung-open-body-1" class="hidden">
		<div class="grid gap-6 md:grid-cols-3 md:gap-8 accordion_content">
			<div>
				<h4 class="font-bold text-lg mb-3 pb-2 border-b-2 border-subnav">Was ist zu tun?</h4>
				<div class="flex flex-col gap-1">{value var="planung_tun" type="content" title="Planung: Was ist zu tun?"}</div>
				<div class="zeitbedarf bg-secondary"><svg fill="none" class="size-6 inline-block mr-2"><use xlink:href="#icon-uhr"></use></svg>Zeitbedarf: {value var="planung_zeit" type="text" title="1h"}</div>
			</div>
			<div>
				<h4 class="font-bold text-lg mb-3 pb-2 border-b-2 border-subnav">Lernmaterial für Auszubildende</h4>
				<div class="flex flex-col gap-1">{value var="planung_lern" type="content" title="Planung: Lernmaterial für Auszubildende"}</div>
			</div>
			<div>
				<h4 class="font-bold text-lg mb-3 pb-2 border-b-2 border-subnav">Lehrmaterial für Ausbilder/-in</h4>
				<div class="flex flex-col gap-1">{value var="planung_lehr" type="content" title="Planung: Lehrmaterial für Ausbilder/-in"}</div>
			</div>
		</div>
	</div>
</div>

<!-- DURCHFÜHRUNG -->
<div class="infobox bg-primary mt-5" id="durchfuehrung-open" data-accordion="open">
	<button type="button" class="bg-durchfuehrung text-white text-left shadow-lg w-full relative cursor-pointer kachelliste_headline inactiveAccordion" data-accordion-target="#durchfuehrung-open-body-1" aria-expanded="false" aria-controls="durchfuehrung-open-body-1">
		<div class="flex items-center gap-3">
			<svg fill="none" class="fill-white"><use xlink:href="#icon-durchfuehrung"></use></svg>
			Durchführung
		</div>
		<svg data-accordion-icon fill="none" class="w-4 h-4 absolute right-6 top-6 rotate-180 shrink-0"><use xlink:href="#icon-accordion-toggler"></use></svg>
	</button>
	<div id="durchfuehrung-open-body-1" class="hidden">
		<div class="grid gap-6 md:grid-cols-3 md:gap-8 accordion_content">
			<div>
				<h4 class="font-bold text-lg mb-3 pb-2 border-b-2 border-subnav">Was ist zu tun?</h4>
				<div class="flex flex-col gap-1">{value var="durchfuehrung_tun" type="content" title="Durchführung: Was ist zu tun?"}</div>
				<div class="zeitbedarf bg-secondary"><svg fill="none" class="size-6 inline-block mr-2"><use xlink:href="#icon-uhr"></use></svg>Zeitbedarf: {value var="durchfuehrung_zeit" type="text" title="1h"}</div>
			</div>
			<div>
				<h4 class="font-bold text-lg mb-3 pb-2 border-b-2 border-subnav">Lernmaterial für Auszubildende</h4>
				<div class="flex flex-col gap-1">{value var="durchfuehrung_lern" type="content" title="Durchführung: Lernmaterial für Auszubildende"}</div>
			</div>
			<div>
				<h4 class="font-bold text-lg mb-3 pb-2 border-b-2 border-subnav">Lehrmaterial für Ausbilder/-in</h4>
				<div class="flex flex-col gap-1">{value var="durchfuehrung_lehr" type="content" title="Durchführung: Lehrmaterial für Ausbilder/-in"}</div>
			</div>
		</div>
	</div>
</div>

<!-- AUSWERTUNG -->
<div class="infobox bg-primary mt-5" id="auswertung-open" data-accordion="open">
	<button type="button" class="bg-auswertung text-white text-left shadow-lg w-full relative cursor-pointer kachelliste_headline inactiveAccordion" data-accordion-target="#auswertung-open-body-1" aria-expanded="false" aria-controls="auswertung-open-body-1">
		<div class="flex items-center gap-3">
			<svg fill="none" class="fill-white"><use xlink:href="#icon-auswertung"></use></svg>
			Auswertung
		</div>
		<svg data-accordion-icon fill="none" class="w-4 h-4 absolute right-6 top-6 rotate-180 shrink-0"><use xlink:href="#icon-accordion-toggler"></use></svg>
	</button>
	<div id="auswertung-open-body-1" class="hidden">
		<div class="grid gap-6 md:grid-cols-3 md:gap-8 accordion_content">
			<div>
				<h4 class="font-bold text-lg mb-3 pb-2 border-b-2 border-subnav">Was ist zu tun?</h4>
				<div class="flex flex-col gap-1">{value var="auswertung_tun" type="content" title="Auswertung: Was ist zu tun?"}</div>
				<div class="zeitbedarf bg-secondary"><svg fill="none" class="size-6 inline-block mr-2"><use xlink:href="#icon-uhr"></use></svg>Zeitbedarf: {value var="auswertung_zeit" type="text" title="1h"}</div>
			</div>
			<div>
				<h4 class="font-bold text-lg mb-3 pb-2 border-b-2 border-subnav">Lernmaterial für Auszubildende</h4>
				<div class="flex flex-col gap-1">{value var="auswertung_lern" type="content" title="Auswertung: Lernmaterial für Auszubildende"}</div>
			</div>
			<div>
				<h4 class="font-bold text-lg mb-3 pb-2 border-b-2 border-subnav">Lehrmaterial für Ausbilder/-in</h4>
				<div class="flex flex-col gap-1">{value var="auswertung_lehr" type="content" title="Auswertung: Lehrmaterial für Ausbilder/-in"}</div>
			</div>
		</div>
	</div>
</div>
</div>