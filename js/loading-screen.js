// Feisk Productions hatch entry screen
// Include this script after the loading-screen HTML exists in the document.

(() => {
  const loadingScreen = document.getElementById("loading-screen");
  const bunkerScreen = document.getElementById("bunker-screen");
  const hatchButton = document.getElementById("hatch-button");
  const hatchImage = document.getElementById("hatch-image");
  const enterPrompt = document.getElementById("enter-prompt");

  if (!loadingScreen || !bunkerScreen || !hatchButton || !hatchImage || !enterPrompt) {
    console.warn("Feisk loading screen: required elements not found.");
    return;
  }

  const assetsToPreload = [
    "assets/ui/feisk-sign.png",
    "assets/ui/hatch-closed.png",
    "assets/ui/hatch-open.png",
    "assets/backgrounds/bunker-room.png",
    "assets/props/filing-cabinet.png",
    "assets/props/wall-safe.png",
    "assets/props/white-fluffy-rug.png",
    "assets/props/wall-mounted-lcd-monitors.png",
    "assets/props/old-desktop-computer.png",
    "assets/props/swivel-desk-chair.png",
    "assets/props/rotary-telephone.png",
    "assets/props/bookshelf.png"
  ];

  let hasEnteredBunker = false;

  function preloadImage(src) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = resolve;
      img.onerror = resolve;
      img.src = src;
    });
  }

  function enterBunker() {
    if (hasEnteredBunker || hatchButton.disabled) return;

    hasEnteredBunker = true;
    hatchButton.classList.add("is-opening");
    enterPrompt.style.opacity = "0";
    hatchImage.src = "assets/ui/hatch-open.png";

    setTimeout(() => {
      loadingScreen.classList.remove("is-active");
      bunkerScreen.classList.add("is-active");
    }, 850);
  }

  hatchButton.disabled = true;
  enterPrompt.textContent = "Loading bunker assets...";

  Promise.all(assetsToPreload.map(preloadImage)).then(() => {
    enterPrompt.textContent = "Click the hatch to enter";
    hatchButton.disabled = false;
  });

  hatchButton.addEventListener("click", enterBunker);
})();
