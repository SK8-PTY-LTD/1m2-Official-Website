/*!
 * Start Bootstrap - Agnecy Bootstrap Theme (http://startbootstrap.com)
 * Code licensed under the Apache License v2.0.
 * For details, see http://www.apache.org/licenses/LICENSE-2.0.
 */

// jQuery for page scrolling feature - requires jQuery Easing plugin
$(function() {
    $('a.page-scroll').bind('click', function(event) {
        var $anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: $($anchor.attr('href')).offset().top
        }, 1500, 'easeInOutExpo');
        event.preventDefault();
    });
});

// Highlight the top nav as scrolling occurs
$('body').scrollspy({
    target: '.navbar-fixed-top'
})

// Closes the Responsive Menu on Menu Item Click
$('.navbar-collapse ul li a').click(function() {
    $('.navbar-toggle:visible').click();
});


$( document ).ready(function() {
  var __extends = this.__extends || function (d, b) {
      for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
      function __() { this.constructor = d; }
      __.prototype = b.prototype;
      d.prototype = new __();
  };

  var EventDispatcher = (function () {
      function EventDispatcher(target) {
          if (target === void 0) { target = null; }
          this._target = target || this;
          this._events = {};
      }

      EventDispatcher.prototype.dispatchEvent = function (event) {
          if (this._events) {
              event.target = this._target;
              // reset events properties, so events can be reused
              event._stopImmediatePropagation = false;
              event._isDefaultPrevented = false;
              if (this._events[event.type]) {
                  // create a queue for the handlers, so we know that it can't be manipulated during the loop
                  var listeners = [];
                  var events = this._events[event.type];
                  for (var i = 0, l = events.length; i < l; ++i) {
                      listeners.push(events[i].listener);
                      if (events[i].once) {
                          events[i].destruct();
                          i--;
                          l--;
                      }
                  }
                  for (var i = 0, l = listeners.length; i < l; ++i) {
                      listeners[i].call(this._target, event);
                      if (event._stopImmediatePropagation) {
                          break;
                      }
                  }
                  return !event._isDefaultPrevented;
              }
              else if (DEBUG) {
                  //console.warn('trying to dispatch event that has no listeners "' + event.type + '"');
                  return false;
              }
          }
      };

      EventDispatcher.prototype.dispatch = function (type, data) {
          if (this.hasEventListener(type)) {
              return this.dispatchEvent(data === void 0 ? new BaseEvent(type) : new DataEvent(type, data));
          }
          return false;
      };

      EventDispatcher.prototype.addEventListener = function (type, listener, priority, once) {
          if (priority === void 0) { priority = 0; }
          if (once === void 0) { once = false; }
          if (!(type in this._events) || typeof (this._events[type]) === 'undefined') {
              this._events[type] = [];
          }
          for (var i = 0, l = this._events[type].length; i < l; ++i) {
              if (this._events[type][i].listener === listener) {
                  // double
                  if (DEBUG) {
                      console.warn("Trying to add double listener");
                  }
                  return this._events[type][i];
              }
          }
          var data = new EventListenerData(this, type, listener, priority, once);
          this._events[type].push(data);
          this._events[type].sort(this.sort);
          return data;
      };

      EventDispatcher.prototype.hasEventListener = function (type) {
          return this._events && this._events[type] && this._events[type].length > 0;
      };

      EventDispatcher.prototype.removeEventListener = function (type, listener) {
          if (this._events) {
              if ((type in this._events) && (this._events[type] instanceof Array)) {
                  for (var i = 0, l = this._events[type].length; i < l; ++i) {
                      if (this._events[type][i].listener === listener) {
                          this._events[type][i].dispatcher = null;
                          this._events[type][i].destruct();
                          this._events[type].splice(i, 1);
                          return;
                      }
                  }
              }
              else if (DEBUG) {
              }
          }
      };

      EventDispatcher.prototype.removeAllEventListeners = function (type) {
          if (this._events) {
              if (typeof type == 'undefined') {
                  for (type in this._events) {
                      if (this._events[type] instanceof Array) {
                          while (this._events[type].length) {
                              var data = this._events[type].shift();
                              data.dispatcher = null;
                              data.destruct();
                          }
                      }
                  }
              }
              else if ((type in this._events) && (this._events[type] instanceof Array)) {
                  while (this._events[type].length) {
                      var data = this._events[type].shift();
                      data.dispatcher = null;
                      data.destruct();
                  }
              }
              else if (DEBUG) {
              }
          }
      };
      EventDispatcher.prototype.sort = function (e1, e2) {
          return e2.priority - e1.priority;
      }
      EventDispatcher.prototype.destruct = function () {
          this.removeAllEventListeners();
          this._target = null;
          this._events = null;
          _super.prototype.destruct.call(this);
      };
      return EventDispatcher;
  })();


  var DragControlController = (function () {
      __extends(DragControlController, EventDispatcher);
      function DragControlController(element) {
          this.element = element;
          this.options = {vertical: false};
      }
      /**
       *	After calling super.init, your pages DOM is ready
       */
      DragControlController.prototype.init = function () {
          this.$knob = $('.drag-knob', this.element);
          this.$knobArrow = this.$knob.find('.arrow');
          this.$bounds = $('.drag-bounds', this.element);
          this.$line = $('.line', this.element);
          this._dragInstance = Draggable.create(this.$knob[0], {
              bounds: this.$bounds[0],
              type: this.options.vertical ? 'y' : 'x',
              zIndexBoost: false,
              onPress: this.handlePress.bind(this),
              onRelease: this.handleRelease.bind(this),
              onDrag: this.handleDrag.bind(this)
          })[0];
          this._loadIconInterval = setInterval(this.loadIcons.bind(this), 100);
          this.loadIcons();
      };
      DragControlController.prototype.loadIcons = function () {
          if (grunticon && grunticon.svgLoadedCallback && $(this.element).find('.drag-knob .icon')[0]) {
              clearInterval(this._loadIconInterval);
              grunticon.svgLoadedCallback();
          }
      };
      DragControlController.prototype.setMainPosition = function (x, y) {
          TweenLite.set(this.element, { x: x, y: y });
      };
      DragControlController.prototype.getDragPosition = function () {
          return this.options.vertical ? this._dragInstance.y : this._dragInstance.x;
      };
      DragControlController.prototype.getDragMax = function () {
          return this.options.vertical ? this._dragInstance.maxY : this._dragInstance.maxX;
      };
      DragControlController.prototype.handleDrag = function () {
          var dragPosition = this.getDragPosition();
          var dragMax = this.getDragMax();
          this.$line[0].style[this.options.vertical ? 'top' : 'left'] = dragPosition + 'px';
          var dragProgress = dragPosition / dragMax;
          if (dragPosition == dragMax) {
              $(this.element).addClass('is-dragged-full');
          }
          else {
              $(this.element).removeClass('is-dragged-full');
          }
          TweenLite.set(this.$knobArrow, { opacity: (1 - Math.max(0, dragProgress - 0.8) * 5) });
          this.dispatch(DragControlController.EVENT_UPDATE_DRAG, { progress: dragProgress });
      };
      DragControlController.prototype.handleRelease = function () {
          if (this.getDragMax() - this.getDragPosition() > DragControlController._DRAG_BOUNDS) {
              this.resetKnob();
          }
          else if (this.getDragMax() !== this.getDragPosition()) {
              this.completeKnob();
              window.location = this.element.parent().data("target");
          }
          else {
              $(this.element).addClass('is-dragged-complete');
              this.dispatch(DragControlController.EVENT_COMPLETE_DRAG);
              window.location = this.element.parent().data("target");
          }
          this.$knob.removeClass('is-dragging');
      };
      DragControlController.prototype.handlePress = function () {
          $(this.element).removeClass('is-dragged-complete');
          this.$knob.addClass('is-dragging');
          this.dispatch(DragControlController.EVENT_PRESS);
      };
      DragControlController.prototype.completeKnob = function () {
          var _this = this;
          var maxDrag = this.getDragMax();
          var diff = maxDrag - this.getDragPosition();
          var duration = 0.5 * (diff / DragControlController._DRAG_BOUNDS);
          var counter = { x: this.getDragPosition() };
          var lineProps = { ease: Power3.easeOut };
          var knobProps = { ease: Power3.easeOut };
          if (this.options.vertical) {
              lineProps.top = maxDrag;
              knobProps.y = maxDrag;
          }
          else {
              lineProps.left = maxDrag;
              knobProps.x = maxDrag;
          }
          TweenLite.to(counter, duration, {
              x: maxDrag,
              ease: Linear.easeNone,
              roundProps: 'x',
              onStart: function () {
                  $(_this.element).addClass('is-dragged-full');
              },
              onUpdate: function () {
                  _this.dispatch(DragControlController.EVENT_UPDATE_DRAG, { progress: counter.x / _this.getDragMax() });
              },
              onComplete: function () {
                  $(_this.element).addClass('is-dragged-complete');
                  _this.dispatch(DragControlController.EVENT_COMPLETE_DRAG);
              }
          });
          TweenLite.to(this.$line, duration, lineProps);
          TweenLite.to(this.$knob, duration, knobProps);
          TweenLite.set(this.$knobArrow, { opacity: 0 });
      };
      DragControlController.prototype.resetKnob = function () {
          var _this = this;
          var duration = 0.8 * (this.getDragPosition() / this.getDragMax());
          var counter = { x: this.getDragPosition() };
          var lineProps = { ease: Power3.easeOut };
          var knobProps = { ease: Power3.easeOut };
          if (this.options.vertical) {
              lineProps.top = 0;
              knobProps.y = 0;
          }
          else {
              lineProps.left = 0;
              knobProps.x = 0;
          }
          TweenLite.to(counter, duration, {
              x: 0,
              ease: Linear.easeNone,
              roundProps: 'x',
              onUpdate: function () {
                  _this.dispatch(DragControlController.EVENT_UPDATE_DRAG, { progress: counter.x / _this.getDragMax() });
              }
          });
          TweenLite.to(this.$line, duration, lineProps);
          TweenLite.to(this.$knob, duration, knobProps);
          TweenLite.set(this.$knobArrow, { opacity: 1 });
      };
      DragControlController.prototype.resetState = function () {
          TweenLite.set(this.$line, { top: 0, left: 0 });
          TweenLite.set(this.$knob, { x: 0, y: 0 });
          TweenLite.set(this.$knobArrow, { opacity: 1 });
          $(this.element).removeClass('is-dragged-full is-dragged-complete');
          this.dispatch(DragControlController.EVENT_UPDATE_DRAG, { progress: 0 });
      };
      DragControlController.prototype.destruct = function () {
          if (this._dragInstance) {
              this._dragInstance.kill();
              this._dragInstance = null;
          }
          clearInterval(this._loadIconInterval);
          this.$knob.off();
          _super.prototype.destruct.call(this);
      };
      DragControlController.EVENT_PRESS = 'press_drag';
      DragControlController.EVENT_UPDATE_DRAG = 'update_drag';
      DragControlController.EVENT_COMPLETE_DRAG = 'complete_drag';
      DragControlController._DRAG_BOUNDS = 30;
      return DragControlController;
  })();

  var grunticon = false;

  var dragKnotTemplate = "&lt;div class=&quot;component-drag-control&quot;&gt; &lt;div class=&quot;drag-bounds&quot;&gt; &lt;div class=&quot;drag-end&quot;&gt;&lt;span class=&quot;dotted-border icon-round-border-dotted&quot;&gt;&lt;svg xmlns=&quot;http://www.w3.org/2000/svg&quot; width=&quot;50&quot; height=&quot;50&quot; viewBox=&quot;0 0 50 50&quot;&gt;&lt;path d=&quot;M49.4 24.5c-.3 0-.5.2-.5.5s.2.5.5.5.6-.2.6-.5-.3-.5-.6-.5zM49.2 28.8c-.3-.1-.6.1-.6.4-.1.3.1.5.4.6.3.1.5-.1.6-.4.1-.3-.1-.6-.4-.6zM48.5 32.1c-.3-.1-.6 0-.7.3-.1.3 0 .6.3.7.3.1.6-.1.7-.3.1-.3 0-.6-.3-.7zM47.3 35.3c-.3-.2-.6-.1-.7.2-.2.3-.1.6.2.7.2.1.5 0 .8-.2.1-.3 0-.5-.3-.7zM44.9 38.4c-.2.2-.1.5.1.7.2.1.6.1.8-.1.1-.2 0-.5-.2-.7-.2-.2-.5-.1-.7.1zM42.9 41c-.2.2-.2.5 0 .7.2.2.5.2.7.1.2-.3.2-.6 0-.8-.2-.2-.5-.2-.7 0zM40.5 43.3c-.3.1-.3.5-.1.7.2.2.5.2.7.2.3-.2.3-.6.1-.8-.2-.3-.5-.3-.7-.1zM37.9 45.2c-.3.1-.4.5-.2.7.1.3.4.4.7.2.3-.1.4-.5.2-.7-.1-.3-.5-.4-.7-.2zM35 46.8c-.3.1-.4.4-.3.7.1.3.4.4.7.3.3-.1.4-.4.3-.7-.1-.3-.4-.4-.7-.3zM31.9 48c-.3 0-.5.3-.4.6.1.3.4.4.7.4.3-.1.5-.4.4-.7-.1-.2-.4-.4-.7-.3zM28.6 48.7c-.2 0-.4.3-.4.6s.3.5.6.4c.3 0 .5-.3.4-.6-.1-.3-.3-.4-.6-.4zM25.4 48.9c-.2 0-.3.1-.4.2-.1.1-.2.3-.2.4s.1.3.2.3.3.1.4.1c.3 0 .5-.2.5-.5s-.2-.5-.5-.5zM22 48.7c-.3 0-.6.2-.6.5s.2.6.5.6.6-.2.6-.5-.2-.6-.5-.6zM18.7 48.1c-.2 0-.5.1-.6.4 0 .3.1.6.4.6.2.1.5-.1.6-.4 0-.2-.1-.5-.4-.6zM15.7 47c-.3-.1-.6 0-.7.3s0 .6.3.7c.3.1.6 0 .7-.3s0-.6-.3-.7zM12.7 45.6c-.2-.1-.5 0-.7.2s-.1.5.2.7c.2.1.6.1.7-.2.1-.2 0-.6-.2-.7zM9.3 43.8c-.2.2-.2.5.1.7.2.2.5.1.7-.1.2-.2.1-.5-.1-.7s-.5-.1-.7.1zM6.8 41.4c-.2.2-.2.6-.1.7.3.2.6.2.8 0 .2-.2.2-.5 0-.7-.2-.2-.5-.2-.7 0zM4.7 38.8c-.2.2-.3.5-.1.7.1.2.5.3.7.1.2-.1.3-.5.1-.7-.1-.2-.5-.3-.7-.1zM3 35.9c-.2.1-.3.4-.2.7.1.2.4.3.7.2.2-.1.3-.5.2-.7-.1-.2-.4-.3-.7-.2zM1.8 32.8c-.3.1-.5.4-.3.7.1.3.4.4.7.3.3-.1.4-.4.3-.7-.1-.2-.4-.4-.7-.3zM1.5 29.9c0-.3-.3-.5-.6-.4-.3.1-.5.3-.4.6 0 .3.3.5.6.4.3 0 .5-.3.4-.6zM1.1 26.7c-.1-.3-.3-.5-.6-.5s-.5.2-.5.5.3.7.6.6c.3-.1.5-.3.5-.6zM.5 23.9c.3 0 .6-.2.6-.5s-.2-.6-.5-.6-.6.2-.6.5.2.6.5.6zM.9 20.4c.3.1.5-.1.6-.4s-.1-.5-.4-.6c-.3 0-.5.2-.6.4-.1.3.1.5.4.6zM1.7 17.2c.3.1.6 0 .7-.3.1-.3 0-.6-.3-.7-.3-.1-.6.1-.7.3-.1.3 0 .6.3.7zM3.5 13.2c-.2-.2-.5-.1-.7.2-.2.2-.1.5.2.7.3.2.6.1.7-.2.2-.2.1-.6-.2-.7zM4.7 10.4c-.2.2-.1.5.1.7.2.2.5.1.7-.1s.1-.5-.1-.7c-.3-.1-.6-.1-.7.1zM6.8 7.8c-.2.2-.2.5.1.7.2.2.5.2.7 0 .2-.2.2-.5 0-.7-.2-.2-.6-.2-.8 0zM9.4 5.5c-.3.1-.3.5-.1.7.2.2.5.3.7 0 .2-.1.3-.5.1-.7-.2-.2-.5-.2-.7 0zM12.2 3.5c-.3.1-.3.4-.2.7.1.3.5.4.7.2.3-.1.3-.4.2-.7-.1-.3-.4-.4-.7-.2zM15.3 1.9c-.3.1-.4.4-.3.7.1.3.4.4.7.3.3-.1.4-.4.3-.7-.1-.2-.5-.4-.7-.3zM18.6.7c-.3.1-.5.4-.4.7 0 .3.3.5.6.4.3 0 .5-.3.4-.6-.1-.3-.4-.4-.6-.5zM21.9.1c-.3 0-.5.3-.5.6.1.3.3.5.6.5.3-.1.5-.3.5-.6 0-.2-.3-.5-.6-.5zM25.4 0c-.2 0-.3.1-.4 0-.1.1-.2.3-.2.4 0 .2.1.3.2.4.1.1.3.2.4.2.2 0 .5-.2.5-.5 0-.2-.2-.5-.5-.5zM28.8.2c-.3 0-.6.2-.6.5-.1.3.1.6.4.6.3.1.5-.1.6-.4.1-.3-.1-.6-.4-.7zM31.8 2c.3.1.6 0 .7-.3.1-.3-.1-.6-.3-.7-.3 0-.6.1-.8.4 0 .2.1.5.4.6zM34.9 3.3c.3.1.6 0 .7-.3.2-.3.1-.6-.3-.7-.3-.1-.6 0-.7.3-.1.3 0 .6.3.7zM37.9 4.8c.2.1.5 0 .7-.2.1-.2.1-.5-.2-.7-.2-.1-.5 0-.7.2-.1.2 0 .6.2.7zM40.4 6.1c-.1.2-.1.5.1.7.2.1.5.1.7-.1.2-.2.2-.5 0-.7-.3-.2-.7-.1-.8.1zM42.9 8.4c-.2.2-.2.5 0 .7.1.2.5.2.7 0 .2-.2.2-.5.1-.7-.2-.2-.6-.2-.8 0zM45.6 11.8c.2-.1.3-.5.1-.8-.1-.2-.5-.3-.7-.1-.2.1-.3.5-.1.7.1.3.5.4.7.2zM47.2 14.8c.3-.1.4-.5.2-.7-.1-.2-.4-.3-.7-.2-.2.1-.3.4-.2.7.1.2.4.3.7.2zM48.4 17.9c.3 0 .5-.3.3-.7-.1-.2-.5-.4-.7-.3s-.4.4-.3.7c.1.2.4.4.7.3zM48.6 20.8c0 .3.3.4.6.4.2 0 .4-.3.4-.6s-.3-.5-.6-.4c-.3 0-.5.3-.4.6z&quot;&gt;&lt;/path&gt;&lt;/svg&gt;&lt;/span&gt;&lt;/div&gt; &lt;span class=&quot;line&quot; style=&quot;left: 0px;&quot;&gt;&lt;/span&gt; &lt;div class=&quot;drag-knob spacer-background&quot; style=&quot;transform: translate3d(0px, 0px, 0px); cursor: move; -webkit-user-select: none; touch-action: none;&quot;&gt; &lt;span class=&quot;spacer-background dashed-border icon-round-border-dashed&quot;&gt;&lt;svg xmlns=&quot;http://www.w3.org/2000/svg&quot; width=&quot;50&quot; height=&quot;50&quot; viewBox=&quot;0 0 50 50&quot;&gt;&lt;path d=&quot;M25 50h-.1c-.1 0-.2-.1-.2-.2s.1-.2.2-.2h.1c.5 0 1.1 0 1.6-.1.1 0 .2.1.2.2s-.1.2-.2.2c-.5.1-1.1.1-1.6.1zm-1.5 0c-.6 0-1.2-.1-1.8-.2-.1 0-.2-.1-.2-.2s.1-.2.2-.2c.6.1 1.2.1 1.7.2.1 0 .2.1.2.2.1.1 0 .2-.1.2zm4.5-.2c-.1 0-.2-.1-.2-.2s.1-.2.2-.2c.6-.1 1.2-.2 1.7-.3.1 0 .2.1.2.2s-.1.2-.2.2c-.5.2-1.1.3-1.7.3zm-7.6-.2c-.6-.1-1.2-.2-1.8-.4-.1 0-.2-.1-.1-.2s.1-.2.2-.1c.6.1 1.1.3 1.7.4.1 0 .2.1.2.2 0 0-.1.1-.2.1zm10.6-.3c-.1 0-.2-.1-.2-.2s0-.2.1-.2c.6-.1 1.1-.3 1.7-.5.1 0 .2 0 .3.1s0 .2-.1.3c-.6.2-1.2.3-1.8.5.1 0 0 0 0 0zm-13.6-.5c-.6-.2-1.2-.4-1.7-.6-.1 0-.2-.2-.1-.3 0-.1.2-.2.3-.1.5.2 1.1.4 1.6.6.1 0 .2.1.1.3 0 .1-.1.1-.2.1zm16.6-.5c-.1 0-.2 0-.2-.1s0-.2.1-.3c.5-.2 1.1-.4 1.6-.7.1 0 .2 0 .3.1 0 .1 0 .2-.1.3-.5.3-1.1.5-1.7.7zm-19.5-.6c-.6-.3-1.2-.5-1.7-.8-.1-.1-.1-.2-.1-.3.1-.1.2-.1.3-.1.5.3 1 .5 1.6.8.1 0 .1.2.1.3 0 0-.1.1-.2.1zm22.3-.7c-.1 0-.1 0-.2-.1s0-.2.1-.3l1.5-.9c.1-.1.2 0 .3.1.1.1 0 .2-.1.3-.5.3-1 .6-1.6.9.1 0 0 0 0 0zm-25-.8h-.1c-.5-.3-1-.7-1.5-1-.1-.1-.1-.2 0-.3.1-.1.2-.1.3 0 .5.3 1 .7 1.4 1 .1 0 .1.1.1.2-.1.1-.2.1-.2.1zm27.6-.8c-.1 0-.1 0-.2-.1s0-.2 0-.3c.5-.3.9-.7 1.4-1.1.1-.1.2-.1.3 0 .1.1.1.2 0 .3-.5.4-.9.7-1.4 1.1 0 .1 0 .1-.1.1zm-30.1-1h-.1c-.5-.4-.9-.8-1.3-1.2-.1-.1-.1-.2 0-.3s.2-.1.3 0c.4.4.9.8 1.3 1.2.1.1.1.2 0 .3-.1-.1-.2 0-.2 0zm32.5-1c-.1 0-.1 0-.1-.1-.1-.1-.1-.2 0-.3l1.2-1.2c.1-.1.2-.1.3 0 .1.1.1.2 0 .3-.4.4-.8.9-1.3 1.2 0 .1 0 .1-.1.1zM7 42.2c-.1 0-.1 0-.1-.1-.4-.4-.8-.9-1.2-1.3-.1-.1-.1-.2 0-.3.1-.1.2-.1.3 0 .4.4.8.9 1.2 1.3.1.1.1.2 0 .3-.1.1-.2.1-.2.1zm37-1.1h-.1c-.1-.1-.1-.2 0-.3.4-.4.7-.9 1.1-1.4.1-.1.2-.1.3 0 .1.1.1.2 0 .3-.3.5-.7.9-1.1 1.4H44zM5 39.9c-.1 0-.1 0-.2-.1-.3-.5-.7-1-1-1.5-.1-.1 0-.2.1-.3.1 0 .2 0 .3.1.3.5.6 1 1 1.4.1.1 0 .2 0 .3-.1 0-.2.1-.2.1zm40.8-1.3h-.1c-.1-.1-.1-.2-.1-.3l.9-1.5c.1-.1.2-.1.3-.1.1.1.1.2.1.3l-.9 1.5c0 .1-.1.1-.2.1zM3.3 37.2c-.1 0-.1 0-.2-.1-.3-.5-.6-1-.8-1.6 0-.1 0-.2.1-.3.1 0 .2 0 .3.1.2.5.5 1 .8 1.6 0 .1 0 .3-.2.3.1 0 0 0 0 0zm44.1-1.3c-.1 0-.1 0 0 0-.2-.1-.2-.2-.2-.3.3-.5.5-1.1.7-1.6 0-.1.2-.2.3-.1.1 0 .2.2.1.3-.2.5-.5 1.1-.7 1.6-.1.1-.2.1-.2.1zM2 34.4c-.1 0-.2 0-.2-.1-.2-.5-.4-1.1-.6-1.7 0-.1 0-.2.1-.3.1 0 .2 0 .3.1.2.6.4 1.1.6 1.6 0 .3 0 .4-.2.4zM48.5 33c-.2 0-.2-.2-.2-.3.2-.5.3-1.1.5-1.7 0-.1.1-.2.2-.1.1 0 .2.1.1.2-.1.6-.3 1.1-.5 1.7.1.2 0 .2-.1.2zM1 31.5c-.1 0-.2-.1-.2-.2-.1-.6-.3-1.2-.4-1.7 0-.1.1-.2.2-.2s.2.1.2.2c.1.6.2 1.1.4 1.7 0 0 0 .1-.2.2zM49.3 30c-.1 0-.2-.1-.2-.2.1-.6.2-1.1.3-1.7 0-.1.1-.2.2-.2s.2.1.2.2l-.3 1.8c0 .1-.1.1-.2.1zM.4 28.4c-.1 0-.2-.1-.2-.2-.1-.6-.1-1.2-.2-1.8 0-.1.1-.2.2-.2s.2.1.2.2c0 .6.1 1.2.2 1.7 0 .2-.1.3-.2.3zM49.7 27c-.1 0-.2-.1-.2-.2 0-.6.1-1.2.1-1.7v-.2c0-.1.1-.2.2-.2s.2.1.2.2v.2c0 .6 0 1.2-.1 1.8 0 0-.1.1-.2.1zM.2 25.3c-.1 0-.2-.1-.2-.2V25c0-.5 0-1.1.1-1.6 0-.1.1-.2.2-.2s.2.1.2.2c0 .5-.1 1.1-.1 1.6v.1c0 .1-.1.2-.2.2zm49.5-1.7c-.1 0-.2-.1-.2-.2 0-.6-.1-1.2-.2-1.7 0-.1.1-.2.2-.2s.2.1.2.2c.1.6.1 1.2.2 1.8.1 0 0 .1-.2.1.1 0 .1 0 0 0zM.4 22.2c-.1 0-.2-.1-.2-.2l.3-1.8c0-.1.1-.2.2-.2s.2.1.2.2c-.1.6-.2 1.1-.3 1.7 0 .3-.1.3-.2.3zm49-1.7c-.1 0-.2-.1-.2-.2-.1-.6-.2-1.1-.4-1.7 0-.1 0-.2.1-.2s.2 0 .2.1c.2.6.3 1.1.4 1.7.1.2 0 .3-.1.3zM.9 19.2c-.2 0-.2-.1-.2-.3.1-.6.3-1.1.5-1.7 0-.1.1-.2.3-.1.1 0 .2.1.1.3-.2.6-.3 1.1-.5 1.7 0 0-.1.1-.2.1zm47.7-1.7c-.1 0-.2-.1-.2-.1-.2-.5-.4-1.1-.6-1.6 0-.1 0-.2.1-.3.1 0 .2 0 .3.1.2.5.4 1.1.6 1.7 0 0-.1.2-.2.2zM1.9 16.2s-.1 0 0 0c-.2-.1-.2-.2-.2-.3.2-.5.5-1.1.7-1.6 0-.1.2-.1.3-.1.1 0 .1.2.1.3-.2.5-.5 1.1-.7 1.6-.1.1-.1.1-.2.1zm45.5-1.6c-.1 0-.1 0-.2-.1-.2-.5-.5-1-.8-1.5-.1-.1 0-.2.1-.3.1-.1.2 0 .3.1.3.5.6 1 .8 1.6.1 0 0 .1-.2.2.1 0 .1 0 0 0zM3.2 13.4s-.1 0 0 0c-.2-.1-.2-.2-.2-.3l.9-1.5c.1-.1.2-.1.3-.1.1.1.1.2.1.3l-.9 1.5c-.1 0-.1.1-.2.1zm42.7-1.5c-.1 0-.1 0-.2-.1-.3-.5-.6-1-1-1.4-.1-.1 0-.2 0-.3.1-.1.2 0 .3 0 .3.5.7 1 1 1.5.1.1 0 .2-.1.3.1 0 .1 0 0 0zm-41-1.2h-.1c-.1-.1-.1-.2 0-.3.2-.5.6-.9 1-1.4 0-.1.2-.1.3 0 .1.1.1.2 0 .3-.4.4-.7.9-1.1 1.4h-.1zm39.2-1.3c-.1 0-.1 0-.2-.1-.4-.4-.8-.9-1.2-1.3-.1-.1-.1-.2 0-.3.1-.1.2-.1.3 0 .4.4.8.9 1.2 1.3.1.1.1.2 0 .3 0 .1-.1.1-.1.1zM6.8 8.3s-.1 0-.1-.1c-.1 0-.1-.1 0-.2.4-.4.8-.9 1.3-1.3.1-.1.2-.1.3 0 0 .1 0 .3-.1.3-.4.4-.8.8-1.2 1.3h-.2zM42 7.1s-.1 0-.1-.1c-.4-.4-.9-.8-1.3-1.1-.1-.1-.1-.2 0-.3.1-.1.2-.1.3 0 .5.4.9.8 1.3 1.2.1.1.1.2 0 .3H42zM9.1 6.2c-.1 0-.1 0-.2-.1s0-.2 0-.3c.5-.4.9-.7 1.4-1.1.1-.1.2 0 .3 0 .1.1 0 .2 0 .3-.5.3-.9.7-1.4 1.1 0 .1-.1.1-.1.1zm30.5-1.1h-.1c-.5-.3-1-.7-1.4-1-.1-.1-.1-.2-.1-.3.1-.1.2-.1.3-.1.5.3 1 .6 1.5 1 .1.1.1.2 0 .3-.1.1-.2.1-.2.1zm-28-.7c-.1 0-.1 0-.2-.1s0-.2.1-.3l1.5-.9c.1-.1.2 0 .3.1.1.1 0 .2-.1.3l-1.5.9c0-.1-.1 0-.1 0zm25.3-.9c-.6-.3-1.1-.6-1.7-.8-.1 0-.1-.2-.1-.3 0-.1.2-.1.3-.1.6.2 1.1.5 1.6.8.1.1.1.2.1.3 0 0-.1.1-.2.1zm-22.6-.7c-.1 0-.1 0-.2-.1 0-.1 0-.2.1-.3.5-.3 1.1-.5 1.6-.7.1 0 .2 0 .3.1 0 .1 0 .2-.1.3-.6.2-1.1.5-1.7.7zm19.8-.7c-.6-.2-1.2-.4-1.7-.6-.1 0-.2-.1-.1-.3 0-.1.1-.2.3-.1.6.2 1.1.4 1.7.6.1 0 .2.2.1.3-.1.1-.2.1-.3.1zm-16.9-.4c-.1 0-.2-.1-.2-.1 0-.1 0-.2.1-.3.6-.2 1.1-.4 1.7-.5.1 0 .2 0 .2.1s0 .2-.1.2c-.6.2-1.1.4-1.7.6zm14-.5s-.1 0 0 0C30.6 1 30 .9 29.4.8c-.1 0-.2-.1-.2-.2s.1-.2.2-.2c.6.1 1.2.2 1.7.4.1 0 .2.1.1.2.1.1.1.2 0 .2zm-11-.3c-.1 0-.2-.1-.2-.2s0-.2.2-.2L22 .2c.1 0 .2.1.2.2s-.2.2-.3.2c-.5.1-1.1.2-1.7.3zm7.9-.3c-.6-.1-1.2-.1-1.8-.2-.1 0-.2-.1-.2-.2s.2-.2.3-.2c.6 0 1.2.1 1.8.2.1 0 .2.1.2.2-.1.1-.2.2-.3.2zM23.3.5c-.1 0-.2-.1-.2-.2s.1-.2.2-.2C23.8 0 24.4 0 25 0c.1 0 .2.1.2.2s-.1.2-.2.2c-.6 0-1.2 0-1.7.1z&quot;&gt;&lt;/path&gt;&lt;/svg&gt;&lt;/span&gt; &lt;span class=&quot;centerer icon icon-glove-grab&quot;&gt;&lt;svg xmlns=&quot;http://www.w3.org/2000/svg&quot; width=&quot;50&quot; height=&quot;50&quot; viewBox=&quot;0 0 50 50&quot;&gt;&lt;g fill=&quot;#fff&quot;&gt;&lt;path d=&quot;M41.5 13.4v28.4c0 .1.1.1.2.1h.2c.9 0 1.6.3 2.2.9.3.3.6.6.7 1 .1.2.2.5.2.8v.6c.1.6-.2 1.1-.5 1.5-.4.6-.9 1.1-1.7 1.3-.4.1-.7.2-1.1.2-.1 0-.2 0-.2.2v.7c-.1.4-.2.7-.6.9H14.3c-.5 0-.8-.2-1-.6-.1-.1-.1-.3-.1-.4V36.1c0-.3-.1-.6-.2-.8-.5-.8-1-1.5-1.5-2.2-.3-.6-.8-1.1-1.1-1.7-.5-.9-1.1-1.6-1.6-2.5-.2-.5-.6-.9-.9-1.3-.4-.7-1-1.4-1.4-2.2-.1-.2-.3-.4-.4-.6-.4-.6-.7-1.2-.9-1.8-.1-.3-.1-.5-.2-.8 0-.5-.1-.9 0-1.4 0-.4.2-.8.3-1.2.3-.7.6-1.3 1-1.8.2-.3.5-.5.7-.7.4-.4.8-.6 1.3-.8.6-.2 1.1-.5 1.7-.5.2-.1.5-.1.7-.1.8 0 1.5.1 2.2.5.1 0 .2 0 .2-.1v-3c0-.6 0-1.2.1-1.7.2-.8.3-1.7.6-2.5.3-.7.5-1.4.9-2 .3-.5.6-1 1-1.5s.8-1 1.3-1.5l1.5-1.2c.7-.5 1.4-.9 2.2-1.3.5-.4.9-.5 1.3-.7l.9-.3c.3-.1.6-.1.9-.2.2-.1.4 0 .7-.1.5-.1 1.4-.1 2.9-.1 5.2 0 14.1 2.9 14.1 13.4zm-2.2 17.5V12.2c0-.4-.1-.9-.2-1.3-.1-.7-.3-1.3-.6-1.9-.3-.8-.7-1.5-1.1-2.1-.2-.3-.5-.6-.7-.9-.5-.7-1.1-1.3-1.8-1.7-3.5-2.4-7.5-2.2-7.7-2.2s-1.5.1-1.7.1c-.3 0-.5-.1-.8.1-.2.1-.5 0-.7.1-.8.1-1.5.4-2.2.7-1.2.6-2.3 1.3-3.3 2.3-.6.6-1.1 1.3-1.5 2-.4.6-.7 1.3-.9 2-.2.5-.4 1.1-.4 1.7-.2.2 0 .5-.1.8-.1.3-.1.6-.1.9v5.4c0 .4-.2.8-.6.9-.3.1-.5 0-.8.1-.1 0-.2-.1-.3-.1-.1-.1-.3-.2-.4-.3-.6-.7-1.5-.9-2.4-1-.3 0-.6 0-.8.1l-.9.3c-.4.2-.7.5-1 .8-.5.5-.8 1.2-.9 1.9-.1.7 0 1.5.4 2.2.3.6.7 1.1 1 1.6.2.3.5.7.8 1.2.5.9 1.1 1.7 1.6 2.5.3.6.8 1.1 1.1 1.6.4.8.9 1.4 1.3 2.1.4.8 1 1.5 1.5 2.3.2.3.3.7.3 1.1v11.9c0 .4 0 .4.4.4h23.3c.1 0 .2 0 .1-.1v-.4c.1-5.4.1-10.9.1-16.4zm2.6 14.2v.5c0 .1.2.2.3.1.3-.2.5-.4.5-.9-.1-.4-.2-.6-.5-.8-.1 0-.1 0-.1.1-.1.4-.1.7-.2 1zM27.3 45.2h-7.5c-.5 0-.7-.2-.9-.7l-.1-.2c.1-.1 0-.3.1-.4.1-.1.1-.2.2-.3.1-.1.2-.2.3-.2.2 0 .3-.1.5-.1h14.9c.2 0 .4.1.5.1.4.1.7 1 .3 1.4-.2.2-.4.3-.7.3-2.5.1-5.1.1-7.6.1z&quot;&gt;&lt;/path&gt;&lt;/g&gt;&lt;/svg&gt;&lt;/span&gt; &lt;span class=&quot;centerer icon icon-glove-grabbing&quot;&gt;&lt;svg xmlns=&quot;http://www.w3.org/2000/svg&quot; width=&quot;50&quot; height=&quot;50&quot; viewBox=&quot;0 0 50 50&quot;&gt;&lt;g fill=&quot;#fff&quot;&gt;&lt;path d=&quot;M44.9 44.5c0-.3-.1-.5-.2-.8-.1-.4-.4-.7-.7-1-.6-.6-1.3-1-2.2-.9h-.2c-.1 0-.2 0-.2-.1V19.3c0-1.8-.3-3.3-.8-4.6-.7-2-2-3.4-3.5-4.2-1.5-.9-3.2-1.2-4.8-1.2H18.9c-1.2 0-2.2.2-3 .6-1.2.5-2 1.5-2.3 2.4-.4.9-.5 1.7-.5 2.2v1.4c0 .1-.1.1-.2.1-.7-.4-1.4-.5-2.2-.5-.2 0-.5 0-.7.1-.6 0-1.2.2-1.7.5-.5.2-.9.5-1.3.8-.3.2-.5.5-.7.7-.5.5-.8 1.2-1 1.8-.1.4-.3.8-.3 1.2-.1.5 0 .9 0 1.4 0 .3.1.5.2.8.2.7.5 1.3.9 1.8.1.2.3.4.4.6.5.8 1 1.5 1.5 2.3.3.5.6.8.9 1.3.5.9 1.1 1.6 1.6 2.5.3.6.8 1.1 1.1 1.7.5.8 1 1.5 1.5 2.2.2.2.2.5.2.8V48.9c0 .1 0 .3.1.4.2.4.5.6 1 .6H40.8l.2-.1c.4-.2.5-.5.6-.9v-.7s.1-.2.2-.2c.4 0 .7-.1 1.1-.2.7-.2 1.3-.7 1.7-1.3.3-.5.5-.9.5-1.5-.2-.1-.2-.3-.2-.5zm-5.8 3.4H15.8c-.4 0-.4 0-.4-.4V35.6c0-.4-.1-.8-.3-1.1-.5-.8-1-1.5-1.5-2.3-.4-.7-1-1.4-1.4-2.1-.3-.6-.8-1.1-1.1-1.6-.5-.9-1.1-1.6-1.6-2.5-.2-.6-.5-1-.8-1.5-.3-.5-.7-1.1-1-1.6-.4-.7-.5-1.4-.4-2.2.1-.7.4-1.4.9-1.9.3-.3.6-.6 1-.8l.9-.3c.3-.1.6-.1.8-.1.9.1 1.7.3 2.4 1 .6.7 1.2.5 1.5.4.4-.2.6-.5.6-.9v-3.5c0-2 1.2-3.3 3.5-3.3h13.4s3.5.5 4.7 1.7c.6.6 1.1 1.4 1.5 2.4s.6 2.2.6 3.6v28.7c.2.2.1.2 0 .2zm3.1-2.1c-.1.1-.3 0-.3-.1v-.5c0-.3.1-.7.1-1 0-.1 0-.1.1-.1.4.2.5.4.5.8.2.5-.1.7-.4.9zM35.4 43.5c-.2-.1-.3-.1-.6-.1H19.9c-.2 0-.3.1-.5.1-.1 0-.2.1-.3.2-.1.1-.1.2-.2.3s0 .3-.1.4l.1.2c.1.5.4.7.9.7h15.1c.3 0 .5-.1.7-.3.5-.6.2-1.4-.2-1.5z&quot;&gt;&lt;/path&gt;&lt;/g&gt;&lt;/svg&gt;&lt;/span&gt; &lt;span class=&quot;arrow&quot; style=&quot;opacity: 1;&quot;&gt;&lt;/span&gt; &lt;/div&gt; &lt;/div&gt; &lt;/div&gt;";
  
  var decodedText = $("<div/>").html(dragKnotTemplate).text();
  $('#drag-knot').html(decodedText);

  var dragCC = new DragControlController($('.component-drag-control'));
  dragCC.init();

  //********************* footer ********************
  $(".share-facebook").on('click', function() {
    window.location = "https://www.facebook.com/1m2creative";
  });
  
  $(".button-mute").on('click', function() {
    if ($(this).hasClass("is-muted")) {
      $(this).removeClass("is-muted");
    } else {
      $(this).addClass("is-muted");
    }
  });
});
