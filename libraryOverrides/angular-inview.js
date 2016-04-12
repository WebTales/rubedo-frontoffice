
(function() {
    'use strict';
    var _containersControllers, _windowEventsHandlerBinded, _windowInViewItems, addWindowInViewItem, angularInviewModule, bindWindowEvents, checkInView, debounce, getBoundingClientRect, getOffsetFromPercentage, getViewportHeight, offsetIsPercentage, removeWindowInViewItem, trackInViewContainer, triggerInViewCallback, unbindWindowEvents, untrackInViewContainer, windowCheckInView, windowEventsHandler,
        slice = [].slice;

    angularInviewModule = angular.module('angular-inview', []).directive('inView', [
        '$parse', function($parse) {
            return {
                restrict: 'A',
                require: '?^inViewContainer',
                link: function(scope, element, attrs, containerController) {
                    var inViewFunc, item, options, performCheck, ref, ref1;
                    if (!attrs.inView) {
                        return;
                    }
                    inViewFunc = $parse(attrs.inView);
                    item = {
                        element: element,
                        wasInView: false,
                        offset: 0,
                        customDebouncedCheck: null,
                        callback: function($event, $inview, $inviewpart) {
                            if ($event == null) {
                                $event = {};
                            }
                            return scope.$evalAsync((function(_this) {
                                return function() {
                                    $event.inViewTarget = element[0];
                                    return inViewFunc(scope, {
                                        '$event': $event,
                                        '$inview': $inview,
                                        '$inviewpart': $inviewpart
                                    });
                                };
                            })(this));
                        }
                    };
                    if ((attrs.inViewOptions != null) && (options = scope.$eval(attrs.inViewOptions))) {
                        item.offset = options.offset || [options.offsetTop || 0, options.offsetBottom || 0];
                        if (options.debounce) {
                            item.customDebouncedCheck = debounce((function(event) {
                                return checkInView([item], element[0], event);
                            }), options.debounce);
                        }
                    }
                    performCheck = (ref = (ref1 = item.customDebouncedCheck) != null ? ref1 : containerController != null ? containerController.checkInView : void 0) != null ? ref : windowCheckInView;
                    if (containerController != null) {
                        containerController.addItem(item);
                    } else {
                        addWindowInViewItem(item);
                    }
                    setTimeout(performCheck);
                    return scope.$on('$destroy', function() {
                        if (containerController != null) {
                            containerController.removeItem(item);
                        }
                        return removeWindowInViewItem(item);
                    });
                }
            };
        }
    ]).directive('inViewContainer', function() {
        return {
            restrict: 'AC',
            controller: [
                '$element', function($element) {
                    this.items = [];
                    this.addItem = function(item) {
                        return this.items.push(item);
                    };
                    this.removeItem = function(item) {
                        var i;
                        return this.items = (function() {
                            var j, len, ref, results;
                            ref = this.items;
                            results = [];
                            for (j = 0, len = ref.length; j < len; j++) {
                                i = ref[j];
                                if (i !== item) {
                                    results.push(i);
                                }
                            }
                            return results;
                        }).call(this);
                    };
                    this.checkInView = (function(_this) {
                        return function(event) {
                            var i, j, len, ref;
                            ref = _this.items;
                            for (j = 0, len = ref.length; j < len; j++) {
                                i = ref[j];
                                if (i.customDebouncedCheck != null) {
                                    i.customDebouncedCheck();
                                }
                            }
                            return checkInView((function() {
                                var k, len1, ref1, results;
                                ref1 = this.items;
                                results = [];
                                for (k = 0, len1 = ref1.length; k < len1; k++) {
                                    i = ref1[k];
                                    if (i.customDebouncedCheck == null) {
                                        results.push(i);
                                    }
                                }
                                return results;
                            }).call(_this), $element[0], event);
                        };
                    })(this);
                    return this;
                }
            ],
            link: function(scope, element, attrs, controller) {
                element.bind('scroll', controller.checkInView);
                trackInViewContainer(controller);
                return scope.$on('$destroy', function() {
                    element.unbind('scroll', controller.checkInView);
                    return untrackInViewContainer(controller);
                });
            }
        };
    });

    _windowInViewItems = [];

    addWindowInViewItem = function(item) {
        _windowInViewItems.push(item);
        return bindWindowEvents();
    };

    removeWindowInViewItem = function(item) {
        var i;
        _windowInViewItems = (function() {
            var j, len, results;
            results = [];
            for (j = 0, len = _windowInViewItems.length; j < len; j++) {
                i = _windowInViewItems[j];
                if (i !== item) {
                    results.push(i);
                }
            }
            return results;
        })();
        return unbindWindowEvents();
    };

    _containersControllers = [];

    trackInViewContainer = function(controller) {
        _containersControllers.push(controller);
        return bindWindowEvents();
    };

    untrackInViewContainer = function(container) {
        var c;
        _containersControllers = (function() {
            var j, len, results;
            results = [];
            for (j = 0, len = _containersControllers.length; j < len; j++) {
                c = _containersControllers[j];
                if (c !== container) {
                    results.push(c);
                }
            }
            return results;
        })();
        return unbindWindowEvents();
    };

    _windowEventsHandlerBinded = false;

    windowEventsHandler = function(event) {
        var c, j, len;
        for (j = 0, len = _containersControllers.length; j < len; j++) {
            c = _containersControllers[j];
            c.checkInView(event);
        }
        if (_windowInViewItems.length) {
            return windowCheckInView(event);
        }
    };

    bindWindowEvents = function() {
        if (_windowEventsHandlerBinded) {
            return;
        }
        _windowEventsHandlerBinded = true;
        return angular.element(window).bind('checkInView click ready wheel mousewheel DomMouseScroll MozMousePixelScroll resize scroll touchmove mouseup', windowEventsHandler);
    };

    unbindWindowEvents = function() {
        if (!_windowEventsHandlerBinded) {
            return;
        }
        if (_windowInViewItems.length || _containersControllers.length) {
            return;
        }
        _windowEventsHandlerBinded = false;
        return angular.element(window).unbind('checkInView click ready wheel mousewheel DomMouseScroll MozMousePixelScroll resize scroll touchmove mouseup', windowEventsHandler);
    };

    triggerInViewCallback = function(event, item, inview, isTopVisible, isBottomVisible) {
        var elOffsetTop, inviewpart;
        if (inview) {
            elOffsetTop = getBoundingClientRect(item.element[0]).top + window.pageYOffset;
            inviewpart = (isTopVisible && isBottomVisible && 'neither') || (isTopVisible && 'top') || (isBottomVisible && 'bottom') || 'both';
            if (!(item.wasInView && item.wasInView === inviewpart && elOffsetTop === item.lastOffsetTop)) {
                item.lastOffsetTop = elOffsetTop;
                item.wasInView = inviewpart;
                return item.callback(event, true, inviewpart);
            }
        } else if (item.wasInView) {
            item.wasInView = false;
            return item.callback(event, false);
        }
    };

    checkInView = function(items, container, event) {
        var bounds, boundsBottom, boundsTop, element, item, j, k, len, len1, ref, ref1, ref2, ref3, results, viewport;
        viewport = {
            top: 0,
            bottom: getViewportHeight()
        };
        if (container && container !== window) {
            bounds = getBoundingClientRect(container);
            if (bounds.top > viewport.bottom || bounds.bottom < viewport.top) {
                for (j = 0, len = items.length; j < len; j++) {
                    item = items[j];
                    triggerInViewCallback(event, item, false);
                }
                return;
            }
            if (bounds.top > viewport.top) {
                viewport.top = bounds.top;
            }
            if (bounds.bottom < viewport.bottom) {
                viewport.bottom = bounds.bottom;
            }
        }
        results = [];
        for (k = 0, len1 = items.length; k < len1; k++) {
            item = items[k];
            element = item.element[0];
            bounds = getBoundingClientRect(element);
            boundsTop = bounds.top + (offsetIsPercentage(item.offset) ? getOffsetFromPercentage(bounds, item.offset) : parseInt((ref = (ref1 = item.offset) != null ? ref1[0] : void 0) != null ? ref : item.offset));
            boundsBottom = bounds.bottom + (offsetIsPercentage(item.offset) ? getOffsetFromPercentage(bounds, item.offset) : parseInt((ref2 = (ref3 = item.offset) != null ? ref3[1] : void 0) != null ? ref2 : item.offset));
            if (boundsTop < viewport.bottom && boundsBottom >= viewport.top) {
                results.push(triggerInViewCallback(event, item, true, boundsBottom > viewport.bottom, boundsTop < viewport.top));
            } else {
                results.push(triggerInViewCallback(event, item, false));
            }
        }
        return results;
    };

    offsetIsPercentage = function(offset) {
        return typeof offset === 'string' && offset.slice(-1) === '%';
    };

    getOffsetFromPercentage = function(bounds, offsetPercentage) {
        var percentage;
        percentage = offsetPercentage.substring(0, offsetPercentage.length - 1);
        return (bounds.bottom - bounds.top) * (percentage / 100);
    };

    getViewportHeight = function() {
        var height, mode, ref;
        height = window.innerHeight;
        if (height) {
            return height;
        }
        mode = document.compatMode;
        if (mode || !(typeof $ !== "undefined" && $ !== null ? (ref = $.support) != null ? ref.boxModel : void 0 : void 0)) {
            height = mode === 'CSS1Compat' ? document.documentElement.clientHeight : document.body.clientHeight;
        }
        return height;
    };

    getBoundingClientRect = function(element) {
        var el, parent, top;
        if (element.getBoundingClientRect != null) {
            return element.getBoundingClientRect();
        }
        top = 0;
        el = element;
        while (el) {
            top += el.offsetTop;
            el = el.offsetParent;
        }
        parent = element.parentElement;
        while (parent) {
            if (parent.scrollTop != null) {
                top -= parent.scrollTop;
            }
            parent = parent.parentElement;
        }
        return {
            top: top,
            bottom: top + element.offsetHeight
        };
    };

    debounce = function(f, t) {
        var timer;
        timer = null;
        return function() {
            var args;
            args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
            if (timer != null) {
                clearTimeout(timer);
            }
            return timer = setTimeout((function() {
                return f.apply(null, args);
            }), t != null ? t : 100);
        };
    };

    windowCheckInView = function(event) {
        var i, j, len;
        for (j = 0, len = _windowInViewItems.length; j < len; j++) {
            i = _windowInViewItems[j];
            if (i.customDebouncedCheck != null) {
                i.customDebouncedCheck();
            }
        }
        return checkInView((function() {
            var k, len1, results;
            results = [];
            for (k = 0, len1 = _windowInViewItems.length; k < len1; k++) {
                i = _windowInViewItems[k];
                if (i.customDebouncedCheck == null) {
                    results.push(i);
                }
            }
            return results;
        })(), null, event);
    };

    if (typeof define === 'function' && define.amd) {
        define(['angular'], angularInviewModule);
    } else if (typeof module !== 'undefined' && module && module.exports) {
        module.exports = angularInviewModule;
    }

}).call(this);
