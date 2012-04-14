/*jshint node:true jquery:true*/
"use strict";

var clayer = require('../clayer');

module.exports = function(editor) {
	editor.editables = {};

	editor.editables.NumberEditable = function() { return this.build.apply(this, arguments); };
	editor.editables.CycleEditable = function() { return this.build.apply(this, arguments); };
	editor.editables.ColorEditable = function() { return this.build.apply(this, arguments); };

	var addCommonMethods = function(type, editable) {
		editable.build = function(node, surface, delegate, parseValue, makeValue) {
			this.surface = surface;
			this.delegate = delegate;
			this.parseValue = parseValue;
			this.makeValue = makeValue;

			this.line = node.lineLoc.line;
			this.column = node.lineLoc.column;
			this.column2 = node.lineLoc.column2;
			this.text = delegate.getEditablesText(node);
			this.finalText = this.text;
			this.valid = this.parseValue(this.text);

			this.$marking = $('<div class="editor-marking editor-editable editor-' + type + '-editable"></div>');
			this.surface.addElement(this.$marking);
			this.init();

			this.updateMarking();
		};

		editable.offsetColumn = function(column, amount) {
			if (this.column2 > column) {
				this.column2 += amount;
				if (this.column > column) {
					this.column += amount;
				}
				this.updateMarking();
			}
		};

		/// INTERNAL FUNCTIONS ///

		editable.updateMarking = function() {
			if (!this.valid) this.remove();
			this.surface.setElementLocationRange(this.$marking, this.line, this.column, this.line+1, this.column2);
		};

		editable.updateValue = function() {
			this.delegate.editableReplaceCode(this.line, this.column, this.column2, this.text);
		};

		return editable;
	};

	editor.editables.CycleEditable.prototype = addCommonMethods('cycle', {
		init: function() {
			this.$marking.on('click', $.proxy(this.cycle, this));
		},
		remove: function() {
			this.$marking.remove();
		},
		cycle: function() {
			this.text = this.makeValue();
			this.updateValue();
			this.valid = this.parseValue(this.text);
		}
	});

	editor.editables.NumberEditable.prototype = addCommonMethods('number', {
		init: function() {
			this.hasTooltip = false;
			this.touchable = new clayer.Touchable(this.$marking, this);
		},

		remove: function() {
			this.hideTooltip();
			this.$marking.remove();
			this.touchable.setTouchable(false);
		},

		/// INTERNAL FUNCTIONS ///
		showTooltip: function() {
			if (!this.hasTooltip) {
				this.hasTooltip = true;
				this.$marking.tooltip({
					title: '&larr; drag &rarr;',
					placement: 'bottom'
				});
			}
			this.$marking.tooltip('show');
		},

		hideTooltip: function() {
			if (this.hasTooltip) {
				this.$marking.tooltip('hide');
			}
		},

		touchDown: function(touch) {
			this.hideTooltip();
		},

		touchMove: function(touch) {
			this.text = this.makeValue(touch.translation.x);
			this.updateValue();
		},

		touchUp: function(touch) {
			this.valid = this.parseValue(this.text);
			if (touch.wasTap) {
				this.showTooltip();
			}
		}
	});

	editor.editables.ColorEditable.prototype = addCommonMethods('color', {
		init: function() {
			this.$colorPicker = $('<div class="editor-editable-colorpicker"></div>');
			this.box = new editor.Box(this.$marking, this.surface);
			this.box.html(this.$colorPicker);
			this.$colorPicker.colorPicker({
				format: this.colorData.format,
				size: 200,
				colorChange: $.proxy(this.colorChange, this)
			});
			this.$colorPicker.colorPicker('setColor', this.colorData.value);
			this.$marking.on('click', $.proxy(this.click, this));
		},

		/// INTERNAL FUNCTIONS ///
		remove: function() {
			this.$marking.remove();
			this.box.remove();
		},

		colorChange: function(event, ui) {
			this.text = this.makeValue(ui.color);
			this.updateValue();
		},

		click: function(event) {
			this.valid = this.parseValue(this.text);
			if (this.box.$element.is(':visible')) {
				this.box.$element.fadeOut(150);
			} else {
				this.box.$element.fadeIn(150);
				this.box.updatePosition();
			}
		}
	});
};
