import SafariServices
import os.log

class SafariWebExtensionHandler: NSObject, NSExtensionRequestHandling {
    
    private let storage = UserDefaults.standard
    
    func beginRequest(with context: NSExtensionContext) {
        // Başlangıç değerini ayarla
        if storage.object(forKey: "darkModeEnabled") == nil {
            storage.set(false, forKey: "darkModeEnabled")
        }
        
        guard let item = context.inputItems.first as? NSExtensionItem,
              let message = item.userInfo?[SFExtensionMessageKey] as? [String: Any] else {
            sendResponse(context, success: false, error: "Invalid message format")
            return
        }
        
        os_log("Received message: %{public}@", message.description)
        
        if let action = message["action"] as? String {
            switch action {
            case "getStatus":
                handleGetStatus(context)
            case "toggleDarkMode":
                handleToggleDarkMode(context, message: message)
            default:
                sendResponse(context, success: false, error: "Unknown action")
            }
        } else {
            sendResponse(context, success: false, error: "Missing action")
        }
    }
    
    private func handleGetStatus(_ context: NSExtensionContext) {
        let isDarkMode = storage.bool(forKey: "darkModeEnabled")
        os_log("Current dark mode status: %{public}@", isDarkMode ? "ON" : "OFF")
        sendResponse(context, 
                    success: true, 
                    data: ["isDarkMode": isDarkMode])
    }
    
    private func handleToggleDarkMode(_ context: NSExtensionContext, message: [String: Any]) {
        guard let isDarkMode = message["isDarkMode"] as? Bool else {
            sendResponse(context, success: false, error: "Missing isDarkMode parameter")
            return
        }
        
        storage.set(isDarkMode, forKey: "darkModeEnabled")
        os_log("Dark mode toggled to: %{public}@", isDarkMode ? "ON" : "OFF")
        
        // Bildirim gönder
        DispatchQueue.main.async {
            NotificationCenter.default.post(
                name: Notification.Name("DarkModeChanged"),
                object: nil,
                userInfo: ["isDarkMode": isDarkMode]
            )
        }
        
        sendResponse(context, 
                    success: true, 
                    data: ["isDarkMode": isDarkMode])
    }
    
    private func sendResponse(_ context: NSExtensionContext, 
                            success: Bool, 
                            data: [String: Any] = [:], 
                            error: String? = nil) {
        var response = data
        response["success"] = success
        if let error {
            response["error"] = error
        }
        
        let item = NSExtensionItem()
        item.userInfo = [SFExtensionMessageKey: response]
        context.completeRequest(returningItems: [item], completionHandler: nil)
    }
}

// Notification extension
extension Notification.Name {
    static let DarkModeChanged = Notification.Name("DarkModeChanged")
}