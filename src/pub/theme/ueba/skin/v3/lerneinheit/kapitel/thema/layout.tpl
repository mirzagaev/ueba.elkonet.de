<div id="ln-drawer-backdrop" class="hidden fixed inset-0 z-50 bg-neutral-800/60"></div>
<div id="ln-drawer" class="fixed top-0 right-0 h-full w-full sm:w-1/2 xl:w-1/3 bg-white dark:bg-neutral-700 z-50 shadow-2xl translate-x-full drawer-animate flex flex-col border-l border-neutral-200 dark:border-neutral-600" role="dialog" aria-modal="true" aria-labelledby="ln-drawer-title">
	<div class="flex items-center justify-between gap-4 px-6 py-5 border-b border-neutral-200 dark:border-neutral-600">
		<h2 id="ln-drawer-title" class="title-font font-bold text-lg truncate"></h2>
		<button type="button" id="ln-drawer-close" class="rounded-full p-2 hover:bg-neutral-200 dark:hover:bg-neutral-900 transition-colors cursor-pointer" aria-label="Schließen">
			<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
			</svg>
		</button>
	</div>
	<div class="flex-1 overflow-y-auto p-6 contentarea" id="ln-drawer-content"></div>
</div>

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
		<figure class="relative overflow-hidden rounded-2xl shadow-sm w-full md:w-64 lg:w-96">
			<iframe class="w-full h-full" src="{$heroVideoEmbedUrl}" title="{$page->field.title}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen loading="lazy"></iframe>
		</figure>
		{elseif $page->extra.thema_img}
		<figure class="relative overflow-hidden rounded-2xl shadow-xl w-auto min-w-sm max-w-full">
			<img class="block w-full h-auto max-w-full max-h-64 lg:max-h-80" alt="{$page->field.title}" src="{$page->extra.thema_img}" />
			<div class="absolute inset-0 z-10 pointer-events-none bg-gradient-to-r from-neutral-800 opacity-80"></div>
			<div class="absolute inset-x-0 bottom-0 z-10 p-6 lg:p-8">
				<h1 class="title-font font-bold text-white text-xl lg:text-3xl break-words">{$page->field.title}</h1>
			</div>
		</figure>
		{/if}

		<section data-edit-template="center" class="contentarea w-full bg-primary rounded-2xl shadow-sm p-6 lg:p-8">
			{if $heroVideoEmbedUrl || !$page->extra.thema_img}
			<h1 class="text-2xl xl:text-3xl font-bold title-font mb-4">{$page->field.title}</h1>
			{/if}
			{$page->getBlocks("center")}
		</section>

		{if $unterseiten}
		<h4 class="w-full text-secondary font-medium leading-snug mt-6 border-t-1 border-subnav pt-6 title-font">Weitere Themen</h4>
		<div class="w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
			{foreach from=$unterseiten item=sub name=subnav}
			<a href="{page_url page=$sub}" class="bg-secondary rounded-4xl flex items-center gap-3 px-4 py-3 hover:shadow-md shadow-sm cursor-pointer text-secondary">
				<span class="flex items-center justify-center size-8 rounded-full bg-primary text-sm font-bold shrink-0">{$smarty.foreach.subnav.iteration}</span>
				<span class="min-w-0">
					<span class="block title-font font-medium">{$sub->field.title}</span>
					{if $sub->field.short}<span class="block text-sm text-secondary mt-1">{$sub->field.short}</span>{/if}
				</span>
			</a>
			{/foreach}
		</div>
		{/if}

		{if $prevPage || $nextPage}
		<div class="w-full flex justify-between gap-4 flex-wrap mt-4 pt-6 border-t-1 border-subnav">
			{if $prevPage}
			<a href="{page_url page=$prevPage}" class="flex items-center gap-3 rounded-4xl bg-primary px-4 py-3 hover:shadow-md shadow-sm max-w-xs">
				<svg class="size-4 fill-primary rotate-180 shrink-0"><use xlink:href="#icon-next"></use></svg>
				<span class="block text-sm font-semibold title-font truncate">{$prevPage->field.title}</span>
			</a>
			{else}<span></span>{/if}
			{if $nextPage}
			<a href="{page_url page=$nextPage}" class="flex items-center gap-3 rounded-4xl bg-primary px-4 py-3 hover:shadow-md shadow-sm max-w-xs text-right ml-auto">
				<span class="block text-sm font-semibold title-font truncate">{$nextPage->field.title}</span>
				<svg class="size-4 fill-primary shrink-0"><use xlink:href="#icon-next"></use></svg>
			</a>
			{/if}
		</div>
		{/if}
	</article>
</section>