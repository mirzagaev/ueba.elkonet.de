{* ##################################################################
   ## Rekursiver Knoten fuer EIN Thema im Navigator-Baum. Ein Thema  ##
   ## kann selbst beliebig tief weitere Thema-Unterseiten haben     ##
   ## (z.B. Uebertragungsmedien -> Uebertragung ueber Kupferleitungen ##
   ## -> Twisted-Pair-Kabel -> Schirmausfuehrungen... -> Bezeichnungs- ##
   ## system TP-Kabel) - deshalb inkludiert dieses Template sich     ##
   ## selbst fuer jedes Kind. Dieses Muster ist im Bestand bereits   ##
   ## bewaehrt, siehe skin/ueba/themes/body/more_children.html       ##
   ## ({include file=$childTpl ...} inkludiert dieselbe Datei erneut).##
   ##                                                                ##
   ## Erwartet:                                                      ##
   ##   $node - array('page'=>Seite, 'children'=>array(...), 'isActive'=>bool)
   ##           (siehe site/ueba/v3/lerneinheit/funktionen.php,       ##
   ##           lerneinheit_build_thema_nodes())                     ##
   ##   $page - aktuell angezeigte Seite (Standard-Var, global)      ##
   ################################################################## *}
{assign var="thema" value=$node.page}
{if $node.children}
<details {if $node.isActive}open{/if}>
	<summary class="cursor-pointer list-none flex items-center gap-1 rounded-xl text-sm title-font {if $page->field.id == $thema->field.id}font-bold bg-secondary {else}font-medium{/if}">
		<svg class="size-4 fill-primary shrink-0 ml-2 transition-transform duration-150 ease-[ease] ln-toggle-icon--right"><use xlink:href="#icon-next"></use></svg>
		<a href="{page_url page=$thema}" class="flex-1 min-w-0 truncate px-2 py-2">{$thema->field.title}</a>
	</summary>
	<div class="pl-3 ml-3">
		{foreach from=$node.children item=childNode}
		{include file="v3/lerneinheit/nav-thema-node.tpl" node=$childNode}
		{/foreach}
	</div>
</details>
{else}
<a href="{page_url page=$thema}" class="block rounded-md px-3 py-2 text-sm title-font {if $page->field.id == $thema->field.id}font-bold bg-secondary {else}font-medium{/if}">
	{$thema->field.title}
</a>
{/if}
