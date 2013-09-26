(function() {
  var _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  __Model.Task = (function(_super) {
    __extends(Task, _super);

    function Task() {
      _ref = Task.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    Task.fields("name", "description", "list", "when", "important", "done");

    Task.pending = function() {
      return this.select(function(task) {
        return !task.done;
      });
    };

    Task.completed = function() {
      return this.select(function(task) {
        return !!task.done;
      });
    };

    Task.important = function() {
      return this.select(function(task) {
        return task.important === true;
      });
    };

    Task.prototype.validate = function() {
      if (!this.name) {
        "name is required";
      }
      if (!this.description) {
        return "description is required";
      }
    };

    return Task;

  })(Monocle.Model);

}).call(this);

(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  __View.Task = (function(_super) {
    __extends(Task, _super);

    Task.prototype.template = "<li id= {{uid}} >\n  <span {{#done}}class=\"icon ok\"{{/done}} > </span>\n  <div class=\"on-right\">{{list}}</div>\n  <strong>{{name}}</strong>\n  <small>{{description}}</small>\n</li>";

    function Task() {
      this.onDelete = __bind(this.onDelete, this);
      Task.__super__.constructor.apply(this, arguments);
      this.append(this.model);
    }

    Task.prototype.events = {
      "swipeLeft li": "onDelete",
      "hold li": "onDone",
      "singleTap li": "onView"
    };

    Task.prototype.elements = {
      "input.toggle": "toggle"
    };

    Task.prototype.onDone = function(event) {
      this.model.updateAttributes({
        done: !this.model.done
      });
      return this.refresh();
    };

    Task.prototype.onDelete = function(event) {
      var _this = this;
      console.log(event);
      return Lungo.Notification.confirm({
        icon: "user",
        title: "Confirmation",
        description: "Going to remove a task. Do you want to continue?",
        accept: {
          icon: "checkmark",
          label: "Accept",
          callback: function() {
            _this.remove();
            return _this.model.destroy();
          }
        },
        cancel: {
          icon: "close",
          label: "Cancel",
          callback: function() {
            return this;
          }
        }
      });
    };

    Task.prototype.onView = function(event) {
      return __Controller.Task.show(this.model);
    };

    return Task;

  })(Monocle.View);

}).call(this);

(function() {
  var TaskCtrl,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  TaskCtrl = (function(_super) {
    __extends(TaskCtrl, _super);

    TaskCtrl.prototype.elements = {
      "input[name=name]": "name",
      "textarea[name=description]": "description",
      "select[name=list]": "list",
      "input[name=when]": "when",
      "input[name=important]": "important"
    };

    TaskCtrl.prototype.events = {
      "click [data-action=save]": "onSave"
    };

    function TaskCtrl() {
      TaskCtrl.__super__.constructor.apply(this, arguments);
      this["new"] = this._new;
      this.show = this._show;
    }

    TaskCtrl.prototype.onSave = function(event) {
      if (this.current) {
        return this.current.updateAttributes({
          name: this.name.val(),
          description: this.description.val(),
          list: this.list.val(),
          when: this.when.val(),
          important: this.important[0].checked
        });
      } else {
        Lungo.Notification.show();
        return __Model.Task.create({
          name: this.name.val(),
          description: this.description.val(),
          list: this.list.val(),
          when: this.when.val(),
          important: this.important[0].checked
        });
      }
    };

    TaskCtrl.prototype._new = function(current) {
      this.current = current != null ? current : null;
      this.name.val("");
      this.description.val("");
      this.list.val("");
      this.when.val("");
      this.important[0].checked = false;
      return Lungo.Router.section("task");
    };

    TaskCtrl.prototype._show = function(current) {
      this.current = current;
      this.name.val(this.current.name);
      this.description.val(this.current.description);
      this.list.val(this.current.list);
      this.when.val(this.current.when);
      this.important[0].checked = this.current.important;
      return Lungo.Router.section("task");
    };

    return TaskCtrl;

  })(Monocle.Controller);

  $$(function() {
    return __Controller.Task = new TaskCtrl("section#task");
  });

}).call(this);

(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  __Controller.TasksCtrl = (function(_super) {
    __extends(TasksCtrl, _super);

    TasksCtrl.prototype.events = {
      "click [data-action=new]": "onNew"
    };

    TasksCtrl.prototype.elements = {
      "#pending": "pending",
      "#important": "important",
      "input": "name"
    };

    function TasksCtrl() {
      this.bindTaskUpdated = __bind(this.bindTaskUpdated, this);
      this.bindError = __bind(this.bindError, this);
      this.bindTaskDestroyed = __bind(this.bindTaskDestroyed, this);
      this.bindTaskCreated = __bind(this.bindTaskCreated, this);
      TasksCtrl.__super__.constructor.apply(this, arguments);
      __Model.Task.bind("create", this.bindTaskCreated);
      __Model.Task.bind("update", this.bindTaskUpdated);
      __Model.Task.bind("destroy", this.bindTaskDestroyed);
      __Model.Task.bind("error", this.bindError);
    }

    TasksCtrl.prototype.onNew = function(event) {
      return __Controller.Task["new"]();
    };

    TasksCtrl.prototype.bindTaskCreated = function(task) {
      var context;
      context = task.important === true ? "high" : "normal";
      new __View.Task({
        model: task,
        container: "article#" + context + " ul"
      });
      this.renderTotals();
      Lungo.Router.back();
      return Lungo.Notification.hide();
    };

    TasksCtrl.prototype.bindTaskDestroyed = function(task) {
      return this.renderTotals();
    };

    TasksCtrl.prototype.bindError = function(task, error) {
      var afterNotification;
      afterNotification = function() {
        debugger;
        return Lungo.Notification.hide();
      };
      return Lungo.Notification.error("Error", "Unsuccessful operation", "cancel", 7, afterNotification);
    };

    TasksCtrl.prototype.bindTaskUpdated = function(task) {
      var article, destination;
      $$('#' + task.uid).children("div").html(task.list);
      $$('#' + task.uid).children("strong").html(task.name);
      $$('#' + task.uid).children("small").html(task.description);
      article = $$('#' + task.uid).parent().parent().attr('id');
      if (article === "normal" && task.important === true) {
        destination = "high";
      } else if (article === "high" && task.important === false) {
        destination = "normal";
      } else {
        destination = null;
      }
      if (destination !== null) {
        $$('#' + task.uid).remove();
        this.appendTask(task, destination);
      }
      return this.renderTotals();
    };

    TasksCtrl.prototype.renderTotals = function() {
      var total;
      total = __Model.Task.important().length;
      Lungo.Element.count("#important", total);
      return Lungo.Element.count("#star", total);
    };

    TasksCtrl.prototype.appendTask = function(task, context) {
      console.log(task);
      console.log(context);
      return new __View.Task({
        model: task,
        container: "article#" + context + " ul"
      });
    };

    return TasksCtrl;

  })(Monocle.Controller);

  $$(function() {
    var Tasks;
    Lungo.init({});
    return Tasks = new __Controller.TasksCtrl("section#tasks");
  });

}).call(this);
