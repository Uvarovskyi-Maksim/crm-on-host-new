let lastTapTime = 0;
function handleClientClicks(clientId, handleClientDoubleClick) {
    const currentTime = new Date().getTime();
    const tapDelay = 300;
    
    if (currentTime - lastTapTime < tapDelay) {
      handleClientDoubleClick(clientId);
    } else {
      setTimeout(() => {
        if (new Date().getTime() - lastTapTime >= tapDelay) {
          console.log("One!")
        }
      }, tapDelay);
    }

    lastTapTime = currentTime;
  }

export default handleClientClicks;