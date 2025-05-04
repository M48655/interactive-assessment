const videoElement = document.getElementById('video');
const canvasElement = document.getElementById('canvas');
const canvasCtx = canvasElement.getContext('2d');

const hands = new Hands({
  locateFile: (file) => {
    return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
  }
});

hands.setOptions({
  maxNumHands: 1,
  modelComplexity: 1,
  minDetectionConfidence: 0.7,
  minTrackingConfidence: 0.7
});
let hasAnswered = false; // علشان نمنع التكرار


hands.onResults((results) => {
  canvasCtx.save();
  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
  canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);

  if (results.multiHandLandmarks.length > 0) {
    for (const landmarks of results.multiHandLandmarks) {
      drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS, { color: '#00FF00', lineWidth: 4 });
      drawLandmarks(canvasCtx, landmarks, { color: '#FF0000', lineWidth: 2 });

      // اكتشاف رفع اليد
      if (!hasAnswered && landmarks[0].y < 0.3) {
        showMessage("✅ إجابة مسجلة!");
        hasAnswered = true;
        // اكتشاف الهز (تحرك الإيد بسرعة)
const currentY = landmarks[0].y;
const currentTime = Date.now();

if (previousY !== null && previousTime !== null) {
  const diffY = Math.abs(currentY - previousY);
  const diffTime = (currentTime - previousTime) / 1000; // بالثواني
  const speed = diffY / diffTime;

  if (speed > 1.5) {
    showMessage("🟡 تم اكتشاف هز اليد!");
  }
}

previousY = currentY;
previousTime = currentTime;

      }
    }
  }

  canvasCtx.restore();
});

const camera = new Camera(videoElement, {
  onFrame: async () => {
    await hands.send({image: videoElement});
  },
  width: 640,
  height: 480
});

camera.start();
console.log("📸 الكاميرا شغالة");

function showMessage(msg) {
    let messageBox = document.getElementById("message");
    if (!messageBox) {
        messageBox = document.createElement("div");
        messageBox.id = "message";
        messageBox.style.position = "absolute";
        messageBox.style.top = "10px";
        messageBox.style.left = "10px";
        messageBox.style.backgroundColor = "white";
        messageBox.style.padding = "10px";
        messageBox.style.fontSize = "20px";
        messageBox.style.border = "2px solid black";
        document.body.appendChild(messageBox);
    }
    messageBox.innerText = msg;
}
