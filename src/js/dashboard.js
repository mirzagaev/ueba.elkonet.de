var currentDrawerUserId = null;
var currentDrawerUrl = null;
var dashboardSearchDebounce = null;

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

    $container.load(url + ' #dashboardListContainer', function(response, status) {
        $container.css('opacity', '');
        if (status === 'error') {
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
    $personaContainer.load(url + ' #dashboardPersonaContainer', function(response, status) {
        if (status === 'error') {
            $personaContainer.html('<p class="text-secondary p-4">Fehler beim Laden.</p>');
        }
    });
}

// Tab-Wechsel: setzt Suche/Filter/Sortierung zurueck, damit man nicht mit den Filtern der vorigen View
// in der neuen View landet (jede View hat ihren eigenen Datenbestand).
function switchDashboardView(view) {
    $('#dashboardSearchInput').val('');
    $('#dashboardRoleFilter').val('all');
    $('#dashboardStatusFilter').val('all');
    loadCurrentView({ view: view, search: '', pg: 1, sort: '', dir: 'asc', role: 'all', status: 'all' });
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

    $header.load(url + ' #dashboardDrawerHeader');
    $fragment.load(url + ' #dashboardDrawerFragment', function(response, status) {
        if (status === 'error') {
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
