{if $navTree}
   {foreach from=$navTree item=kapitelNode}
      <details {if $kapitelNode.isActive}open{/if}>
         <summary class="cursor-pointer list-none flex items-center gap-1 rounded-xl text-sm title-font {if $page->field.id == $kapitelNode.page->field.id}font-bold bg-secondary{else}font-medium{/if}">
            <svg class="size-4 fill-primary shrink-0 ml-2 transition-transform duration-150 ease-[ease] ln-toggle-icon--right"><use xlink:href="#icon-next"></use></svg>
            <a href="{page_url page=$kapitelNode.page}" class="flex-1 min-w-0 truncate px-2 py-2">{$kapitelNode.page->field.title}</a>
         </summary>
         {if $kapitelNode.children}
         <div class="pl-3 ml-3">
            {foreach from=$kapitelNode.children item=childNode}
               {include file="v3/lerneinheit/nav-node.tpl" node=$childNode}
            {/foreach}
         </div>
         {/if}
      </details>
   {/foreach}
{/if}
