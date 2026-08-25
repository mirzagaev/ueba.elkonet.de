// Lightbox fuer Inhalts-Links auf Bilder UND Videos (Links mit target="_lightbox" ODER
// Links, deren href auf eine erkannte Bild-/Video-Datei zeigt - z.B.
// <a title="..." href="/multimedia/.../Bild.png" target="_lightbox">...</a> oder
// <a title="..." href="/multimedia/.../Video.mp4">...</a>, auch OHNE target="_lightbox").
// Faengt den Klick ab und zeigt Bild bzw. Video in einem eigenen Overlay an (die
// "ln-lightbox*"-Klassen dienen hier nur noch als Hooks fuer querySelector/querySelectorAll,
// die eigentliche Optik kommt direkt als Tailwind-Utility-Klassen an den Elementen -
// dafuer muss skin/ueba/style_tailwind.css neu gebaut sein, siehe Kommentar in
// skin/ueba/v3/lerneinheit/nav.tpl), statt die Datei in einem neuen Tab/Fenster zu
// oeffnen.
//
// WICHTIG: {include_module_files page=$page} scheint das script.js MEHRERER Typ-Ebenen
// gleichzeitig einzubinden (z.B. auf einer Thema-Seite sowohl kapitel/script.js als auch
// kapitel/thema/script.js) - dieselbe Datei/derselbe Code lief dadurch mehrfach und legte
// mehrere <div class="ln-lightbox"> an. Deshalb hier ein globaler Idempotenz-Guard
// (window.__lnLightboxInit), der die Einrichtung auf genau EINE Ausfuehrung begrenzt, egal
// wie oft dieses Skript ueber verschiedene script.js-Dateien geladen wird.
(function () {
	if (window.__lnLightboxInit) {
		return;
	}
	window.__lnLightboxInit = true;

	var IMAGE_EXTENSIONS = ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'bmp'];
	var VIDEO_EXTENSIONS = ['mp4', 'webm', 'ogg', 'ogv', 'mov'];

	function extensionOf(href) {
		var match = /\.([a-z0-9]+)(?:[?#].*)?$/i.exec(href || '');
		return match ? match[1].toLowerCase() : '';
	}

	var overlay = null;

	function ensureOverlay() {
		if (overlay) {
			return overlay;
		}
		overlay = document.createElement('div');
		overlay.className = 'ln-lightbox hidden fixed inset-0 z-[9999] flex items-center justify-center p-6 bg-black/85';
		overlay.innerHTML =
			'<button type="button" class="ln-lightbox-close absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-white border-0 cursor-pointer hover:bg-white/20" aria-label="Schließen">' +
				'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">' +
					'<path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />' +
				'</svg>' +
			'</button>' +
			'<figure class="ln-lightbox-figure max-w-5xl max-h-full flex flex-col items-center gap-3">' +
				'<div class="ln-lightbox-media"></div>' +
				'<figcaption class="ln-lightbox-caption text-white text-sm text-center"></figcaption>' +
			'</figure>';
		document.body.appendChild(overlay);

		overlay.addEventListener('click', function (e) {
			if (e.target === overlay || e.target.closest('.ln-lightbox-close')) {
				closeLightbox();
			}
		});

		document.addEventListener('keydown', function (e) {
			if (e.key === 'Escape') {
				closeLightbox();
			}
		});

		return overlay;
	}

	function openLightbox(href, caption) {
		var el = ensureOverlay();
		var media = el.querySelector('.ln-lightbox-media');
		media.innerHTML = '';

		// Bildschatten/-radius/-groesse identisch fuer Bild und Video, siehe Kommentar in
		// skin/ueba/v3/lerneinheit/nav.tpl.
		var mediaClassName = 'max-w-full max-h-[80vh] rounded-2xl shadow-[0_20px_25px_-5px_rgba(0,0,0,0.3)] object-contain';
		if (VIDEO_EXTENSIONS.indexOf(extensionOf(href)) !== -1) {
			var video = document.createElement('video');
			video.src = href;
			video.controls = true;
			video.autoplay = true;
			video.className = mediaClassName;
			media.appendChild(video);
		} else {
			var img = document.createElement('img');
			img.src = href;
			img.alt = caption || '';
			img.className = mediaClassName;
			media.appendChild(img);
		}

		el.querySelector('.ln-lightbox-caption').textContent = caption || '';
		el.classList.remove('hidden');
	}

	function closeLightbox() {
		if (!overlay) {
			return;
		}
		overlay.classList.add('hidden');
		var media = overlay.querySelector('.ln-lightbox-media');
		var video = media.querySelector('video');
		if (video) {
			// Wiedergabe stoppen, sonst laeuft der Ton im Hintergrund weiter.
			video.pause();
		}
		media.innerHTML = '';
	}

	document.addEventListener('click', function (e) {
		var explicitLink = e.target.closest('a[target="_lightbox"]');
		var link = explicitLink || e.target.closest('.contentarea a');
		if (!link) {
			return;
		}

		var href = link.getAttribute('href') || '';
		var isMedia = IMAGE_EXTENSIONS.indexOf(extensionOf(href)) !== -1 || VIDEO_EXTENSIONS.indexOf(extensionOf(href)) !== -1;

		// Nur oeffnen, wenn der Link entweder explizit target="_lightbox" traegt, oder (ohne
		// dieses Attribut) auf eine erkannte Bild-/Video-Datei zeigt - alles andere innerhalb
		// von .contentarea (z.B. Unterseiten-Links) normal weiterreichen/ignorieren, damit
		// der Drawer weiter unten sie behandeln kann.
		if (!explicitLink && !isMedia) {
			return;
		}

		e.preventDefault();
		openLightbox(href, link.getAttribute('title') || link.textContent.trim());
	});
})();

// Drawer fuer Inhalts-Links auf weitere Unterseiten (z.B.
// <a title="1G-Netz" href="/ueba/EEG/.../1G_Netz-p-1078730.html">1G-Netz</a>).
// Analog zur Hilfe-/Formulare-Schublade in skin/ueba/tpl/header.html: die Ziel-Seite wird
// nachgeladen und in den Drawer-Inhalt (#ln-drawer-content, siehe body.html) eingesetzt,
// statt die aktuelle Seite zu verlassen.
//
// WICHTIG (zwei behobene Probleme):
// 1) script.js wird offenbar VOR dem gerenderten Seiteninhalt (body.html, inkl. der
//    #ln-drawer-Elemente) ausgefuehrt - ein sofortiges document.getElementById() beim Laden
//    des Skripts fand die Elemente deshalb noch nicht und brach die Einrichtung still ab.
//    Die Einrichtung wartet deshalb jetzt auf DOMContentLoaded (bzw. laeuft sofort, falls
//    das Dokument zu dem Zeitpunkt schon fertig geladen ist).
// 2) Nachladen NICHT ueber jQuery .load(url) bzw. .load(url + " body"): ohne Selektor wird
//    die komplette Antwort inkl. <head> (Stylesheets/<style>) eingefuegt - diese wirken
//    global, sobald sie irgendwo im DOM landen, und ueberschreiben Stile der aktuellen
//    Seite. Mit Selektor-Suffix parst jQuery die Antwort intern als FRAGMENT (ueber ein
//    <template>-Element) - dabei loest der Browser den <body>-Tag eines kompletten
//    Dokuments aus dem Fragment aber automatisch mit auf (nur seine Kinder bleiben lose
//    uebrig), wodurch .find("body") ins Leere lief und der Inhalt komplett fehlte.
//    Stattdessen hier fetch() + DOMParser: DOMParser parst als ECHTES, von window.document
//    komplett losgeloestes Document (kein Fragment) und haelt "head"/"body" darin korrekt
//    getrennt - nur doc.body.innerHTML wird uebernommen, doc.head (und damit dessen
//    <link>/<style>) wird nie angefasst und kann so auch nichts beeinflussen.
(function () {
	if (window.__lnDrawerInit) {
		return;
	}
	window.__lnDrawerInit = true;

	function init() {
		var drawer = document.getElementById('ln-drawer');
		var backdrop = document.getElementById('ln-drawer-backdrop');
		var titleEl = document.getElementById('ln-drawer-title');
		var closeBtn = document.getElementById('ln-drawer-close');
		var content = document.getElementById('ln-drawer-content');

		if (!drawer || !backdrop || !content) {
			return;
		}

		// Dieselben Klassen wie beim bestehenden #drawer-container in header.html: Ein-/
		// Ausblenden ueber "hidden" (Backdrop) bzw. translate-x-full/translate-x-0 (Panel,
		// per "drawer-animate" animiert - siehe style_tailwind.css).
		function openDrawer() {
			backdrop.classList.remove('hidden');
			drawer.classList.remove('translate-x-full');
			drawer.classList.add('translate-x-0');
			document.body.style.overflow = 'hidden';
		}

		function closeDrawer() {
			backdrop.classList.add('hidden');
			drawer.classList.remove('translate-x-0');
			drawer.classList.add('translate-x-full');
			document.body.style.overflow = '';
		}

		// Identischer Lade-Spinner wie in header.html (animate-spin/text-red-600), damit er
		// garantiert im kompilierten style_tailwind.css enthalten ist.
		function showLoading() {
			content.innerHTML =
				'<div class="flex items-center justify-center my-10">' +
					'<svg class="animate-spin h-10 w-10 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">' +
						'<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>' +
						'<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>' +
					'</svg>' +
				'</div>';
		}

		function loadIntoDrawer(url, title) {
			titleEl.textContent = title || '';
			showLoading();
			openDrawer();

			fetch(url)
				.then(function (res) {
					if (!res.ok) {
						throw new Error(String(res.status));
					}
					return res.text();
				})
				.then(function (html) {
					var doc = new DOMParser().parseFromString(html, 'text/html');

					// Die geladene Seite bringt ihr eigenes Layout-Wrapper-Element mit der
					// Klasse "templateLayout" mit (fuer die Vollseiten-Darstellung gedacht,
					// z.B. feste Breiten/Abstaende). Im Drawer soll NUR dessen Inhalt
					// beruecksichtigt werden (alles ausserhalb von .templateLayout, z.B.
					// Kopf-/Fussbereiche der geladenen Seite, wird verworfen) - danach wird
					// die Klasse selbst vom uebernommenen Element entfernt, damit sie im
					// Drawer-Kontext keine Vollseiten-Stile mehr auf sich zieht.
					var templateEl = doc.querySelector('.templateLayout');
					content.innerHTML = '';
					if (templateEl) {
						templateEl.classList.remove('templateLayout');
						content.appendChild(templateEl);
					} else {
						content.innerHTML = doc.body ? doc.body.innerHTML : html;
					}

					// Sicherheitsnetz: es kann mehrere/verschachtelte Elemente mit derselben
					// Klasse geben (der obige querySelector() trifft nur das erste) - hier
					// werden nach dem Einfuegen ALLE noch vorhandenen Vorkommen bereinigt.
					content.querySelectorAll('.templateLayout').forEach(function (el) {
						el.classList.remove('templateLayout');
					});

					var footer = content.querySelector('#footer');
					if (footer) {
						footer.remove();
					}

					// Die geladene Seite kann ein eigenes <aside>-Element mitbringen (z.B.
					// deren eigene Navigation/Seitenleiste) - das ist im Drawer-Kontext fehl am
					// Platz und wird deshalb komplett entfernt (nicht nur eine Klasse davon).
					content.querySelectorAll('aside').forEach(function (el) {
						el.remove();
					});

					// Das <article> der geladenen Seite traegt "lg:w-3/4" (fuer die
					// Zwei-Spalten-Vollseitenansicht neben einem 1/4-breiten <aside>). Im
					// schmalen Drawer (siehe #ln-drawer: sm:w-1/2 xl:w-1/3) soll das <article>
					// stattdessen die volle Breite nutzen - deshalb nur diese eine Klasse
					// entfernen (Rest, z.B. "w-full flex flex-wrap gap-8", bleibt erhalten).
					content.querySelectorAll('.lg\\:w-3\\/4').forEach(function (el) {
						el.classList.remove('lg:w-3/4');
					});

					if (typeof window.initFlowbite === 'function') {
						window.initFlowbite();
					}
					if (typeof window.initRTE === 'function') {
						window.initRTE(content);
					}
				})
				.catch(function (err) {
					content.innerHTML = '<p>Die Seite konnte nicht geladen werden' +
						(err && err.message ? ' (' + err.message + ')' : '') + '.</p>';
				});
		}

		if (closeBtn) {
			closeBtn.addEventListener('click', closeDrawer);
		}
		backdrop.addEventListener('click', closeDrawer);
		document.addEventListener('keydown', function (e) {
			if (e.key === 'Escape') {
				closeDrawer();
			}
		});

		document.addEventListener('click', function (e) {
			var link = e.target.closest('.contentarea a');
			if (!link) {
				return;
			}
			if (link.getAttribute('target') === '_lightbox' || link.getAttribute('target') === '_blank') {
				return;
			}

			var href = link.getAttribute('href') || '';
			// Nur eigene Unterseiten (relative URL, endet auf .html) im Drawer oeffnen -
			// externe Links, Downloads und Anker (#...) normal navigieren/oeffnen lassen.
			if (!/^\/[^:]*\.html(?:[?#].*)?$/.test(href)) {
				return;
			}

			e.preventDefault();
			loadIntoDrawer(href, link.getAttribute('title') || link.textContent.trim());
		});
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', init);
	} else {
		init();
	}
})();
