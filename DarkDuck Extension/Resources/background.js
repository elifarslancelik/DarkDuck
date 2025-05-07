const STORAGE_KEY = "darkModeEnabled";

// Uzantı yüklendiğinde varsayılan durumu ayarla
browser.runtime.onInstalled.addListener(() => {
  browser.storage.local.set({ [STORAGE_KEY]: false });
  browser.action.setIcon({ path: "images/toolbar-icon.svg" });
});

// Toolbar butonuna tıklandığında çalışır
browser.action.onClicked.addListener(async (tab) => {
  try {
    const { [STORAGE_KEY]: currentState } = await browser.storage.local.get(STORAGE_KEY);
    const newState = !currentState;

    await browser.storage.local.set({ [STORAGE_KEY]: newState });
    await browser.action.setIcon({
      path: newState ? "images/toolbar-icon.svg" : "images/toolbar-icon.svg"
    });

    // Content script'e mesaj gönder veya inject et
    try {
      await browser.tabs.sendMessage(tab.id, {
        action: "updateDarkMode",
        isEnabled: newState
      });
    } catch {
      await browser.tabs.executeScript(tab.id, { file: "content.js" });
    }
  } catch (error) {
    console.error("Toggle error:", error);
  }
});
