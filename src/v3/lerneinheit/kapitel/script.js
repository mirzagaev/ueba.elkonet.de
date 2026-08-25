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
// gleichzeitig einzubinden - deshalb hier ein globaler Idempotenz-Guard
// (window.__lnLightboxInit), der die Einrichtung auf genau EINE Ausfuehrung begrenzt, egal
// wie oft dieses Skript ueber verschiedene script.js-Dateien (lerneinheit/kapitel/thema)
// geladen wird (verhindert doppelte <div class="ln-lightbox">-Overlays).
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
		// z.B. der Drawer (siehe kapitel/thema/script.js) sie behandeln kann.
		if (!explicitLink && !isMedia) {
			return;
		}

		e.preventDefault();
		openLightbox(href, link.getAttribute('title') || link.textContent.trim());
	});
})();
