//
//  AppDelegate.swift
//  DarkDuck
//
//  Created by Elif Arslancelik on 7.05.2025.
//

import Cocoa

@main
class AppDelegate: NSObject, NSApplicationDelegate {
    
    func applicationDidFinishLaunching(_ notification: Notification) {
        // Pencere boyutunu ve konumunu ayarla
        if let window = NSApplication.shared.windows.first {
            window.setContentSize(NSSize(width: 800, height: 600))
            window.center()
            window.title = "DarkDuck - Safari Extension Helper"
        }
    }

    func applicationShouldTerminateAfterLastWindowClosed(_ sender: NSApplication) -> Bool {
        return true
    }
}

extension AppDelegate {
    func applicationSupportsSecureRestorableState(_ app: NSApplication) -> Bool {
        return true
    }
}