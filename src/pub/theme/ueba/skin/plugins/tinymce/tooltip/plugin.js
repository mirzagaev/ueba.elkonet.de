tinymce.PluginManager.add('tooltip', function (editor) {

	var CSS_CLASS = 'cms-tooltip';
	var BUBBLE_CLASS = 'cms-tooltip-bubble';
	var BUBBLE_TEXT_CLASS = 'cms-tooltip-bubble-text';
	var ICON_CLASS = 'cms-tooltip-icon';
	var ARROW_CLASSES = 'absolute left-1/2 top-full -mt-1 h-2 w-2 -translate-x-1/2 rotate-45 bg-gray-900';

	function getSelectedTooltipElement() {
		return editor.dom.getParent(editor.selection.getNode(), '.' + CSS_CLASS);
	}

	function openDialog() {
		var tooltipElement = getSelectedTooltipElement();
		var currentText = tooltipElement ? editor.dom.getAttrib(tooltipElement, 'data-tooltip') : '';

		if (!tooltipElement && editor.selection.isCollapsed()) {
			editor.notificationManager.open({
				text: 'Bitte markieren Sie zuerst einen Text, um einen Tooltip hinzuzufügen.',
				type: 'warning',
				timeout: 4000
			});
			return;
		}

		editor.windowManager.open({
			title: 'Tooltip',
			body: {
				type: 'panel',
				items: [
					{
						type: 'textarea',
						name: 'tooltipText',
						label: 'Tooltip-Text'
					}
				]
			},
			initialData: {
				tooltipText: currentText
			},
			buttons: [
				{
					type: 'custom',
					name: 'remove',
					text: 'Entfernen',
					align: 'start',
					disabled: !tooltipElement
				},
				{
					type: 'cancel',
					text: 'Abbrechen'
				},
				{
					type: 'submit',
					text: 'Speichern',
					buttonType: 'primary'
				}
			],
			onAction: function (api, details) {
				if (details.name === 'remove') {
					removeTooltip(tooltipElement);
					api.close();
				}
			},
			onSubmit: function (api) {
				var data = api.getData();
				var text = tinymce.trim(data.tooltipText);

				if (!text) {
					api.close();
					return;
				}

				if (tooltipElement) {
					updateTooltip(tooltipElement, text);
				} else {
					wrapSelectionWithTooltip(text);
				}

				editor.undoManager.add();
				api.close();
			}
		});
	}

	function buildTooltipNode(text, innerHtml) {
		var dom = editor.dom;
		var bubbleId = dom.uniqueId('cms-tooltip-');

		var outer = dom.create('span', {
			'class': CSS_CLASS,
			'data-tooltip': text,
			'tabindex': '0',
			'aria-describedby': bubbleId
		});
		outer.innerHTML = innerHtml;

		var icon = dom.create('span', {
			'class': ICON_CLASS,
			'aria-hidden': 'true'
		});
		icon.textContent = 'i';
		outer.appendChild(icon);

		var bubble = dom.create('span', {
			'class': BUBBLE_CLASS,
			'id': bubbleId,
			'role': 'tooltip'
		});

		var bubbleText = dom.create('span', { 'class': BUBBLE_TEXT_CLASS });
		bubbleText.textContent = text;

		var arrow = dom.create('span', { 'class': ARROW_CLASSES });

		bubble.appendChild(bubbleText);
		bubble.appendChild(arrow);
		outer.appendChild(bubble);

		return outer;
	}

	function wrapSelectionWithTooltip(text) {
		var content = editor.selection.getContent({ format: 'html' });
		var node = buildTooltipNode(text, content);

		editor.selection.setContent(editor.dom.getOuterHTML(node));
	}

	function updateTooltip(tooltipElement, text) {
		editor.dom.setAttrib(tooltipElement, 'data-tooltip', text);

		var bubbleText = editor.dom.select('.' + BUBBLE_TEXT_CLASS, tooltipElement)[0];
		if (bubbleText) {
			bubbleText.textContent = text;
		}
	}

	function removeTooltip(tooltipElement) {
		if (!tooltipElement) {
			return;
		}

		var bubble = editor.dom.select('.' + BUBBLE_CLASS, tooltipElement)[0];
		if (bubble) {
			editor.dom.remove(bubble);
		}

		var icon = editor.dom.select('.' + ICON_CLASS, tooltipElement)[0];
		if (icon) {
			editor.dom.remove(icon);
		}

		editor.dom.remove(tooltipElement, true);
		editor.undoManager.add();
	}

	editor.ui.registry.addToggleButton('tooltip', {
		icon: 'help',
		tooltip: 'Tooltip für markierten Text',
		onAction: openDialog,
		onSetup: function (api) {
			var updateState = function () {
				api.setActive(!!getSelectedTooltipElement());
			};

			editor.on('NodeChange', updateState);

			return function () {
				editor.off('NodeChange', updateState);
			};
		}
	});

	editor.ui.registry.addMenuItem('tooltip', {
		icon: 'help',
		text: 'Tooltip einfügen/bearbeiten',
		onAction: openDialog
	});

	return {
		getMetadata: function () {
			return {
				name: 'Tooltip Plugin',
				url: 'https://hilfe.egocms.com/design/design-erstellen-und-einstellen/erweiterte-einstellungen-(conf_json)/editor-plugins-erstellen'
			};
		}
	};

});
