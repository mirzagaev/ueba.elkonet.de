<div class="flex md:flex-row flex-col mt-3 xl:mt-0 mb-12 contentarea">
	<div class="w-full h-full md:w-1/3 mb-10 md:mb-0 relative">
		{value var="image1" type="media" title="Bild" attr.class="max-w-full max-h-full object-cover mx-auto object-center block"}
	</div>
	<div class="w-full md:w-2/3 md:pl-6 text-lg text-primary">
		<div class="text-collapse transition-all duration-300 overflow-hidden {if !$smarty.request.preview}max-h-[13rem]{/if}">
			{value var="content2" type="content" title="Inhalt"}
		</div>
		{if !$smarty.request.preview}<button class="toggletextcontent">mehr anzeigen</button>{/if}
	</div>
</div>