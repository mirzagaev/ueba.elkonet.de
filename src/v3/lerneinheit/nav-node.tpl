{if $node.type == 'wissenscheck' || !$node.children}
   <a href="{page_url page=$node.page}" class="flex items-center gap-2 rounded-md px-3 py-2 text-sm title-font {if $page->field.id == $node.page->field.id}font-bold bg-secondary{else}font-medium{/if}">
      {if $node.type == 'wissenscheck'}
      <svg class="size-4 fill-primary shrink-0"><use xlink:href="#icon-wissenscheck"></use></svg>
      {/if}
      <span class="truncate">{$node.page->field.title}</span>
   </a>
{else}
   <details {if $node.isActive}open{/if}>
      <summary class="cursor-pointer list-none flex items-center gap-1 rounded-xl text-sm title-font {if $page->field.id == $node.page->field.id}font-bold bg-secondary{else}font-medium{/if}">
         <svg class="size-4 fill-primary shrink-0 ml-2 transition-transform duration-150 ease-[ease] ln-toggle-icon--right"><use xlink:href="#icon-next"></use></svg>
         <a href="{page_url page=$node.page}" class="flex-1 min-w-0 truncate px-2 py-2">{$node.page->field.title}</a>
      </summary>
      <div class="pl-3 ml-3">
         {foreach from=$node.children item=childNode}
            {include file="v3/lerneinheit/nav-node.tpl" node=$childNode}
         {/foreach}
      </div>
   </details>
{/if}
