var currentDrawerUserId = null;
var currentDrawerUrl = null;
var dashboardSearchDebounce = null;

// Laedt eine URL per AJAX und ersetzt den INHALT von $container mit dem Inhalt des ersten Elements, das im
// Response auf "selector" passt. Bewusst NICHT ueber jQuery.load(url + ' selector') geloest: jQuery.load()
// ruft intern .html(jQuery-Objekt) auf, und .html() haengt bei einem Nicht-String-Wert das/die matchenden
// Elemente per .append() als KIND ein statt nur deren innerHTML zu uebernehmen - wenn (wie hier ueberall)
// das Zielelement dieselbe id traegt wie der Selector, entsteht dadurch bei jedem Laden ein verschachteltes
// Duplikat derselben id im DOM. Hier wird stattdessen bewusst mit dem HTML-STRING des gefundenen Elements
// gearbeitet (.html() mit String ersetzt einfach nur den innerHTML, keine Verschachtelung). data-*-Attribute
// (z.B. data-view/data-sort/data-dir/data-pg) werden vom geladenen Element auf den Container uebertragen,
// da nur dessen innerer Inhalt uebernommen wird, nicht das Element selbst.
function loadIntoContainer($container, url, selector, onDone) {
    $.get(url).done(function(responseHtml) {
        var $matched = $('<div>').html(responseHtml).find(selector).first();
        if ($matched.length) {
            $container.html($matched.html());
            $.each($matched[0].attributes, function(i, attr) {
                if (attr.name.indexOf('data-') === 0) { $container.attr(attr.name, attr.value); }
            });
        } else {
            $container.html('');
        }
        if (onDone) { onDone(true); }
    }).fail(function() {
        if (onDone) { onDone(false); }
    });
}

// Haengt Query-Parameter robust an eine URL an, unabhaengig davon, ob sie bereits einen "?" enthaelt
// (z.B. bei Vorschau-/Entwurfsseiten der Fall) - vermeidet doppelte "?" die zu 404s fuehren.
// Array-Werte (z.B. bz[]) werden als mehrere gleichnamige Parameter angehaengt.
function buildUrl(baseUrl, params) {
    var parts = [];
    for (var key in params) {
        var value = params[key];
        if (value === null || value === undefined || value === '') { continue; }
        if (Array.isArray(value)) {
            value.forEach(function(v) {
                parts.push(encodeURIComponent(key) + '=' + encodeURIComponent(v));
            });
            continue;
        }
        parts.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
    }
    if (parts.length === 0) { return baseUrl; }
    var separator = baseUrl.indexOf('?') === -1 ? '?' : '&';
    return baseUrl + separator + parts.join('&');
}

// Liest die aktuell angehakten Bildungszentren aus. Gibt null zurueck, wenn der Filter gar nicht sichtbar
// ist (Nicht-Admin-Scope oder eine andere View als "Benutzer") - dann wird server-seitig kein BZ-Filter
// angewendet.
function getSelectedBzIds() {
    var $checkboxes = $('.dashboard-bz-checkbox');
    if ($checkboxes.length === 0) { return null; }
    return $checkboxes.filter(':checked').map(function() { return this.value; }).get();
}

// Baut die Request-Parameter fuer die aktuell aktive View aus dem DOM-Zustand (Suchfeld, Sortierung,
// bei "Benutzer" zusaetzlich Rollen-/Status-Filter und BZ-Checkboxen) und merged optionale Overrides
// (z.B. {pg: 2} bei Pagination, {sort:'name', dir:'desc'} bei Spaltenklick).
function buildDashboardParams(overrides) {
    overrides = overrides || {};
    var $container = $('#dashboardListContainer');
    var view = overrides.view !== undefined ? overrides.view : ($container.data('view') || 'benutzer');

    var params = {
        view: view,
        search: overrides.search !== undefined ? overrides.search : $('#dashboardSearchInput').val(),
        pg: overrides.pg || $container.data('pg') || 1,
        sort: overrides.sort !== undefined ? overrides.sort : $container.data('sort'),
        dir: overrides.dir !== undefined ? overrides.dir : $container.data('dir')
    };

    if (view === 'benutzer') {
        var $role = $('#dashboardRoleFilter');
        var $status = $('#dashboardStatusFilter');
        params.role = overrides.role !== undefined ? overrides.role : ($role.length ? $role.val() : 'all');
        params.status = overrides.status !== undefined ? overrides.status : ($status.length ? $status.val() : 'all');

        var bzIds = getSelectedBzIds();
        if (bzIds !== null) {
            params.bz_filter = 1;
            params['bz[]'] = bzIds;
        }
    }

    return params;
}

