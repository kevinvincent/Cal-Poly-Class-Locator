/**
 * Plugin: "optgroup_max_options" (selectize.js)
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this
 * file except in compliance with the License. You may obtain a copy of the License at:
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF
 * ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 *
 * @authors Ilya Bugaev <del42rus@ya.ru>
 */

 Selectize.define('optgroup_max_options', function(options) {
  var self = this;

  options = $.extend({
    'maxOptions': null
  }, options);

  var refreshOptions = function() {
      if (self.settings.mode != 'multi' || !Object.keys(self.optgroups).length) return;

      $.each(self.options, function(index, option) {
        option.isSelected = false;
      });

      $.each(self.items, function(index, value) {
        self.options[value].isSelected = true;

        $.each(self.optgroups, function(index, optgroup) {
          optgroup.selectedCount = 0;
        });

        $.each(self.options, function(index, option){
          if (option.isSelected) {
            self.optgroups[option.optgroup].selectedCount += 1;
          }
        })

        $.each(self.optgroups, function(index, optgroup) {
          if (optgroup.selectedCount == optgroup.maxOptions || optgroup.selectedCount == options.maxOptions) {
            self.$dropdown_content.find('[data-group="' + optgroup.label + '"]').find('.option').addClass('option-disabled')
          } 
        });
      })
  };

  self.onFocus = (function() {
    var original = self.onFocus;

    $.each(self.items, function(index, value){
      self.options[value].isSelected = true;
    });

    return function() {
      original.apply(this, arguments);

      refreshOptions();
    };
  })();

  self.onOptionSelect = (function() {
    var original = self.onOptionSelect;

    return function(e) {
      var value, $target, $option;

      if (e.preventDefault) {
        e.preventDefault();
        e.stopPropagation();
      }

      $target = $(e.currentTarget);

      if ($target.hasClass('option-disabled')) {
        return;
      } else if ($target.hasClass('create')) {
        self.createItem();
      } else {
        value = $target.attr('data-value');

        if (value) {
          self.lastQuery = null;
          self.setTextboxValue('');
          self.addItem(value);

          refreshOptions()

          if (!self.settings.hideSelected && e.type && /mouse/.test(e.type)) {
            self.setActiveOption(self.getOption(value));
          }
        }

        self.blur();
      }

      return original.apply(this, arguments);
    };
  })();

  self.removeItem = (function() {
    var original = self.removeItem;

    return function(value) {
      refreshOptions();

      self.blur();

      return original.apply(this, arguments);
    }
  })();

});