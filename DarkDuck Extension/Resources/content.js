// Sayfa yüklendiğinde dark mode durumunu kontrol et
initializeDarkMode();

async function initializeDarkMode() {
  const { darkModeEnabled } = await browser.storage.local.get("darkModeEnabled");
  if (darkModeEnabled) {
    applyDarkMode();
  }
}

// Mesaj dinleyici
browser.runtime.onMessage.addListener((message) => {
  if (message.action === "updateDarkMode") {
    message.isEnabled ? applyDarkMode() : removeDarkMode();
  }
});

function applyDarkMode() {
  if (!document.documentElement.classList.contains("darkduck-mode")) {
    document.documentElement.classList.add("darkduck-mode");
    
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
      
      .darkduck-mode body {
        background-color: var(--dark-bg) !important;
        color: var(--dark-text) !important;
      }
      
      /* Tüm temel elementler */
      .darkduck-mode > div:not([data-lat]),
      .darkduck-mode section,
      .darkduck-mode article,
      .darkduck-mode header,
      .darkduck-mode footer,
      .darkduck-mode nav,
      .darkduck-mode aside,
      .darkduck-mode main {
        background-color: var(--dark-element) !important;
        color: var(--dark-text) !important;
      }
      
      /* Bağlantılar */
      .darkduck-mode a {
        color: var(--dark-link) !important;
      }
      
      /* Form elementleri */
      .darkduck-mode input,
      .darkduck-mode textarea,
      .darkduck-mode select {
        background-color: var(--dark-input) !important;
        color: var(--dark-text) !important;
        border-color: var(--dark-border) !important;
      }
      
      /* Tablolar */
      .darkduck-mode table {
        background-color: var(--dark-element) !important;
        border-color: var(--dark-border) !important;
      }
      
      .darkduck-mode th,
      .darkduck-mode td {
        border-color: var(--dark-border) !important;
      }
      
      /* Özel component'ler */
      .darkduck-mode .card,
      .darkduck-mode .panel,
      .darkduck-mode .modal {
        background-color: var(--dark-element) !important;
        border-color: var(--dark-border) !important;
      }
      
      /* Scrollbar */
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
}

function removeDarkMode() {
  document.documentElement.classList.remove("darkduck-mode");
  const style = document.getElementById("darkduck-styles");
  if (style) style.remove();
}
