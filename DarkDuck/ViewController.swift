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
    
    @IBOutlet weak var webView: WKWebView!  // WKWebView outlet'i ekleyin
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        // webView ile işlem yapabilirsiniz, örneğin bir URL yüklemek:
        let url = URL(string: "https://tr.wikipedia.org/")!
        let request = URLRequest(url: url)
        webView.load(request)
    }

    @IBAction func openSafariExtensionPreferences(_ sender: Any) {
        SFSafariApplication.showPreferencesForExtension(withIdentifier: "com.elif.DarkDuck.DarkDuck-Extension") { error in
            if let error = error {
                // Hata oluşursa logla
                NSLog("Hata oluştu: %@", error.localizedDescription)
            }
        }
    }

    override var representedObject: Any? {
        didSet {
            // Update the view, if already loaded.
        }
    }
}
