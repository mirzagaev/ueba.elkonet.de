<section class="flex flex-col lg:flex-row gap-8 items-start">
	<aside class="w-full lg:w-1/3 flex flex-col gap-8">
		{if $lerneinheitPage}{include file="v3/lerneinheit/nav.tpl"}{/if}
		{if $begriffeListe}
		<div class="bg-primary rounded-2xl shadow-sm p-4">
			<div class="text-xs uppercase tracking-wide text-secondary font-semibold mb-3">Begriffe im Glossar</div>
			<div class="flex flex-wrap gap-2">
				{foreach from=$begriffeListe item=begriff}
				<span class="bg-secondary text-secondary text-xs font-medium rounded-full px-3 py-1">{$begriff}</span>
				{/foreach}
			</div>
		</div>
		{/if}
	</aside>

	<article class="w-full lg:w-3/4 flex flex-wrap gap-8">
		{if $heroVideoEmbedUrl}
		<figure class="relative overflow-hidden rounded-2xl shadow-xl w-full md:w-64 lg:w-96 h-64 lg:h-80">
			<iframe class="w-full h-full absolute inset-0" src="{$heroVideoEmbedUrl}" title="{$page->field.title}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen loading="lazy"></iframe>
		</figure>
		{elseif $page->extra.kapitel_img}
		<figure class="relative overflow-hidden rounded-2xl shadow-xl w-auto min-w-sm max-w-full">
			<img class="block w-full h-auto max-w-full max-h-64 lg:max-h-80" alt="{$page->field.title}" src="{$page->extra.kapitel_img}" />
			<div class="absolute inset-0 z-10 pointer-events-none bg-gradient-to-r from-neutral-800 opacity-80"></div>
			<div class="absolute inset-x-0 bottom-0 z-10 p-6 lg:p-8">
				<h1 class="title-font font-bold text-white text-xl lg:text-3xl break-words">{$page->field.title}</h1>
			</div>
		</figure>
		{/if}

		<section data-edit-template="center" class="contentarea w-full bg-primary rounded-2xl shadow-sm p-6 lg:p-8">
			{if $heroVideoEmbedUrl || !$page->extra.kapitel_img}
			<h1 class="text-2xl xl:text-3xl font-bold title-font mb-4">{$page->field.title}</h1>
			{/if}
			{$page->getBlocks("center")}
		</section>

		{if $themenListe}
		<h4 class="w-full text-secondary font-medium leading-snug mt-6 border-t-1 border-subnav pt-6 title-font">Themen</h4>
		<div class="w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
			{foreach from=$themenListe item=thema name=themanav}
			<a href="{page_url page=$thema}" class="bg-secondary rounded-4xl flex items-center gap-3 px-4 py-3 hover:shadow-md shadow-sm cursor-pointer text-secondary">
				<span class="flex items-center justify-center size-8 rounded-full bg-primary text-sm font-bold shrink-0">{$smarty.foreach.themanav.iteration}</span>
				<span class="min-w-0">
					<span class="block title-font font-medium">{$thema->field.title}</span>
					{if $thema->field.short}<span class="block text-sm text-secondary mt-1">{$thema->field.short}</span>{/if}
				</span>
			</a>
			{/foreach}
		</div>
		{/if}

		{if $prevPage || $nextPage}
		<div class="w-full flex justify-between gap-4 flex-wrap mt-8 pt-6 border-t-1 border-subnav">
			{if $prevPage}
			<a href="{page_url page=$prevPage}" class="flex items-center gap-3 rounded-4xl bg-primary px-4 py-3 hover:shadow-md shadow-sm max-w-xs">
				<svg class="size-4 fill-primary rotate-180 shrink-0"><use xlink:href="#icon-next"></use></svg>
				<span class="min-w-0">
					<span class="block text-sm font-semibold title-font truncate">{$prevPage->field.title}</span>
				</span>
			</a>
			{else}<span></span>{/if}
			{if $nextPage}
			<a href="{page_url page=$nextPage}" class="flex items-center gap-3 rounded-4xl bg-primary px-4 py-3 hover:shadow-md shadow-sm max-w-xs text-right ml-auto">
				<span class="min-w-0">
					<span class="block text-sm font-semibold title-font truncate">{$nextPage->field.title}</span>
				</span>
				<svg class="size-4 fill-primary shrink-0"><use xlink:href="#icon-next"></use></svg>
			</a>
			{/if}
		</div>
		{/if}
	</article>
</section>