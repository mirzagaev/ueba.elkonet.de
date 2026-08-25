{counter name="telCounter" assign="telCount"}
<div class="text2speech" data-id="{$page->field.id}_{$telCount}" data-cdate="{$p_cdate}">
	<div class="sprecherDiv{if $telCount % 2 == 0} ml-auto{/if}">
		<span>{value var="contentChatSprecher" type="text" title="Sprecher"}</span>
		<button class="audio-btns hidden"><svg class="size-4 fill-white"><use xlink:href="#icon-audio-play"></use></svg></button>
		<canvas class="audio-eq hidden" width="64" height="18" aria-hidden="true"></canvas>
	</div>
	{value var="contentChatAussage" type="minimal" title="Nachricht / Aussage" attr.class="contentChatDiv"}
</div>