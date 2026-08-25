<div class="page_headline mt-4 mb-8 lg:my-12">
	<h2 class="text-2xl xl:text-3xl font-bold">{$page->field.title}</h2>
	{capture name="content1"}{value var="content1" type="content" title="Inhalt"}{/capture}
	{if $smarty.capture.content1|trim != "" || $smarty.request.preview}
		<div class="text-lg xl:text-xl mt-5">{$smarty.capture.content1}</div>
	{/if}
</div>