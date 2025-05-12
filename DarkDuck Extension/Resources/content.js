// Sayfa yüklendiğinde dark mode durumunu kontrol et
initializeDarkMode();
observeSystemTheme();

async function initializeDarkMode() {
  const { darkModeEnabled, manualOverride } = await browser.storage.local.get(["darkModeEnabled", "manualOverride"]);

  if (manualOverride) {
    // Manuel override varsa, kaydedilen durumu uygula
    darkModeEnabled ? applyDarkMode() : removeDarkMode();
  } else {
    // Override yoksa sistem temasına göre karar ver
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (systemPrefersDark) {
      applyDarkMode();
    } else {
      removeDarkMode();
    }

    // Sistemi depolayıp background'a bildir
    await browser.storage.local.set({ darkModeEnabled: systemPrefersDark });

    await browser.runtime.sendMessage({
      action: "systemThemeChanged",
      isEnabled: systemPrefersDark
    });
  }
}

// Sistem temasındaki değişiklikleri dinle
function observeSystemTheme() {
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', async (e) => {
    const isDark = e.matches;
    const { manualOverride } = await browser.storage.local.get("manualOverride");

    if (!manualOverride) {
      await browser.storage.local.set({ darkModeEnabled: isDark });

      await browser.runtime.sendMessage({
        action: "systemThemeChanged",
        isEnabled: isDark
      });
    }
  });
}

// Mesaj dinleyici (background'dan gelen güncellemeler için)
browser.runtime.onMessage.addListener((message) => {
  if (message.action === "updateDarkMode") {
    message.isEnabled ? applyDarkMode() : removeDarkMode();
  }
});

// Dark Mode Stil Uygulayıcı
function applyDarkMode() {
  document.documentElement.classList.add("darkduck-mode");

  if (!document.getElementById("darkduck-styles")) {
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

      .darkduck-mode a {
        color: var(--dark-link) !important;
      }

      .darkduck-mode input,
      .darkduck-mode textarea,
      .darkduck-mode select {
        background-color: var(--dark-input) !important;
        color: var(--dark-text) !important;
        border-color: var(--dark-border) !important;
      }

      .darkduck-mode table {
        background-color: var(--dark-element) !important;
        border-color: var(--dark-border) !important;
      }

      .darkduck-mode th,
      .darkduck-mode td {
        border-color: var(--dark-border) !important;
      }

      .darkduck-mode .card,
      .darkduck-mode .panel,
      .darkduck-mode .modal {
        background-color: var(--dark-element) !important;
        border-color: var(--dark-border) !important;
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
}

function removeDarkMode() {
  document.documentElement.classList.remove("darkduck-mode");
  const style = document.getElementById("darkduck-styles");
  if (style) style.remove();
}
