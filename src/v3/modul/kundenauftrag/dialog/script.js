// Speichert den Zustand der Wiedergabe
let currentAudio = null;
let activeElement = null;
let isChainPlaying = false;
let chainResolver = null; // Erlaubt das saubere Beenden eines Segments beim Stoppen
let playbackSessionId = 0; // Eindeutige ID für die aktuelle Wiedergabe-Kette
let pendingSeek = null; // { el, fraction } – Zielposition für ein Element, dessen Audio erst noch startet
let isScrubbing = false; // true während auf der Tonspur gezogen wird

// Begrenzt den Kontext, der pro TTS-Request an Gemini geht, damit lange Dialoge
// nicht irgendwann das Zeichenlimit sprengen und die Anfrage blockiert wird
const MAX_CONTEXT_TURNS = 6;
const MAX_CONTEXT_CHARS = 2000;

/**
 * Baut ein Kontext-Fenster aus den letzten N Turns VOR dem aktuellen Element
 */
function buildContextWindow(dialogEntries, uptoIndex) {
    const start = Math.max(0, uptoIndex - MAX_CONTEXT_TURNS);
    const windowEntries = dialogEntries.slice(start, uptoIndex);

    let context = "Dies ist ein Ausschnitt der letzten Nachrichten eines Kundendialogs (nur zur Einordnung von Ton/Kontext):\n";
    context += windowEntries.map(e => `${e.speaker}: "${e.text}"`).join('\n');

    if (context.length > MAX_CONTEXT_CHARS) {
        context = context.slice(context.length - MAX_CONTEXT_CHARS);
    }
    return context;
}

$(document).ready(async function() {
    const elements = $(".text2speech").get();
    const statusText = document.getElementById('status-text');
    const loaderIcon = document.getElementById('loader-icon');

    if (statusText) $(statusText).text("Sprachausgabe wird synchronisiert...");
    if (loaderIcon) loaderIcon.classList.remove('hidden');

    // 1. SCHRITT: Dialog-Einträge für das Kontext-Fenster sammeln
    const dialogEntries = elements.map((container) => {
        const $el = $(container);
        return {
            speaker: $el.attr('data-speaker') || 'Sprecher',
            text: $el.find('.contentChatDiv').text().trim()
        };
    });

    // 2. SCHRITT: Preload mit begrenztem Kontext-Fenster pro Element
    const totalCount = elements.length;
    (async () => {
        for (let i = 0; i < elements.length; i++) {
            const container = elements[i];
            const $el = $(container);
            const dataId = $el.attr('data-id');
            const speaker = $el.find(".sprecherDiv > span").text();
            const c_date = $el.attr('data-c_date') || '';
            const text = $el.find('.contentChatDiv').text().trim();

            if (dataId && text && !$el.attr('data-audio-src')) {
                const contextWindow = buildContextWindow(dialogEntries, i);

                // Durch das 'await' wartet JS, bis dieser eine Request fertig ist,
                // bevor der nächste an den Docker-Container gesendet wird.
                await preload(container, dataId, text, c_date, contextWindow, speaker);
            }

            // Fortschritt erst melden, wenn dieses Element wirklich abgeschlossen ist
            // (geladen oder als bereits vorhanden übersprungen)
            if (statusText) statusText.innerText = `${i + 1} von ${totalCount} Ausgaben geladen`;
        }

        // Erst jetzt, nach der letzten Iteration, sind wirklich alle Audios bereit
        if (loaderIcon) loaderIcon.classList.add('hidden');
        if (statusText) statusText.innerText = "Alle Audioausgaben sind bereit.";
    })();

    // Event-Delegation für die Play-Buttons
    $(document).on('click', '.audio-btns', function(e) {
        e.preventDefault();
        const $container = $(this).closest('.text2speech');
        const el = $container[0];
        
        // Falls wir auf das bereits aktive Element klicken -> Pause/Play Toggle
        if (activeElement === el && currentAudio) {
            if (currentAudio.paused) {
                currentAudio.play();
                updateIcon(el, 'pause');
            } else {
                currentAudio.pause();
                updateIcon(el, 'play');
            }
        } else {
            // Ein anderes Element wurde angeklickt: Stoppe alles Alte und starte neue Kette
            stopAll();
            startChainPlayback(el);
        }
    });

    // Tonspur steuerbar machen: Klicken/Ziehen springt an die entsprechende Stelle
    // und spielt von dort ab – auch wenn dieses Element noch gar nicht aktiv ist.
    $(document).on('pointerdown', '.audio-eq', function(e) {
        e.preventDefault();
        isScrubbing = true;
        seekToPointer(this, e);
    });
    $(document).on('pointermove', '.audio-eq', function(e) {
        if (!isScrubbing) return;
        seekToPointer(this, e);
    });
    $(document).on('pointerup pointerleave pointercancel', '.audio-eq', function() {
        isScrubbing = false;
    });
});

