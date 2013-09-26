class __View.Task extends Monocle.View

  template  : """
    <li id= {{uid}} >
      <span {{#done}}class="icon ok"{{/done}} > </span>
      <div class="on-right">{{list}}</div>
      <strong>{{name}}</strong>
      <small>{{description}}</small>
    </li>
  """

  constructor: ->
    super
    @append @model

  events:
    "swipeLeft li"  :  "onDelete"
    "hold li"       :  "onDone"
    "singleTap li"  :  "onView"

  elements:
    "input.toggle"  : "toggle"

  onDone: (event) ->
    @model.updateAttributes done: !@model.done
    @refresh()

  onDelete: (event) =>
    console.log(event)
    Lungo.Notification.confirm
      icon: "user"
      title: "Confirmation"
      description: "Going to remove a task. Do you want to continue?"
      accept:
        icon: "checkmark"
        label: "Accept"
        callback: =>
          @remove()
          @model.destroy()
      cancel:
        icon: "close"
        label: "Cancel"
        callback: ->
          @
  


  onView: (event) ->
    __Controller.Task.show @model
