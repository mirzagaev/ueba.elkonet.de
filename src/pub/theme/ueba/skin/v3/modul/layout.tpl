<section data-edit-template="center">
	{$page->getBlocks("center")}
</section>

<!-- ANZEIGEN NUR IN MODULSTARTSEITE -->
{if $page->extra.typ == "main"}
<section class="w-full mt-12">
    <div class="w-fit mx-auto my-5 text-center border-t-1 border-gray-400 px-20 py-4 hidden">
        <div class="flex items-center">
            <svg class="w-4 h-4 fill-yellow-300"><use xlink:href="#icon-star"></use></svg>
            <svg class="w-4 h-4 ms-1 fill-yellow-300"><use xlink:href="#icon-star"></use></svg>
            <svg class="w-4 h-4 ms-1 fill-yellow-300"><use xlink:href="#icon-star"></use></svg>
            <svg class="w-4 h-4 ms-1 fill-yellow-300"><use xlink:href="#icon-star"></use></svg>
            <svg class="w-4 h-4 ms-1 fill-gray-300"><use xlink:href="#icon-star"></use></svg>
            <p class="ms-1 text-sm font-medium text-gray-500 dark:text-gray-400">4.95</p>
            <p class="ms-1 text-sm font-medium text-gray-500 dark:text-gray-400">out of</p>
            <p class="ms-1 text-sm font-medium text-gray-500 dark:text-gray-400">5</p>
        </div>
        <a href="#" class="text-sm font-medium text-primary underline hover:no-underline dark:text-white">73 Bewertungen insgesamt</a>
    </div>

    <h3 class="text-lg font-bold w-fit mx-auto border-t-1 border-gray-400 xl:px-20 pt-4 pb-2">Deine Meinung zählt!</h3>
    <h3 class="text-lg w-fit mx-auto uppercase">Jetzt Portal bewerten</h3>
    <div class="grid h-full w-fit sm:grid-cols-2 mx-auto font-medium my-5 gap-2 xl:gap-4">
        <div class="h-fit justify-center px-4 py-3 pt-3 bg-primary rounded">
            <div class="flex gap-4">
                <div class="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-secondary rounded-full">
                    <span class="font-medium text-primary">MM</span>
                </div>
                <div class="font-medium text-sm">
                    <div>Max M.</div>
                    <div class="flex items-center">
                        <svg class="w-4 h-4 fill-yellow-300"><use xlink:href="#icon-star"></use></svg>
                        <svg class="w-4 h-4 ms-1 fill-yellow-300"><use xlink:href="#icon-star"></use></svg>
                        <svg class="w-4 h-4 ms-1 fill-yellow-300"><use xlink:href="#icon-star"></use></svg>
                        <svg class="w-4 h-4 ms-1 fill-yellow-300"><use xlink:href="#icon-star"></use></svg>
                        <svg class="w-4 h-4 ms-1 fill-gray-300"><use xlink:href="#icon-star"></use></svg>
                    </div>
                </div>
            </div>
        </div>
        <div class="h-fit justify-center px-4 py-3 pt-3 bg-primary rounded">
            <div class="flex gap-4">
                <div class="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-secondary rounded-full">
                    <span class="font-medium text-primary">MM</span>
                </div>
                <div class="font-medium">
                    <div>Anton M.</div>
                    <div class="flex items-center">
                        <svg class="w-4 h-4 fill-yellow-300"><use xlink:href="#icon-star"></use></svg>
                        <svg class="w-4 h-4 ms-1 fill-yellow-300"><use xlink:href="#icon-star"></use></svg>
                        <svg class="w-4 h-4 ms-1 fill-yellow-300"><use xlink:href="#icon-star"></use></svg>
                        <svg class="w-4 h-4 ms-1 fill-gray-300"><use xlink:href="#icon-star"></use></svg>
                        <svg class="w-4 h-4 ms-1 fill-gray-300"><use xlink:href="#icon-star"></use></svg>
                    </div>
                </div>
            </div>
            <p class="text-sm font-semibold text-secondary mt-2">Verständlch erklärt, guter Dozent.</p>
        </div>
    </div>
</section>
{/if}