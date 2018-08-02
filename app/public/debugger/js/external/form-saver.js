// The MIT License (MIT)

// Copyright (c) 2013 Yuri Krapivko

// Permission is hereby granted, free of charge, to any person obtaining a copy of
// this software and associated documentation files (the "Software"), to deal in
// the Software without restriction, including without limitation the rights to
// use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
// the Software, and to permit persons to whom the Software is furnished to do so,
// subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
// FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
// COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
// IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
// CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

(function ($) {
    function formsaver(method, container) {
        function getStorageId(container) {
            return 'formdata__$url__$extra'.replace('$url', location.pathname)
                                           .replace('$extra', container.attr('id') || '');
        }

        var storageId = getStorageId(container),
            controller = {
                save: function () {
                    this._save(storageId, this.extractValues());
                },
                restore: function () {
                    this.fillFields(this._load(storageId));
                },
                clear: function () {
                    this._remove(storageId);
                },

                extractValues: function () {
                    var formData = container.find(":input[name]").serializeArray(),
                        preparedData = {};
                    $.each(formData, function (index, element) {
                        var name = element.name,
                            value = encodeURIComponent(element.value);
                        if (preparedData[name]) {
                            preparedData[name] = preparedData[name] instanceof Array ?
                                                 preparedData[name].concat(value) :
                                                 [preparedData[name], value];
                        } else {
                            preparedData[name] = value;
                        }
                    });
                    return preparedData;
                },
                fillFields: function (formData) {
                    $.each(formData, function (name, value) {
                        var field = container.find("[name=" + name + "]"),
                            inputType = field.prop('type');
                        value = value instanceof Array ? value.map(decodeURIComponent) :
                                                         decodeURIComponent(value);
                        if (inputType === 'checkbox') {
                            field.prop('checked', value === 'on');
                        } else if (inputType === 'radio') {
                            field.filter("[value=" + value + "]").prop('checked', true);
                        } else {
                            field.val(value);
                        }
                    });
                },

                _save: function (storageId, data) {
                    localStorage[storageId] = JSON.stringify(data);
                },
                _load: function (storageId) {
                    return localStorage[storageId] ? JSON.parse(localStorage[storageId]) : {};
                },
                _remove: function (storageId) {
                    localStorage.removeItem(storageId);
                }
            },
            methodsQueue = method instanceof Array ? method : [method];

        $.each(methodsQueue, function (index, method) {
            controller[method]();
        });
    }
    $.fn.saveForm = function () {
        formsaver('save', $(this));
    };
    $.fn.restoreForm = function () {
        formsaver(['restore', 'clear'], $(this));
    };
})(jQuery);
