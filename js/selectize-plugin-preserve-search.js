/**
 * Plugin: "preserve_search" (selectize.js)
 * Based on: "preserve_on_blur" of Eric M. Klingensmith
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this
 * file except in compliance with the License. You may obtain a copy of the License at:
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF
 * ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */
Selectize.define('preserve_search', function (options) {
    var self = this;

    options.text = options.text || function (option) {
        return option[this.settings.labelField];
    };

    this.onBlur = (function (e) {
        var original = self.onBlur;

        return function (e) {
            // Capture the current input value
            var $input = this.$control_input;
            var inputValue = $input.val();

            // Do the default actions
            original.apply(this, [e]);

            // Set the value back                    
            this.setTextboxValue(inputValue);
        };
    })();

    this.onOptionSelect = (function (e) {
        var original = self.onOptionSelect;

        return function (e) {
            // Capture the current input value
            var $input = this.$control_input;
            var inputValue = $input.val();

            original.apply(this, [e]);
            this.setTextboxValue(inputValue);
            // this.refreshOptions();
            if (this.currentResults.items.length <= 0) {
                this.setTextboxValue('');
                // this.refreshOptions();
            }
        };
    })();
});