//
//  ViewController.swift
//  DarkDuck
//
//  Created by Elif Arslancelik on 7.05.2025.
//

import Cocoa
import SafariServices
import WebKit  // WKWebView'i kullanabilmek için WebKit'i import etmelisiniz.

class ViewController: NSViewController {
    
    private let webView: WKWebView = {
        let webView = WKWebView()
        webView.translatesAutoresizingMaskIntoConstraints = false
        return webView
    }()
    
    override func viewDidLoad() {
        super.viewDidLoad()
        setupUI()
        loadHelpPage()
    }
    
    private func setupUI() {
        view.addSubview(webView)
        
        NSLayoutConstraint.activate([
            webView.topAnchor.constraint(equalTo: view.topAnchor),
            webView.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            webView.trailingAnchor.constraint(equalTo: view.trailingAnchor),
            webView.bottomAnchor.constraint(equalTo: view.bottomAnchor)
        ])
    }
    
    // ... existing code ...
    
    private func loadHelpPage() {
        let htmlString = """
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { 
                font-family: -apple-system, sans-serif; 
                padding: 20px;
                max-width: 800px;
                margin: 0 auto;
                line-height: 1.6;
            }
            h1 { color: #0066cc; }
            .step { margin-bottom: 20px; }
            .note { color: #666; font-style: italic; }
            .footer { 
                margin-top: 40px;
                padding-top: 20px;
                border-top: 1px solid #eee;
                font-size: 14px;
            }
            a { 
                color: #0066cc;
                text-decoration: none;
            }
            a:hover { text-decoration: underline; }
        </style>
    </head>
    <body>
        <img src="AppIcon" class="app-icon" alt="DarkDuck Icon">
        <h1>DarkDuck Kurulum Rehberi</h1>
        
        <div class="step">
            <h2>1. Safari Tercihlerini Açın</h2>
            <p>Safari > Tercihler > Uzantılar sekmesine gidin.</p>
        </div>
        
        <div class="step">
            <h2>2. DarkDuck Uzantısını Etkinleştirin</h2>
            <p>DarkDuck uzantısını bulun ve yanındaki kutuyu işaretleyin.</p>
        </div>
        
        <div class="step">
            <h2>3. İzinleri Ayarlayın</h2>
            <p>Uzantının çalışması için gerekli izinleri verin.</p>
        </div>
        
        <div class="note">
            <p>Uzantıyı etkinleştirdikten sonra herhangi bir web sayfasında araç çubuğundan DarkDuck simgesine tıklayarak karanlık modu açıp kapatabilirsiniz.</p>
        </div>
        
        <div class="footer">
            <p><a href="https://www.example.com/privacy" target="_blank">Gizlilik Politikası</a> | 
               <a href="https://www.example.com/support" target="_blank">Destek</a></p>
            <p class="note">DarkDuck v1.0</p>
        </div>
    </body>
    </html>
    """
        
        webView.loadHTMLString(htmlString, baseURL: Bundle.main.resourceURL)
    }
}
