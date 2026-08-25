{* ##################################################################
   ## Gemeinsamer Baum-Inhalt (Kapitel -> Thema -> beliebig tief    ##
   ## weitere Thema-Unterseiten) fuer skin/ueba/v3/lerneinheit/     ##
   ## nav.tpl. Wird von dort per                                    ##
   ## {include file="v3/lerneinheit/nav-tree.tpl"} ZWEIMAL          ##
   ## eingebunden (einmal fuer die mobile <details>-Variante, einmal ##
   ## fuer die immer-sichtbare Desktop-Variante) - so muss der Baum  ##
   ## nur einmal gepflegt werden. Erwartet die globalen Variablen    ##
   ## $navTree, $lerneinheitPage, $page (siehe nav.tpl).             ##
   ##                                                                ##
   ## Die Kapitel-Ebene ist hier ausgerollt, jede tiefere Thema-Ebene##
   ## steckt rekursiv in skin/ueba/v3/lerneinheit/nav-thema-node.tpl ##
   ## (inkludiert sich selbst fuer beliebige Tiefe). *}

{foreach from=$navTree item=kNode}
{assign var="kapitel" value=$kNode.page}
<details {if $kNode.isActive}open{/if}>
	<summary class="cursor-pointer list-none flex items-center gap-1 rounded-xl text-sm title-font {if $page->field.id == $kapitel->field.id}font-bold bg-secondary {else}font-medium{/if}">
		<svg class="size-4 fill-primary shrink-0 ml-2 transition-transform duration-150 ease-[ease] ln-toggle-icon--right"><use xlink:href="#icon-next"></use></svg>
		<a href="{page_url page=$kapitel}" class="flex-1 min-w-0 truncate px-2 py-2">{$kapitel->field.title}</a>
	</summary>
	<div class="pl-3 ml-3">
		{foreach from=$kNode.children item=tNode}
		{include file="v3/lerneinheit/nav-thema-node.tpl" node=$tNode}
		{/foreach}
	</div>
</details>
{/foreach}