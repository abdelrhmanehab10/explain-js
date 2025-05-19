document.addEventListener("DOMContentLoaded", () => {
  const grandparent = document.getElementById("grandparent");
  const parent = document.getElementById("parent");
  const child = document.getElementById("child");
  const logContainer = document.getElementById("log-container");
  const toggleModeBtn = document.getElementById("toggle-mode");
  const clearLogsBtn = document.getElementById("clear-logs");

  let useCapture = false;
  let logCount = 0;

  function setupEventListeners() {
    removeEventListeners();

    grandparent.addEventListener("click", handleGrandparentClick, useCapture);
    parent.addEventListener("click", handleParentClick, useCapture);
    child.addEventListener("click", handleChildClick, useCapture);

    toggleModeBtn.textContent = `Current Mode: ${
      useCapture ? "Capturing" : "Bubbling"
    }`;

    const demoBox = document.querySelector(".demo-box");
    if (useCapture) {
      demoBox.classList.remove("bubbling");
      demoBox.classList.add("capturing");
    } else {
      demoBox.classList.remove("capturing");
      demoBox.classList.add("bubbling");
    }
  }

  function removeEventListeners() {
    grandparent.removeEventListener(
      "click",
      handleGrandparentClick,
      useCapture
    );
    parent.removeEventListener("click", handleParentClick, useCapture);
    child.removeEventListener("click", handleChildClick, useCapture);
  }

  function handleGrandparentClick(event) {
    logEvent("Grandparent", event);
    highlightElement(grandparent);
  }

  function handleParentClick(event) {
    logEvent("Parent", event);
    highlightElement(parent);
  }

  function handleChildClick(event) {
    logEvent("Child", event);
    highlightElement(child);
  }

  function logEvent(elementName) {
    logCount++;
    const logEntry = document.createElement("div");
    logEntry.classList.add("log-entry");
    logEntry.classList.add(useCapture ? "capturing-log" : "bubbling-log");

    const now = new Date();
    const timestamp = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}.${now.getMilliseconds()}`;

    logEntry.textContent = `${logCount}. [${timestamp}] ${
      useCapture ? "⬇️ Capturing" : "⬆️ Bubbling"
    }: ${elementName} element was triggered`;

    logContainer.appendChild(logEntry);
    logContainer.scrollTop = logContainer.scrollHeight;
  }

  function highlightElement(element) {
    element.style.backgroundColor = useCapture ? "#ffcdd2" : "#b3e5fc";

    setTimeout(() => {
      element.style.backgroundColor = "";
    }, 300);
  }

  toggleModeBtn.addEventListener("click", () => {
    useCapture = !useCapture;
    setupEventListeners();

    const logEntry = document.createElement("div");
    logEntry.classList.add("log-entry");
    logEntry.style.backgroundColor = "#e8f5e9";
    logEntry.textContent = `Mode changed to: ${
      useCapture
        ? "Capturing (events travel from outer to inner)"
        : "Bubbling (events travel from inner to outer)"
    }`;
    logContainer.appendChild(logEntry);
    logContainer.scrollTop = logContainer.scrollHeight;
  });

  clearLogsBtn.addEventListener("click", () => {
    logContainer.innerHTML = "";
    logCount = 0;
  });

  setupEventListeners();

  const initialLog = document.createElement("div");
  initialLog.classList.add("log-entry");
  initialLog.style.backgroundColor = "#e8f5e9";
  initialLog.innerHTML = `<strong>Instructions:</strong> Click on the nested elements to see how events ${
    useCapture ? "capture" : "bubble"
  } through the DOM. Toggle the mode button to switch between bubbling and capturing.`;
  logContainer.appendChild(initialLog);
});
