var ctx = new AudioContext();

var bufferSize = 1024;
var numberOfInputChannels = 1;
var numberOfOutputChannels = 1;
var node = ctx.createScriptProcessor(bufferSize, numberOfInputChannels, numberOfOutputChannels);

var gainNode = ctx.createGain();
gainNode.gain.value = 0.2;

var frequencyMin = 440;
var frequencyMax = 880;

var step = 0.0;
var frequency = frequencyMin;

node.onaudioprocess = function(e) {
  var data = e.outputBuffer.getChannelData(0);

  for(var i = 0; i < data.length; i++) {
    data[i] = Math.sin(2 * Math.PI * step);
    step += frequency / ctx.sampleRate;
  }
}

var playButton = document.getElementById('play');

playButton.addEventListener('touchstart', e => {
  // ズーム無効
  if (event.touches.length > 1) {
    event.preventDefault();
  }

  ctx.resume().then(() => {
    node.connect(gainNode);
    gainNode.connect(ctx.destination);
  })
});

window.addEventListener('deviceorientation', e => {
  frequency = createFrequency(e);
});

var lastTouch;
playButton.addEventListener('touchend', () => {
  // ズーム無効
  const now = window.performance.now();
  if (now - lastTouch <= 500) {
    event.preventDefault();
  }
  lastTouch = now;

  node.disconnect();
});

function createFrequency(e) {
  var num = (e.alpha + 180) / 360;
  console.log(num);
  return (frequencyMax - frequencyMin) * num + frequencyMin;
}
