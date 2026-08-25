{* ##################################################################
   ## Rekursiver Baum-Knoten fuer den Lerneinheit-Navigator          ##
   ## (skin/ueba/v3/lerneinheit/nav.tpl). Ein Knoten mit Kindern    ##
   ## wird als <details> gerendert (aktiver Pfad serverseitig       ##
   ## "open"), ein Knoten ohne Kinder als einfacher Link - komplett ##
   ## ohne JavaScript.                                               ##
   ##                                                                ##
   ## Parameter:                                                     ##
   ##   node      - die zu rendernde Seite                          ##
   ##   current   - die gerade angezeigte Seite                     ##
   ##   childtype - Typ-String, nach dem Kinder gefiltert werden     ##
   ##               (Kapitel -> "...thema", Thema -> sich selbst)   ##
   ################################################################## *}
{assign var="isCurrent" value=false}
{if $node->field.id == $current->field.id}{assign var="isCurrent" value=true}{/if}

{assign var="isActive" value=false}
{if $node->field.id == $current->field.id}{assign var="isActive" value=true}{/if}
{foreach from=$breadlinks item=bl}
	{if $bl->field.id == $node->field.id}{assign var="isActive" value=true}{/if}
{/foreach}

{navigation page=$node var=navKinder}
{if $navKinder}
<details {if $isActive}open{/if}>
	<summary class="cursor-pointer list-none flex items-center gap-2 rounded-md px-3 py-2 text-sm title-font {if $isCurrent}font-bold bg-secondary border-l-3 border-secondary-active{else}font-medium{/if}">
		<svg class="size-3 fill-secondary shrink-0 transition-transform"><use xlink:href="#icon-next"></use></svg>
		<span class="flex-1 min-w-0 truncate">{$node->field.title}</span>
	</summary>
	<div class="pl-4 border-l border-subnav ml-4">
		{foreach from=$navKinder item=child}
		{if $child->field.type == $childtype}
		{include file="v3/lerneinheit/nav-node.tpl" node=$child current=$current childtype="v3/lerneinheit/kapitel/thema"}
		{/if}
		{/foreach}
	</div>
</details>
{else}
<a href="{page_url page=$node}" class="block rounded-md px-3 py-2 pl-8 text-sm title-font {if $isCurrent}font-bold bg-secondary border-l-3 border-secondary-active{else}font-medium{/if}">
	{$node->field.title}
</a>
{/if}
{navigation_end}
