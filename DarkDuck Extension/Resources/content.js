// Sayfa yüklendiğinde dark mode'u uygula
initDarkMode();

async function initDarkMode() {
  const { darkModeEnabled } = await browser.storage.local.get("darkModeEnabled");
  if (darkModeEnabled) applyDarkMode();
}

// Mesaj dinleyici
browser.runtime.onMessage.addListener(({ action, isEnabled }) => {
  if (action === "updateDarkMode") {
    isEnabled ? applyDarkMode() : removeDarkMode();
  }
});

function applyDarkMode() {
  const root = document.documentElement;
  if (root.classList.contains("darkduck-mode")) return;

  root.classList.add("darkduck-mode");

  const style = document.createElement("style");
  style.id = "darkduck-styles";
  style.textContent = `
    :root.darkduck-mode {
      --dark-bg: #121212;
      --dark-text: #e0e0e0;
      --dark-element: #1e1e1e;
      --dark-border: #333;
      --dark-link: #90caf9;
      --dark-input: #2d2d2d;
    }

    .darkduck-mode body,
    .darkduck-mode div,
    .darkduck-mode section,
    .darkduck-mode article,
    .darkduck-mode header,
    .darkduck-mode footer,
    .darkduck-mode nav,
    .darkduck-mode aside,
    .darkduck-mode main,
    .darkduck-mode .card,
    .darkduck-mode .panel,
    .darkduck-mode .modal,
    .darkduck-mode table,
    .darkduck-mode th,
    .darkduck-mode td,
    .darkduck-mode input,
    .darkduck-mode textarea,
    .darkduck-mode select {
      background-color: var(--dark-element) !important;
      color: var(--dark-text) !important;
      border-color: var(--dark-border) !important;
    }

    .darkduck-mode body {
      background-color: var(--dark-bg) !important;
    }

    .darkduck-mode a {
      color: var(--dark-link) !important;
    }

    .darkduck-mode ::-webkit-scrollbar {
      width: 12px !important;
    }

    .darkduck-mode ::-webkit-scrollbar-track {
      background: var(--dark-element) !important;
    }

    .darkduck-mode ::-webkit-scrollbar-thumb {
      background: var(--dark-border) !important;
      border-radius: 6px !important;
    }
  `;
  document.head.appendChild(style);
}

function removeDarkMode() {
  document.documentElement.classList.remove("darkduck-mode");
  document.getElementById("darkduck-styles")?.remove();
}
