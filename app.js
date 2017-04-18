var nextTasks = [], 
allTasks = [], 
errorTasks = [], 
allTasksObj,
currentTask
;

const BASE_ANSWERS_COUNT = 16;
const TIME_TO_THE_NEXT_QUESTION_ON_FAIL = 3000;

$.get('current-task-number.txt', function(data) {
  $.get('tasks/'+data+'.json', function(tasks) {
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
    $("#question").text("Вы справились со всеми заданиями");
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

$(document).on('click', '.answerButton', function(){
  var currAnswer = $(this).attr('data-answer');
  if (currAnswer == currentTask)
    nextTask();
  else {
    errorTasks.push(currentTask);
    $(this).parents('#answersWrapper').find('[data-answer="'+currentTask+'"]').css({
      "backgroundColor": "#2ecc71", 
      "border": "none"
    });
    setTimeout(nextTask, TIME_TO_THE_NEXT_QUESTION_ON_FAIL);
  }
});