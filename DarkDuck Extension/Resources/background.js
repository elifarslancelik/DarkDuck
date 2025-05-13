const STORAGE_KEY = "darkModeEnabled";
const MANUAL_OVERRIDE_KEY = "manualOverride";

// Kurulumda varsayılan değerleri ata
browser.runtime.onInstalled.addListener(async () => {
  await browser.storage.local.set({
    [STORAGE_KEY]: false,
    [MANUAL_OVERRIDE_KEY]: false
  });

  await browser.action.setIcon({ path: "images/wd/Icon-64.png" });

  
});

// Kullanıcı toolbar ikonuna tıkladığında: HER ZAMAN dark mode toggle edilir ve override edilir
browser.action.onClicked.addListener(async (tab) => {
  try {
    const { [STORAGE_KEY]: currentState } = await browser.storage.local.get(STORAGE_KEY);
    const newState = !currentState;

    await browser.storage.local.set({
      [STORAGE_KEY]: newState,
      [MANUAL_OVERRIDE_KEY]: true // override'ı aktif et
    });

    await browser.action.setIcon({
      path: newState ? "images/dd/Icon-64.png" : "images/wd/Icon-64.png"
    });

    if (tab?.id) {
      await browser.tabs.sendMessage(tab.id, {
        action: "updateDarkMode",
        isEnabled: newState
      });
    }

  } catch (e) {
    console.error("Toggle error:", e);
  }
});

// Sistem teması değiştiğinde, sadece manualOverride === false ise uygula
browser.runtime.onMessage.addListener(async (message, sender) => {
  if (message.action === "systemThemeChanged") {
    const { isEnabled } = message;
    const { [MANUAL_OVERRIDE_KEY]: manualOverride } = await browser.storage.local.get(MANUAL_OVERRIDE_KEY);

    if (!manualOverride) {
      await browser.storage.local.set({ [STORAGE_KEY]: isEnabled });

      await browser.action.setIcon({
        path: isEnabled ? "images/dd/Icon-64.png" : "images/wd/Icon-64.png"
      });

      if (sender.tab?.id) {
        await browser.tabs.sendMessage(sender.tab.id, {
          action: "updateDarkMode",
          isEnabled: isEnabled
        });
      }
    }
  }
});