/**
 * Preload-Funktion: Generiert Audio oder lädt aus DB und konvertiert bei Bedarf
 */
async function preload(container, dataId, text, c_date, context, currentSpeaker) {
    try {
        const currentUrl = typeof pageUrl !== 'undefined' ? pageUrl : window.location.href.split('?')[0];
        const gender = currentSpeaker.includes("Frau ") ? "female" : "male";

        await new Promise((resolve) => {
            $.ajax({
                url: currentUrl + '?tts_action=get',
                method: 'POST',
                data: { dataId, text, gender, c_date },
                dataType: 'json',
                success: async function(response) {
                    let audioDataToProcess = null;
                    let isRawPcm = true;
                    let sampleRate = 24000;

                    if (!response.found && dataId) {
                        try {
                            const voice = (gender === "female") ? "Leda" : "Sadaltager";
                            const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key=${apiKey}`;
                            
                            // Gemini-TTS erwartet nur einen kurzen Stil-Hinweis + den zu sprechenden Text,
                            // KEIN SSML und keine mehrteiligen Rollen-/Aufgabenanweisungen – sonst versucht
                            // das Modell eine Text-/Markup-Antwort zu erzeugen, was der reine Audio-Modus
                            // (responseModalities: ["AUDIO"]) ablehnt (400 "tried to generate text").
                            const genderLabel = (gender === "female") ? "weibliche Sprecherin" : "männlicher Sprecher";
                            const prompt = `Sprich als ${genderLabel} in einer natürlichen, professionellen und sachlichen Tonlage: ${text}`;

                            const ttsResponse = await fetch(geminiUrl, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    contents: [{ parts: [{ text: prompt }] }],
                                    generationConfig: {
                                        responseModalities: ["AUDIO"],
                                        speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: voice } } }
                                    }
                                })
                            });
                            
                            const ttsData = await ttsResponse.json();
                            const audioPart = ttsData.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
                            
                            if (audioPart && audioPart.inlineData.data) {
                                audioDataToProcess = audioPart.inlineData.data;
                                sampleRate = parseInt(audioPart.inlineData.mimeType?.match(/rate=(\d+)/)?.[1] || "24000");
                            }
                        } catch(err) { console.error("Fehler bei Generierung:", err); }
                    } else if (response.base64) {
                        audioDataToProcess = response.base64.trim();
                    }

                    // ... (WAV-Konvertierung und Speicherung bleibt wie im Original)
                    if (audioDataToProcess) {
                        const binaryString = atob(audioDataToProcess);
                        const bytes = new Uint8Array(binaryString.length);
                        for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);

                        // Die echte Tonspur (Wellenform) aus den rohen PCM-Samples berechnen,
                        // bevor sie in WAV verpackt werden – so entsteht ein Abbild der Aufnahme
                        // und nicht nur eine Live-Frequenzanzeige.
                        const waveformPeaks = computeWaveformPeaks(bytes, WAVEFORM_BAR_COUNT);
                        $(container).data('waveform-peaks', waveformPeaks);

                        let finalSrc = '';
                        if (isRawPcm) {
                            const wavBlob = pcmToWav(bytes, sampleRate);
                            finalSrc = await blobToDataURL(wavBlob);

                            if (!response.found) {
                                const base64Only = finalSrc.split(',')[1];
                                $.ajax({
                                    url: currentUrl + '?tts_action=save',
                                    method: 'POST',
                                    data: { dataId, gender, text, c_date, base64: base64Only, mimeType: 'audio/wav' }
                                });
                            }
                        } else {
                            finalSrc = `data:audio/wav;base64,${audioDataToProcess}`;
                        }

                        container.setAttribute('data-audio-src', finalSrc);
                        $(container).find(".audio-btns").removeClass("hidden");
                        $(container).find(".audio-eq").removeClass("hidden").each(function() {
                            drawWaveform(this, waveformPeaks, 0);
                        });
                    }
                    resolve();
                },
                error: () => resolve()
            });
        });
    } catch (e) { console.error(e); }
}

/**
 * Optimierte Kette: Wartet auf noch nicht geladene Elemente
 */
async function startChainPlayback(startElement) {
    const currentSessionId = ++playbackSessionId;
    isChainPlaying = true;
    let element = startElement;
    
    while (element && isChainPlaying && currentSessionId === playbackSessionId) {
        // FALLBACK: Falls Audio noch lädt, kurz warten (Polling)
        let attempts = 0;
        while (!element.getAttribute('data-audio-src') && attempts < 50) {
            if (!isChainPlaying) return;
            $(element).find('.audio-btns').addClass('animate-pulse'); // Optisches Feedback: Lädt noch
            await new Promise(r => setTimeout(r, 200)); 
            attempts++;
        }
        $(element).find('.audio-btns').removeClass('animate-pulse');

        await playElement(element, currentSessionId);
        
        if (!isChainPlaying || currentSessionId !== playbackSessionId) break;
        element = $(element).nextAll('.text2speech').first()[0];
    }
}

/**
 * Wandelt rohe PCM-Daten (L16) in ein abspielbares WAV-Format um
 */
function pcmToWav(pcmData, sampleRate) {
    const buffer = new ArrayBuffer(44 + pcmData.length);
    const view = new DataView(buffer);
    const writeString = (offset, string) => {
        for (let i = 0; i < string.length; i++) view.setUint8(offset + i, string.charCodeAt(i));
    };
    writeString(0, 'RIFF');
    view.setUint32(4, 36 + pcmData.length, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true); 
    view.setUint16(22, 1, true); 
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    writeString(36, 'data');
    view.setUint32(40, pcmData.length, true);
    const wavBytes = new Uint8Array(buffer);
    wavBytes.set(pcmData, 44);
    return new Blob([buffer], { type: 'audio/wav' });
}

/**
 * Spielt ein einzelnes Audio-Element ab, markiert den Text und gibt ein Promise zurück
 */
function playElement(el, sessionId) {
    return new Promise((resolve) => {
        const audioSrc = el.getAttribute('data-audio-src');
        
        // Falls die Session nicht mehr aktuell ist oder kein Audio da ist, sofort abbrechen
        if (!audioSrc || sessionId !== playbackSessionId) {
            return resolve();
        }

        // Referenz speichern, um das Promise von außen auflösen zu können (bei stopAll)
        chainResolver = resolve;

        resetActiveHighlight();
        activeElement = el;
        $(el).addClass('active-speech');

        currentAudio = new Audio(audioSrc);
        attachWaveformProgress(el, currentAudio);
        updateIcon(el, 'pause');

        // Falls dieses Element über einen Klick/Drag auf die Tonspur gestartet wurde,
        // jetzt an die gewünschte Stelle springen, sobald die Metadaten vorliegen
        if (pendingSeek && pendingSeek.el === el) {
            const fraction = pendingSeek.fraction;
            pendingSeek = null;
            seekTo(currentAudio, fraction);
        }

        currentAudio.onended = () => {
            // Nur auflösen, wenn dies immer noch die aktive Session ist
            if (sessionId === playbackSessionId) {
                resetActiveHighlight();
                chainResolver = null;
                resolve();
            }
        };

        currentAudio.onerror = (e) => {
            console.error("Wiedergabefehler bei Element:", el.getAttribute('data-id'), e);
            if (sessionId === playbackSessionId) {
                resetActiveHighlight();
                chainResolver = null;
                resolve();
            }
        };

        currentAudio.play().catch(err => {
            console.error("Wiedergabe konnte nicht gestartet werden:", err);
            if (sessionId === playbackSessionId) {
                resetActiveHighlight();
                chainResolver = null;
                resolve();
            }
        });
    });
}

/**
 * Mini-Equalizer mit echter Tonspur: aus den rohen PCM-Samples der Aufnahme wird
 * einmalig eine Wellenform (Peaks pro Balken) berechnet – das Canvas (.audio-eq)
 * zeigt also die tatsächliche Kontur des Audios, nicht nur eine Live-Frequenzanzeige.
 * Während der Wiedergabe wandert eine Fortschritts-Einfärbung über die Balken mit,
 * die aktuell spielende Stelle wird zusätzlich hervorgehoben (Equalizer-Effekt).
 */
const WAVEFORM_BAR_COUNT = 20;

/**
 * Zerlegt 16-Bit-PCM-Rohdaten (little-endian, mono) in WAVEFORM_BAR_COUNT
 * Balken und liefert je Balken den maximalen Ausschlag, normiert auf 0..1
 */
function computeWaveformPeaks(pcmBytes, bucketCount) {
    const sampleCount = Math.floor(pcmBytes.length / 2);
    if (sampleCount <= 0) return new Array(bucketCount).fill(0);

    const view = new DataView(pcmBytes.buffer, pcmBytes.byteOffset, pcmBytes.byteLength);
    const samplesPerBucket = Math.max(1, Math.floor(sampleCount / bucketCount));
    const peaks = [];

    for (let b = 0; b < bucketCount; b++) {
        const start = b * samplesPerBucket;
        const end = Math.min(sampleCount, start + samplesPerBucket);
        let max = 0;
        for (let i = start; i < end; i++) {
            const amplitude = Math.abs(view.getInt16(i * 2, true));
            if (amplitude > max) max = amplitude;
        }
        peaks.push(max / 32768);
    }
    return peaks;
}

/**
 * Zeichnet die Wellenform; "progress" (0..1) färbt den bereits abgespielten
 * Teil ein und lässt den aktuellen Balken etwas heller hervortreten
 */
function drawWaveform(canvas, peaks, progress) {
    const canvasCtx = canvas.getContext('2d');
    const { width, height } = canvas;
    const barCount = peaks.length;
    const gap = 1;
    const barWidth = Math.max(1, (width - (barCount - 1) * gap) / barCount);
    const playedColor = getComputedStyle(canvas).color || '#3b82f6';
    const idleColor = 'rgba(148, 163, 184, 0.5)';
    const playedUpTo = progress * barCount;

    canvasCtx.clearRect(0, 0, width, height);
    peaks.forEach((amplitude, i) => {
        const barHeight = Math.max(2, amplitude * height);
        const x = i * (barWidth + gap);
        const y = (height - barHeight) / 2;
        const isCurrent = i === Math.floor(playedUpTo) && progress > 0 && progress < 1;
        canvasCtx.fillStyle = isCurrent ? playedColor : (i < playedUpTo ? playedColor : idleColor);
        canvasCtx.globalAlpha = isCurrent ? 1 : (i < playedUpTo ? 0.85 : 1);
        canvasCtx.fillRect(x, y, barWidth, barHeight);
    });
    canvasCtx.globalAlpha = 1;
}

/**
 * Hängt die Fortschritts-Einfärbung der Wellenform an das <audio>-Element.
 * Nutzt die beim Laden berechneten Peaks – ohne Web Audio API, daher robust
 * gegenüber Autoplay-/Routing-Einschränkungen einzelner Browser.
 */
function attachWaveformProgress(el, audioEl) {
    const canvas = $(el).find('.audio-eq')[0];
    const peaks = $(el).data('waveform-peaks');
    if (!canvas || !peaks) return;

    const update = () => {
        const progress = audioEl.duration ? audioEl.currentTime / audioEl.duration : 0;
        drawWaveform(canvas, peaks, progress);
    };

    audioEl.addEventListener('timeupdate', update);
    audioEl.addEventListener('play', update);
    audioEl.addEventListener('ended', () => drawWaveform(canvas, peaks, 1));
    update();
}

/**
 * Springt in einem <audio>-Element an die angegebene Position (0..1 relativ zur
 * Dauer). Wartet bei Bedarf auf die Metadaten, da "duration" sonst noch NaN ist.
 */
function seekTo(audioEl, fraction) {
    const apply = () => {
        if (audioEl.duration) audioEl.currentTime = fraction * audioEl.duration;
    };
    if (audioEl.readyState >= 1) { // HAVE_METADATA oder höher
        apply();
    } else {
        audioEl.addEventListener('loadedmetadata', apply, { once: true });
    }
}

/**
 * Ermittelt die Klick-/Zugposition auf der Tonspur und springt dort hin.
 * Ist das Element bereits aktiv, wird nur die Position geändert (und bei
 * Bedarf die Wiedergabe fortgesetzt); andernfalls wird die Kette dort gestartet.
 */
function seekToPointer(canvas, e) {
    const $container = $(canvas).closest('.text2speech');
    const el = $container[0];
    if (!el || !el.getAttribute('data-audio-src')) return;

    const rect = canvas.getBoundingClientRect();
    const fraction = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));

    if (activeElement === el && currentAudio) {
        seekTo(currentAudio, fraction);
        if (currentAudio.paused) {
            currentAudio.play().catch(() => {});
            updateIcon(el, 'pause');
        }
    } else if (pendingSeek && pendingSeek.el === el) {
        // Chain-Start für dieses Element läuft schon (z. B. beim Ziehen) – nur Ziel aktualisieren
        pendingSeek.fraction = fraction;
    } else {
        stopAll();
        pendingSeek = { el, fraction };
        startChainPlayback(el);
    }
}

/**
 * Aktualisiert das Icon des Buttons (Play/Pause) über xlink:href
 */
function updateIcon(el, state) {
    const $btn = $(el).find('.audio-btns');
    const iconId = (state === 'pause') ? '#icon-audio-pause' : '#icon-audio-play';
    const svg = $btn.find('svg');
    
    if (state === 'pause') {
        svg.removeClass('fill-white').addClass('stroke-white');
    } else {
        svg.removeClass('stroke-white').addClass('fill-white');
    }
    
    $btn.find('use').attr('xlink:href', iconId);
}

/**
 * Entfernt Markierungen und stellt das Original-HTML des aktiven Elements wieder her
 */
function resetActiveHighlight() {
    if (activeElement) {
        $(activeElement).removeClass('active-speech');
        const $textDiv = $(activeElement).find('.contentChatDiv');
        const originalHtml = activeElement.getAttribute('data-original-html');
        if (originalHtml) $textDiv.html(originalHtml);
        updateIcon(activeElement, 'play');
    }
}

/**
 * Stoppt die aktuelle Wiedergabe und bricht die Kette ab
 */
function stopAll() {
    isChainPlaying = false;
    playbackSessionId++; // Invaldiert alle laufenden Ketten sofort
    pendingSeek = null; // veraltete Zielposition eines abgebrochenen Starts verwerfen

    if (currentAudio) {
        currentAudio.pause();
        currentAudio.src = ""; // Entlädt die Quelle, um paralleles Buffering zu stoppen
        currentAudio = null;
    }
    resetActiveHighlight();
    activeElement = null;
    
    // Falls ein playElement-Promise noch offen ist, erzwingen wir das Resolve, damit die Schleife endet
    if (chainResolver) {
        const resolve = chainResolver;
        chainResolver = null;
        resolve();
    }
}

/**
 * Hilfsfunktion: Wandelt Blob in Data-URL um
 */
function blobToDataURL(blob) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(blob);
    });
}