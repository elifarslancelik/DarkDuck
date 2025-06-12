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
        --dark-text: whitesmoke;
        --dark-element: #1e1e1e;
        --dark-border: #333;
        --dark-link: #90caf9;
        --dark-input: #2d2d2d;
      }

      .darkduck-mode body {
        background-color: var(--dark-bg) !important;
        color: var(--dark-text) !important;
      }

      .darkduck-mode div:not([style*="color"]):not(figure):not(.unit-image-wrapper),
      .darkduck-mode section:not([style*="color"]),
      .darkduck-mode article:not([style*="color"]),
      .darkduck-mode header:not([style*="color"]),
      .darkduck-mode footer:not([style*="color"]),
      .darkduck-mode nav:not([style*="color"]),
      .darkduck-mode aside:not([style*="color"]),
      .darkduck-mode main:not([style*="color"]),
      .darkduck-mode p:not([style*="color"]),
      .darkduck-mode h1:not([style*="color"]),
      .darkduck-mode h2:not([style*="color"]),
      .darkduck-mode h3:not([style*="color"]),
      .darkduck-mode h4:not([style*="color"]),
      .darkduck-mode h5:not([style*="color"]),
      .darkduck-mode h6:not([style*="color"]) {
        background-color: var(--dark-element) !important;
        color: var(--dark-text) !important;
      }

      /* İkonları dark mode'dan hariç tut */
      .darkduck-mode i,
      .darkduck-mode [class*="icon"],
      .darkduck-mode [class*="Icon"],
      .darkduck-mode [class*="fa-"],
      .darkduck-mode [class*="material-icons"],
      .darkduck-mode svg {
        color: inherit !important;
        background-color: transparent !important;
      }

      .darkduck-mode a:not([style*="color"]) {
        color: var(--dark-link) !important;
      }

      .darkduck-mode input:not([style*="color"]),
      .darkduck-mode textarea:not([style*="color"]),
      .darkduck-mode select:not([style*="color"]) {
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
