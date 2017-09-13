var nextTasks = [], 
allTasks = [], 
errorTasks = [], 
allTasksObj,
currentTask,
clickBlock = false
;

var BASE_ANSWERS_COUNT = getParameterByName('answers_count') || 16;
var TIME_TO_THE_NEXT_QUESTION_ON_FAIL = getParameterByName('time_to_the_next_question_on_fail') || 3000;

$.get('current-task.txt', function(data) {
  $.get('tasks/'+data+'.json', function(tasks) {
    if (getParameterByName('invert') == "true")
      tasks = inverObject(tasks);
    
    allTasksObj = tasks;
    doTasks(tasks);
  });
});

function doTasks(tasks) {
  var i = 0;
  $.each(tasks, function(key, value) {
    nextTasks.push(key);
  });

  nextTasks = shuffleArray(nextTasks);
  allTasks = nextTasks.slice(); // deep clone
  nextTask();
}

function nextTask() {
  if (nextTasks.length == 0 && errorTasks.length != 0){
    nextTasks = errorTasks;
    errorTasks = [];
  }
  else if (nextTasks.length == 0 && errorTasks.length == 0) {
    $("#answersWrapper").empty();
    $("#question").text("Вы справились со всеми заданиями").append('<h1 style="margin-left: auto; margin-right: auto;"><a href="">Сыграть ещё разок!</a></h1>');
    return;
  }
  var taskId = nextTasks.shift();
  currentTask = taskId;
  var count = Math.min(BASE_ANSWERS_COUNT, allTasks.length);
  var answersHtml = "";
  $("#question").text(taskId);

  var randomTasks = shuffleArray(allTasks).slice(0, count);

  if ($.inArray(taskId, randomTasks) == -1) {
    randomTasks.pop();
    randomTasks.push(taskId);
    randomTasks = shuffleArray(randomTasks);
  }

  for (var i = randomTasks.length - 1; i >= 0; i--) {
    answersHtml += '<div class="col-md-4"><div class="answerButton" data-answer="'+randomTasks[i]+'">'+allTasksObj[randomTasks[i]]+'</div></div>'
  }
  $("#answersWrapper").empty().append(answersHtml);
}

function shuffleArray(array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}

function getParameterByName(name, url) {
    if (!url) {
      url = window.location.href;
    }
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function inverObject (obj) {

  var new_obj = {};

  for (var prop in obj) {
    if(obj.hasOwnProperty(prop)) {
      new_obj[obj[prop]] = prop;
    }
  }

  return new_obj;
};

$(document).on('click', '.answerButton', function(){
  if (clickBlock) return;
  clickBlock = true;
  var currAnswer = $(this).attr('data-answer');
  if (currAnswer == currentTask){
    nextTask();
    clickBlock = false;
  }
  else {
    errorTasks.push(currentTask);
    $(this).parents('#answersWrapper').find('[data-answer="'+currentTask+'"]').css({
      "backgroundColor": "#2ecc71", 
      "border": "none"
    });
    setTimeout(function(){ clickBlock = false; nextTask();}, TIME_TO_THE_NEXT_QUESTION_ON_FAIL);
  }
});