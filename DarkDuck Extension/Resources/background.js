const STORAGE_KEY = "darkModeEnabled";

// Başlangıçta kapalı olarak ayarla ve icon'u güncelle
browser.runtime.onInstalled.addListener(async () => {
  await browser.storage.local.set({ [STORAGE_KEY]: false });
  await browser.action.setIcon({ path: "images/icon.png" });
  console.log("Extension installed, default state: OFF");
});

// Toolbar buton tıklaması
browser.action.onClicked.addListener(async (tab) => {
  try {
    // Mevcut durumu al
    const { [STORAGE_KEY]: currentState } = await browser.storage.local.get(STORAGE_KEY);
    const newState = !currentState;
    
    // Yeni durumu kaydet
    await browser.storage.local.set({ [STORAGE_KEY]: newState });
    
    // Icon'u güncelle
    await browser.action.setIcon({
      path: newState ? "images/icon-active.png" : "images/icon.png"
    });
    
    // Content script'e mesaj gönder
    try {
      await browser.tabs.sendMessage(tab.id, {
        action: "updateDarkMode",
        isEnabled: newState
      });
    } catch (e) {
      console.log("Injecting content script...");
      await browser.tabs.executeScript(tab.id, { file: "content.js" });
    }
    
  } catch (error) {
    console.error("Toggle error:", error);
  }
});