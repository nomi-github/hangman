$(document).ready(function () {
  $(".container").append(" <div class='cloud'></div>");
  $(".container").append(" <div class='cloud cloud2'></div>");
  $(".ground").append(' <img src="/images/water2.png" class="waterTop"/>');
  $(".ground").append(' <img src="/images/croc.png" class="croc" id="croc1" />');
  $(".ground").append(' <img src="/images/croc.png" class="croc" id="croc2"/>');
  $("#actualTime").html(transformSecToMin(totalTime));
  moveHangingRope();
});

$(window).on("resize", function () {
  moveHangingRope();
})

function moveHangingRope() {
  $("#hanging-rope").css("left", $("#cliff").width() - 160);
  $("#hanging-rope").css("top", $("#cliff").height() / 6 + 40);
}


let left = 0;
let right = 0;
let idx = 0;
let moveWater = setInterval(function () {
  if (idx % 2 == 0) {
    $(".ground img.waterTop:nth-child(1)").css("transform", "scaleX(-1)");
  } else {
    $(".ground img.waterTop:nth-child(1)").css("transform", "scaleX(1)");
  }
  idx += 1;
}, 1000);

let moveCroc = setInterval(function () {
  if (left < $(".ground").width() - $("img.croc").width() || right < $(".ground").width()) {
    left += 20;
    right += 20;
  } else {
    left = 0;
    right = 0;
  }
  $("img#croc2").css("left", left + "px");
  $("img#croc1").css("right", right + "px");
}, 100);
console.log(moveWater);
