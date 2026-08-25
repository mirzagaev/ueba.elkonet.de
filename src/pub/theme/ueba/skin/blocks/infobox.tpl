<div class="infobox bg-primary">
	{capture name="infobox_headline"}{value var="infobox_headline" type="content" title="< Überschrift >"}{/capture}
	{if $smarty.capture.infobox_headline|trim != "" || $smarty.request.preview}
		<div class="bg-secondary kachelliste_headline">{$smarty.capture.infobox_headline}</div>
	{/if}
	
	<div class="kachelliste">
		{value var="infobox_content" type="content" title="< Listenelemente >"}
	</div>
</div>