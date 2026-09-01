<details class="block lg:hidden bg-primary rounded-2xl shadow-sm overflow-hidden">
	<summary class="list-none cursor-pointer flex items-center justify-between gap-3 py-4 px-6 bg-secondary">
		<div class="min-w-0">
			<span class="block text-xs uppercase tracking-wide text-secondary font-semibold mb-1">Lerneinheit</span>
			<a href="{page_url page=$lerneinheitPage}" class="block title-font font-bold leading-snug truncate">{$lerneinheitPage->field.title}</a>
		</div>
		<svg class="size-5 stroke-primary shrink-0 transition-transform duration-150 ease-[ease] ln-toggle-icon--down"><use xlink:href="#icon-down"></use></svg>
	</summary>
	<nav class="p-4 max-h-[32rem] overflow-y-auto">
		{include file="v3/lerneinheit/nav-tree.tpl"}
	</nav>
</details>

{* Ab 1024px: immer sichtbar. *}
<div class="hidden lg:block bg-primary rounded-2xl shadow-sm overflow-hidden">
	<div class="py-4 px-6 bg-secondary">
		<div class="text-xs uppercase tracking-wide text-secondary font-semibold mb-1">Lerneinheit</div>
		<a href="{page_url page=$lerneinheitPage}" class="block title-font font-bold leading-snug truncate">{$lerneinheitPage->field.title}</a>
	</div>
	<nav class="p-4">
		{include file="v3/lerneinheit/nav-tree.tpl"}
	</nav>
</div>

{if $lerneinheitPage->extra.glossar_link}
<div>
	<a href="{$lerneinheitPage->extra.glossar_link}" class="flex items-center justify-center gap-2 rounded-2xl bg-secondary text-secondary text-sm font-semibold px-4 py-3 hover:shadow-md shadow-sm">
		<svg class="size-4 fill-secondary shrink-0"><use xlink:href="#icon-glossar"></use></svg>
		Zum Glossar
	</a>
</div>
{/if}