<div class="page_headline">
    <h2 class="text-2xl font-bold flex items-center gap-5 xl:gap-10">
        <svg fill="none" class="size-12 xl:size-{if $prozesstyp|ucfirst == $page->field.title|replace:'ü':'ue'}20{else}14{/if} fill-{$prozesstyp|replace:'ü':'ue'|lower}"><use xlink:href="#icon-{$prozesstyp|replace:'ü':'ue'|lower}"></use></svg>
        {$prozesstyp|ucfirst}
    </h2>
    <div class="text-2xl font-medium">{$page->field.title}</div>
</div>
{if $prozesstyp|ucfirst != $page->field.title|replace:'ü':'ue'}{$page->field.content}{/if}

<div class="dialog inhaltsblock bg-secondary">
    <div class="bg-{$prozesstyp|replace:'ü':'ue'|lower} borderRandTop"></div>
    <div class="dialogContentArea">
        <div data-edit-template="left" class="bilderKiBlock">
            {$page->getBlocks("left")}
        </div>
        <!-- Chat / Telefonat -->
        <div id="dialog-container">
            <!-- Preload Status -->
            <div id="status-bar">
                <div id="loader-icon" class="border-{$prozesstyp|replace:'ü':'ue'|lower} block hidden"></div>
                <span id="status-text">Prüfe lokale Sprachdateien...</span>
            </div>

			<div data-edit-template="middle">{$page->getBlocks("middle")}</div>
        </div>
    </div>
    <div class="bg-{$prozesstyp|replace:'ü':'ue'|lower} borderRandBottom"></div>
</div>
<style>
{literal}
    .audio-eq {
        display: inline-block;
        vertical-align: middle;
        margin-left: 0.375rem;
        color: var(--color-analyse, #3b82f6);
        cursor: pointer;
        touch-action: none;
    }
{/literal}
</style>
<script>
{literal}
    const pageUrl = "{/literal}{$pageUrl}{literal}";
    const apiKey = "{/literal}{$geminiApiKey}{literal}";
{/literal}
</script>