{if $lerneinheitPage}
   {navigation id=$lerneinheitPage->field.id var=lerneinheitNav}
      {foreach from=$lerneinheitNav item=unterseitenLerneinheit name=lerneinheitnavigation}
         <details {if $unterseitenLerneinheit->field.id == $page->field.id || $unterseitenLerneinheit->field.id == $lerneinheitKapitelPage->field.id }open{/if}>
            <summary class="cursor-pointer list-none flex items-center gap-1 rounded-xl text-sm title-font {if $page->field.id == $unterseitenLerneinheit->field.id}font-bold bg-secondary {else}font-medium{/if}">
               <svg class="size-4 fill-primary shrink-0 ml-2 transition-transform duration-150 ease-[ease] ln-toggle-icon--right"><use xlink:href="#icon-next"></use></svg>
               <a href="{page_url page=$unterseitenLerneinheit}" class="flex-1 min-w-0 truncate px-2 py-2">{$unterseitenLerneinheit->field.title}</a>
            </summary>
            <div class="pl-3 ml-3">
               {if !$lerneinheitKapitelPage}
                  {get_children page=$page var="kapitelChildren"}
               {else}
                  {get_children page=$lerneinheitKapitelPage var="kapitelChildren"}
               {/if}
               {foreach from=$kapitelChildren item=tNode}
                  <a href="{page_url page=$tNode}" class="flex items-center gap-2 rounded-md px-3 py-2 text-sm title-font {if $page->field.id == $tNode->field.id}font-bold bg-secondary {else}font-medium{/if}">
                     {if $node.type == 'wissenscheck'}
                     <svg class="size-4 fill-primary shrink-0"><use xlink:href="#icon-wissenscheck"></use></svg>
                     {/if}
                     <span class="truncate">{$tNode->field.name}</span>
                  </a>
               {/foreach}
            </div>
         </details>
      {/foreach}
   {navigation_end}
{/if}