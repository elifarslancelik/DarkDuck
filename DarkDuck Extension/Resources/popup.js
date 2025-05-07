document.addEventListener('DOMContentLoaded', async () => {
  const toggleBtn = document.getElementById('toggle-btn');
  const statusText = document.getElementById('status-text');
  
  try {
    // Başlangıç durumunu yükle
    const { darkModeEnabled } = await browser.storage.local.get("darkModeEnabled");
    updateUI(darkModeEnabled || false);
    
    // Toggle buton event listener
    toggleBtn.addEventListener('click', async () => {
      const newState = !toggleBtn.classList.contains('active');
      await browser.storage.local.set({ darkModeEnabled: newState });
      updateUI(newState);
    });
    
  } catch (error) {
    console.error("Popup error:", error);
  }
  
  function updateUI(isEnabled) {
    toggleBtn.classList.toggle('active', isEnabled);
    toggleBtn.textContent = isEnabled ? 'ON' : 'OFF';
    statusText.textContent = isEnabled ? 'Dark Mode: Açık' : 'Dark Mode: Kapalı';
    statusText.style.color = isEnabled ? '#0f9b8e' : '#666';
  }
});