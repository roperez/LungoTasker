class __Controller.TasksCtrl extends Monocle.Controller

    events:
      "click [data-action=new]"    :   "onNew"

    elements:
      "#pending"    :   "pending"
      "#important"  :   "important"
      "input"       :   "name"

    constructor: ->
      super
      __Model.Task.bind "create", @bindTaskCreated
      __Model.Task.bind "update", @bindTaskUpdated
      __Model.Task.bind "destroy", @bindTaskDestroyed
      __Model.Task.bind "error", @bindError

    onNew: (event) ->
      __Controller.Task.new()

    bindTaskCreated: (task) =>
      context = if task.important is true then "high" else "normal"
      new __View.Task model: task, container: "article##{context} ul"
      @renderTotals()
      Lungo.Router.back()
      Lungo.Notification.hide()

    bindTaskDestroyed: (task) =>
      @renderTotals()

    bindError: (task, error) => 
      afterNotification = ->
        debugger
        Lungo.Notification.hide()

      Lungo.Notification.error "Error", "Unsuccessful operation", "cancel", 7, afterNotification


    bindTaskUpdated: (task) =>
      #update view with updated task
      $$('#'+task.uid).children("div").html(task.list)
      $$('#'+task.uid).children("strong").html(task.name)
      $$('#'+task.uid).children("small").html(task.description)

      # if updated task must be show in the other article...
      article=$$('#'+task.uid).parent().parent().attr('id')

      if article is "normal" and task.important is true
        destination = "high"
      else if article is "high" and task.important is false 
        destination = "normal"
      else
        destination = null

      if destination isnt null
        #Remove the list item
        $$('#'+task.uid).remove()
        #Pass it to the other article
        @appendTask(task, destination)
      
      #Calculate totals
      @renderTotals()

    renderTotals: ->
      total = __Model.Task.important().length
      Lungo.Element.count("#important", total)
      Lungo.Element.count("#star", total)

    appendTask: (task, context) ->
      console.log(task)
      console.log(context)
      new __View.Task model: task, container: "article##{context} ul"

$$ ->
  Lungo.init({})
  Tasks = new __Controller.TasksCtrl "section#tasks"
