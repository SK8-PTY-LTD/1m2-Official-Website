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

  var dragKnotTemplate = "";
  
  var decodedText = $("<div/>").html(dragKnotTemplate).text();
  $('#drag-knot').html(decodedText);

  var dragCC = new DragControlController($('.component-drag-control'));
  dragCC.init();

  // ******************** sound effect *****************
  $(".drag-knob").hover(function() {
    if ($(".button-mute").hasClass("is-muted"))
      return;
    $("#mouseover-sound")[0].play();;
  }, function() {});
  $(".drag-knob").mousedown(function() {
    if ($(".button-mute").hasClass("is-muted"))
      return;
    $("#click-sound")[0].play();;
  });
  
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
