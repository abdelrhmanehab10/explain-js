document.addEventListener("DOMContentLoaded", () => {
  // DOM Elements
  const grandparent = document.getElementById("grandparent");
  const parent = document.getElementById("parent");
  const child = document.getElementById("child");
  const logContainer = document.getElementById("log-container");
  const toggleModeBtn = document.getElementById("toggle-mode");
  const clearLogsBtn = document.getElementById("clear-logs");

  // Initial state
  let useCapture = false; // Start with bubbling phase (false)
  let logCount = 0;
  let highlightedElements = []; // Track elements that have been highlighted

  // Function to add event listeners based on current mode
  function setupEventListeners() {
    // Remove existing event listeners first
    removeEventListeners();

    // Add new event listeners with current useCapture value
    grandparent.addEventListener("click", handleGrandparentClick, useCapture);
    parent.addEventListener("click", handleParentClick, useCapture);
    child.addEventListener("click", handleChildClick, useCapture);

    // Update button text
    toggleModeBtn.textContent = `Current Mode: ${
      useCapture ? "Capturing" : "Bubbling"
    }`;

    // Update demo box styling
    const demoBox = document.querySelector(".demo-box");
    if (useCapture) {
      demoBox.classList.remove("bubbling");
      demoBox.classList.add("capturing");
    } else {
      demoBox.classList.remove("capturing");
      demoBox.classList.add("bubbling");
    }
  }

  // Function to remove event listeners
  function removeEventListeners() {
    grandparent.removeEventListener(
      "click",
      handleGrandparentClick,
      useCapture
    );
    parent.removeEventListener("click", handleParentClick, useCapture);
    child.removeEventListener("click", handleChildClick, useCapture);
  }

  // Event handlers
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

  // Function to log events
  function logEvent(elementName, event) {
    logCount++;
    const logEntry = document.createElement("div");
    logEntry.classList.add("log-entry");
    logEntry.classList.add(useCapture ? "capturing-log" : "bubbling-log");

    // Create timestamp
    const now = new Date();
    const timestamp = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}.${now.getMilliseconds()}`;

    logEntry.textContent = `${logCount}. [${timestamp}] ${
      useCapture ? "⬇️ Capturing" : "⬆️ Bubbling"
    }: ${elementName} element was triggered`;

    // Add to log container and scroll to bottom
    logContainer.appendChild(logEntry);
    logContainer.scrollTop = logContainer.scrollHeight;
  }

  // Function to highlight clicked element
  function highlightElement(element) {
    // Store original background color and element for later reset
    const originalColor = element.style.backgroundColor;

    // Add to highlighted elements array with its original color
    highlightedElements.push({
      element: element,
      originalColor: originalColor,
    });

    // Highlight effect
    element.style.backgroundColor = useCapture ? "#ffcdd2" : "#b3e5fc";

    // If this is the target element (where the event originated)
    // Schedule a reset of all highlighted elements after the event propagation
    if (element === child && !useCapture) {
      // For bubbling (inner to outer), reset after child (innermost) is processed
      setTimeout(resetAllHighlightedElements, 300);
    } else if (element === grandparent && useCapture) {
      // For capturing (outer to inner), reset after grandparent (outermost) is processed
      setTimeout(resetAllHighlightedElements, 300);
    }
  }

  // Function to reset all highlighted elements
  function resetAllHighlightedElements() {
    highlightedElements.forEach((item) => {
      item.element.style.backgroundColor = item.originalColor;
    });
    // Clear the array after resetting
    highlightedElements = [];
  }

  // Toggle between bubbling and capturing
  toggleModeBtn.addEventListener("click", () => {
    useCapture = !useCapture;
    setupEventListeners();

    // Add a log entry about mode change
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

  // Clear logs
  clearLogsBtn.addEventListener("click", () => {
    logContainer.innerHTML = "";
    logCount = 0;
  });

  // Initial setup
  setupEventListeners();

  // Add initial instruction log
  const initialLog = document.createElement("div");
  initialLog.classList.add("log-entry");
  initialLog.style.backgroundColor = "#e8f5e9";
  initialLog.innerHTML = `<strong>Instructions:</strong> Click on the nested elements to see how events ${
    useCapture ? "capture" : "bubble"
  } through the DOM. Toggle the mode button to switch between bubbling and capturing.`;
  logContainer.appendChild(initialLog);
});
