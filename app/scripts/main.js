'use strict';

var ctx;
var aladdinW, aladdinH;
var aladdinX, aladdinY;
var profileImage;
var scaleX, scaleY;
var startX, startY;
var translateX, translateY;
var imageContainer = document.querySelector('.picture');
var frozen = false;
var aladdinImage = new Image();
aladdinImage.src = DATA_URL;

document.addEventListener('DOMContentLoaded', function () {
  aladdinW = aladdinImage.width;
  aladdinH = aladdinImage.height;
  aladdinX = aladdinY = 0;

  document.querySelector('.file').addEventListener('change', onPicture, false);
  imageContainer = document.querySelector('.picture');
  document.body.addEventListener('mouseup', function f() {
    imageContainer.removeEventListener('mousemove', onDrag, false);
  }, false);
}, false);

function onPicture() {
  if (this.files.length === 0) {
    return;
  }
  profileImage = new Image();
  profileImage.src = URL.createObjectURL(this.files[0]);

  profileImage.addEventListener('load', function () {
    imageContainer.innerHTML = '';
    translateX = translateY = 0;
    scaleX = scaleY = 100;

    // Create canvas
    var canvas = document.createElement('canvas');
    canvas.width = profileImage.width;
    canvas.height = profileImage.height;
    ctx = canvas.getContext('2d');
    drawImage();
    imageContainer.appendChild(canvas);

    // Create slider
    var slider = document.createElement('input');
    slider.type = 'range';
    slider.min = 40;
    slider.max = 160;
    slider.value = 100;
    slider.classList.add('slider');
    slider.addEventListener('input', onScale, false);
    imageContainer.appendChild(slider);

    // Create freeze button
    var button = document.createElement('button');
    button.innerHTML = 'Freeze';
    button.classList.add('btn');
    button.addEventListener('click', function () {
      if (button.innerHTML === 'Freeze') {
        freeze();
        button.innerHTML = 'Unfreeze';
      } else {
        unfreeze();
        button.innerHTML = 'Freeze';
      }
    }, false);
    imageContainer.appendChild(button);

    // Set up mouse handler
    imageContainer.addEventListener('mousedown', function f(e) {
      if (!frozen) {
        startX = e.pageX;
        startY = e.pageY;
        imageContainer.addEventListener('mousemove', onDrag, false);
      }
    }, false);
  }, false);
}

function drawImage() {
  var canvas = ctx.canvas;
  ctx.drawImage(profileImage, 0, 0);
  ctx.save();
  ctx.scale(scaleX / 100, scaleY / 100);
  ctx.drawImage(aladdinImage, aladdinX, aladdinY, aladdinW, aladdinH, translateX, translateY, canvas.width, canvas.height);
  ctx.restore();
}

function onScale(e) {
  var slider = e.target;
  scaleX = scaleY = slider.value;
  drawImage();
}

function onDrag(e) {
  var diffX = e.pageX - startX;
  var diffY = e.pageY - startY;
  translateX = diffX < 0 ? Math.max(diffX, -ctx.canvas.width) : Math.min(diffX, ctx.canvas.width);
  translateY = diffY < 0 ? Math.max(diffY, -ctx.canvas.height) : Math.min(diffY, ctx.canvas.height);
  drawImage();
}

function freeze() {
  document.querySelector('.file').style.visibility = 'hidden';
  document.querySelector('.slider').disabled = true;
  frozen = true;
}

function unfreeze() {
  document.querySelector('.file').style.visibility = 'visible';
  document.querySelector('.slider').disabled = false;
  frozen = false;
}