// Laedt die aktuelle View (Uebersicht/Bildungszentren/Unternehmen/Benutzer) mit optional geaenderten
// Parametern per AJAX neu, ohne die Seite komplett neu zu laden - dasselbe Container-Swap-Muster wie
// zuvor bei loadUserList(), nur generalisiert auf alle Views.
function loadCurrentView(overrides) {
    var params = buildDashboardParams(overrides);
    var url = buildUrl(dashboardPageUrl, params);
    var $container = $('#dashboardListContainer');
    $container.css('opacity', '0.5');

    loadIntoContainer($container, url, '#dashboardListContainer', function(ok) {
        $container.css('opacity', '');
        if (!ok) {
            $container.html('<p class="text-secondary p-4">Fehler beim Laden.</p>');
            return;
        }
        if (typeof initFlowbite === 'function') { initFlowbite(); }
    });

    if (window.history && window.history.replaceState) {
        window.history.replaceState(null, '', url);
    }
}

// Laedt die Persona-Begruessung/-Kennzahlen oben auf der Seite nach - ein eigener, schneller Request
// (part=persona), der unabhaengig von und parallel zu loadCurrentView() laeuft.
function loadDashboardPersona() {
    var $personaContainer = $('#dashboardPersonaContainer');
    if ($personaContainer.length === 0) { return; }

    var url = buildUrl(dashboardPageUrl, { part: 'persona' });
    loadIntoContainer($personaContainer, url, '#dashboardPersonaContainer', function(ok) {
        if (!ok) { $personaContainer.html('<p class="text-secondary p-4">Fehler beim Laden.</p>'); }
    });
}

// Laedt die Admin-/Mitarbeiter-Mini-Tabelle (Unternehmen/Bildungszentren, siehe body.html
// #table_unternehmen_liste/#table_bz_liste) mit Suchbegriff/Sortierung neu - eigener, unabhaengiger Request
// (part=secondary), analog zu loadDashboardPersona().
function loadSecondaryTable(kind, overrides) {
    overrides = overrides || {};
    var tableId = kind === 'bz' ? 'table_bz_liste' : 'table_unternehmen_liste';
    var $table = $('#' + tableId);
    if ($table.length === 0) { return; }

    var search = overrides.search !== undefined ? overrides.search : $table.data('search');
    var sort = overrides.sort !== undefined ? overrides.sort : $table.data('sort');
    var dir = overrides.dir !== undefined ? overrides.dir : $table.data('dir');

    var url = buildUrl(dashboardPageUrl, { part: 'secondary', secondary: kind, search: search, sort: sort, dir: dir });
    loadIntoContainer($table, url, '#' + tableId, function(ok) {
        if (!ok) { $table.html('<tbody><tr><td class="p-4 text-secondary">Fehler beim Laden.</td></tr></tbody>'); }
    });
}

var secondarySearchDebounce = {};
function debounceSecondarySearch(kind, value) {
    clearTimeout(secondarySearchDebounce[kind]);
    secondarySearchDebounce[kind] = setTimeout(function() {
        loadSecondaryTable(kind, { search: value, sort: undefined, dir: undefined });
    }, 350);
}

// Spaltenkopf-Klick fuer die Admin-/Mitarbeiter-Mini-Tabellen: toggelt Richtung, wenn dieselbe Spalte
// bereits aktiv ist, sonst aufsteigend - analog zu sortDashboardColumn() fuer die Benutzer-Tabelle.
function sortSecondaryColumn(kind, key) {
    var tableId = kind === 'bz' ? 'table_bz_liste' : 'table_unternehmen_liste';
    var $table = $('#' + tableId);
    var curSort = $table.data('sort');
    var curDir = $table.data('dir') || 'asc';
    var dir = (curSort === key && curDir === 'asc') ? 'desc' : 'asc';
    loadSecondaryTable(kind, { sort: key, dir: dir });
}

// Zeigt/versteckt das Inline-Formular zum Anlegen eines neuen Eintrags (z.B. "Betrieb anlegen").
function toggleCreateForm(formId) {
    $('#' + formId).toggleClass('hidden');
}

// Legt ein neues Unternehmen an (ueba_kunden) und laedt danach die Mini-Tabelle(n) neu.
function submitCreateUnternehmen(event) {
    event.preventDefault();
    var $form = $(event.target);

    $.post(dashboardPageUrl, {
        action: 'create_unternehmen',
        kunden_name: $form.find('[name="kunden_name"]').val(),
        ort: $form.find('[name="ort"]').val(),
        telefon: $form.find('[name="telefon"]').val(),
        email: $form.find('[name="email"]').val()
    }).done(function(data) {
        if (data && data.ok) {
            $form[0].reset();
            $form.addClass('hidden');
            loadSecondaryTable('unternehmen', { search: '' });
        } else {
            alert((data && data.error) || 'Anlegen fehlgeschlagen.');
        }
    }).fail(function() {
        alert('Anlegen fehlgeschlagen.');
    });

    return false;
}

