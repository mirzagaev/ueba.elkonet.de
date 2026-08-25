<div class="bg-secondary w-full rounded-2xl shadow-md overflow-hidden">
	<div class="w-full">{value var="hilfe_media" type="media" title="Bild" attr.class="max-w-full max-h-full object-cover mx-auto object-center block"}</div>

	{capture name="hilfe_headline"}{value var="hilfe_headline" type="content" title="< Überschrift >"}{/capture}
	{if $smarty.capture.hilfe_headline|trim != "" || $smarty.request.preview}
		<div class="px-6 w-full mt-3 md:mt-6 text-xl font-bold bg-secondary kachelliste_headline">{$smarty.capture.hilfe_headline}</div>
	{/if}

	{capture name="infobox_content"}{value var="infobox_content" type="content" title="< Inhalt >"}{/capture}
	{if $smarty.capture.infobox_content|trim != "" || $smarty.request.preview}
		<div class="p-6 pt-2">{$smarty.capture.infobox_content}</div>
	{/if}
</div>