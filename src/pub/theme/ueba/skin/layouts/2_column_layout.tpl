<div data-edit-template="center" class="templateLayout">
	{$page->getBlocks("center")}
</div>

<div class="grid md:grid-cols-2 templateLayout">
	<div data-edit-template="left" class="templateLayout">
		{$page->getBlocks("left")}
	</div>
	<div data-edit-template="right" class="templateLayout">
		{$page->getBlocks("right")}
	</div>
</div>

<div data-edit-template="bottom" class="templateLayout">
	{$page->getBlocks("bottom")}
</div>