// Spaltenkopf-Klick: toggelt Richtung, wenn dieselbe Spalte bereits aktiv ist, sonst aufsteigend.
function sortDashboardColumn(key) {
    var $container = $('#dashboardListContainer');
    var curSort = $container.data('sort');
    var curDir = $container.data('dir') || 'asc';
    var dir = (curSort === key && curDir === 'asc') ? 'desc' : 'asc';
    loadCurrentView({ sort: key, dir: dir, pg: 1 });
}

// Oeffnet den Detail-Drawer fuer eine beliebige URL (Benutzer/Bildungszentrum/Unternehmen) und laedt
// Header + Inhalt per AJAX-Fragment nach.
function openGenericDrawer(url) {
    currentDrawerUrl = url;

    var $drawer = $('#dashboardDrawer');
    var $fragment = $('#dashboardDrawerFragment');
    var $header = $('#dashboardDrawerHeader');
    $drawer.removeClass('translate-x-full');
    $fragment.html('<p class="text-secondary p-4">Lade...</p>');

    loadIntoContainer($header, url, '#dashboardDrawerHeader');
    loadIntoContainer($fragment, url, '#dashboardDrawerFragment', function(ok) {
        if (!ok) {
            $fragment.html('<p class="text-secondary p-4">Fehler beim Laden.</p>');
            return;
        }
        if (typeof initFlowbite === 'function') { initFlowbite(); }
    });
}

function openUserDrawer(userId, url) {
    currentDrawerUserId = userId;
    openGenericDrawer(url);
}

function openBzDrawer(bzId) {
    currentDrawerUserId = null;
    openGenericDrawer(buildUrl(dashboardPageUrl, { ajax_bz: bzId }));
}

function openKundeDrawer(kundenId) {
    currentDrawerUserId = null;
    openGenericDrawer(buildUrl(dashboardPageUrl, { ajax_kunde: kundenId }));
}

function closeUserDrawer() {
    $('#dashboardDrawer').addClass('translate-x-full');
    currentDrawerUserId = null;
    currentDrawerUrl = null;
}

// Exportiert die aktuell sichtbare View (inkl. aller aktiven Filter/Sortierung) als CSV - liest denselben
// Filterzustand wie loadCurrentView() aus dem DOM, oeffnet aber den Server-Endpunkt direkt statt per AJAX
// zu swappen, damit der Browser den Datei-Download uebernimmt.
function exportDashboardCsv() {
    var params = buildDashboardParams({});
    params.action = 'export_csv';
    window.open(buildUrl(dashboardPageUrl, params), '_blank');
}

$(function() {
    var $searchInput = $('#dashboardSearchInput');
    var $searchForm = $('#dashboardSearchForm');

    // Die Seite liefert beim direkten Aufruf nur das Grundgeruest aus (schnell verfuegbar, siehe
    // index.php: $isAjaxContentRequest) - der eigentliche Inhalt wird sofort danach per AJAX nachgeladen,
    // ueber denselben Container-Swap wie beim Tab-Wechsel/Sortieren/Filtern. Persona-Begruessung und Liste
    // laufen dabei als zwei unabhaengige Requests parallel, damit die (schnellere) Begruessung nicht auf
    // die (potenziell langsamere) Liste warten muss.
    if ($('#dashboardListContainer').length) {
        loadCurrentView({});
    }
    loadDashboardPersona();

    $searchForm.on('submit', function(e) {
        e.preventDefault();
        clearTimeout(dashboardSearchDebounce);
        loadCurrentView({ search: $searchInput.val(), pg: 1 });
    });

    $searchInput.on('input', function() {
        clearTimeout(dashboardSearchDebounce);
        var value = $searchInput.val();
        dashboardSearchDebounce = setTimeout(function() {
            loadCurrentView({ search: value, pg: 1 });
        }, 350);
    });

    $(document).on('change', '.dashboard-bz-checkbox', function() {
        loadCurrentView({ pg: 1 });
    });

    $(document).on('keydown', function(e) {
        if (e.key === 'Escape' && !$('#dashboardDrawer').hasClass('translate-x-full')) {
            closeUserDrawer();
        }
    });
});

function submitDeleteForm(event, userId) {
    event.preventDefault();

    var categories = $('#dashboardDeleteForm input[name="categories[]"]:checked').map(function() {
        return this.value;
    }).get();

    if (categories.length === 0) {
        alert('Bitte mindestens eine Kategorie auswählen.');
        return false;
    }

    if (!confirm('Ausgewählte Daten wirklich löschen? Dies kann nicht rückgängig gemacht werden.')) {
        return false;
    }

    $.post(dashboardPageUrl, { action: 'softdelete', user_id: userId, categories: categories })
        .done(function(data) {
            if (data && data.ok) {
                if (currentDrawerUrl) { openGenericDrawer(currentDrawerUrl); }
            } else {
                alert('Löschen fehlgeschlagen.');
            }
        })
        .fail(function() {
            alert('Löschen fehlgeschlagen.');
        });

    return false;
}
