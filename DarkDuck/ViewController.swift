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
    
    private func loadHelpPage() {
        let appIcon = NSImage(named: "AppIcon")
        var base64Icon = ""

        if let tiffData = appIcon?.tiffRepresentation,
           let bitmap = NSBitmapImageRep(data: tiffData),
           let pngData = bitmap.representation(using: .png, properties: [:]) {
            base64Icon = pngData.base64EncodedString()
        }

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
                h1, h2, h3 {
                    color: #0066cc;
                }
                .step {
                    margin-bottom: 20px;
                }
                .note {
                    color: #666;
                    font-style: italic;
                }
                .footer {
                    margin-top: 40px;
                    padding-top: 20px;
                    border-top: 1px solid #eee;
                    font-size: 14px;
                }
                a {
                    color: #0066cc;
                    text-decoration: none;
                    cursor: pointer;
                }
                a:hover {
                    text-decoration: underline;
                }
                #privacy, #support {
                    display: none;
                    margin-top: 30px;
                    padding: 20px;
                    background-color: #f9f9f9;
                    border: 1px solid #ddd;
                    border-radius: 8px;
                }
            </style>
            <script>
                function togglePrivacy() {
                    var privacySection = document.getElementById("privacy");
                    var currentDisplay = window.getComputedStyle(privacySection).display;

                    privacySection.style.display = (currentDisplay === "none") ? "block" : "none";

                    if (privacySection.style.display === "block") {
                        privacySection.focus();
                    }
                }


                function toggleSupport() {
                    var supportSection = document.getElementById("support");
                    var currentDisplay = window.getComputedStyle(supportSection).display;

                    supportSection.style.display = (currentDisplay === "none") ? "block" : "none";

                    if (supportSection.style.display === "block") {
                        supportSection.focus();
                    }
                }

            </script>
        </head>
        <body>
            <img src="data:image/png;base64,\(base64Icon)" class="app-icon" alt="DarkDuck Icon" width="64" height="64">
            <h1>DarkDuck Setup Guide</h1>

            <div class="step">
                <h2>1. Enable DarkDuck Extension</h2>
                <p>Go to Safari > Settings > Extensions tab and enable the DarkDuck extension.</p>
            </div>

            <div class="step">
                <h2>2. Grant Permissions</h2>
                <p>Provide the necessary permissions for the extension to work properly (Full Website Access).</p>
            </div>

            <div class="step">
                <h2>3. Automatic or Manual Mode</h2>
                <p>Initially, dark mode is automatically set based on your system theme. It will change automatically when your system theme changes. You can toggle dark mode manually by clicking the DarkDuck icon in the Safari toolbar to override the system theme.</p>
            </div>

            <div class="note">
                <p>Once the extension is enabled, you can toggle dark mode on any webpage by clicking the DarkDuck icon in your Safari toolbar.</p>
            </div>


            <div class="footer">
                <p><a onclick="togglePrivacy()">Privacy Policy</a> |
                   <a onclick="toggleSupport()">Support</a></p>
                <p class="note">DarkDuck v1.0</p>
            </div>

            <!-- Privacy Policy -->
            <div id="privacy" tabindex="-1">
                <h2>Privacy Policy</h2>
                <p><strong>Last updated:</strong> May 11, 2025</p>
                <p>This Privacy Policy describes Our policies and procedures regarding user privacy when You use the DarkDuck Safari web extension (the "Service"). <strong>Please note that DarkDuck operates locally on your device and does not collect, use, or disclose any of Your personal information.</strong></p>

                <h3>Definitions</h3>
                <ul>
                    <li><strong>Application</strong> refers to the DarkDuck Safari web extension, the software program provided by the Developer.</li>
                    <li><strong>Developer</strong> (referred to as either "the Developer", "We", "Us" or "Our") refers to Elif Arslancelik.</li>
                    <li><strong>Device</strong> means any Apple device that can utilize the Safari web extension.</li>
                    <li><strong>Personal Data</strong> refers to any information related to an identified or identifiable individual. <strong>Please be aware that DarkDuck does not collect any Personal Data.</strong></li>
                    <li><strong>Service</strong> refers to the DarkDuck Safari web extension.</li>
                    <li><strong>You</strong> means the individual accessing or using the Service.</li>
                </ul>

                <h3>No Collection of Your Personal Data</h3>
                <p><strong>DarkDuck does not collect any personal data from its users.</strong> The extension operates entirely on your local device. This means:</p>
                <ul>
                    <li>We do not ask You to provide any personally identifiable information such as your name or email address.</li>
                    <li>We do not track Your usage data such as IP address, browsing history, or device identifiers.</li>
                    <li>We do not use cookies or similar tracking technologies to collect information.</li>
                </ul>

                <h3>How the Service Works</h3>
                <p>DarkDuck is a Safari web extension that runs locally to apply dark mode to the websites you visit. It automatically detects your system theme setting (light or dark mode) and formats web pages accordingly. This detection is handled entirely on your device and is never shared with any external server.</p>

                <h3>Third-Party Links</h3>
                <p>DarkDuck interacts with the websites you visit in your Safari browser. Please note that these third-party websites have their own privacy policies, and we have no control over or responsibility for their content or practices.</p>

                <h3>Changes to This Privacy Policy</h3>
                <p>We may update Our Privacy Policy from time to time. Since DarkDuck does not collect any user data, these updates will primarily reflect operational changes or legal requirements related to the extension’s distribution. Changes take effect when posted on this page.</p>

                <h3>Contact Us</h3>
                <p>If you have any questions about this Privacy Policy, you may contact us at:<br>
                📧 <a href="mailto:elifnurarslnclk@gmail.com">elifnurarslnclk@gmail.com</a></p>
            </div>

            <!-- Support -->
            <div id="support" tabindex="-1">
                <h2>Support</h2>
                <p>If you need support for the DarkDuck Safari extension, you can reach us through the following methods:</p>
                <ul>
                    <li><strong>Email:</strong> <a href="mailto:elifnurarslnclk@gmail.com">elifnurarslnclk@gmail.com</a></li>
                    <li><strong>GitHub:</strong> <a href="https://github.com/elifarslancelik/DarkDuck">DarkDuck GitHub</a></li>
                </ul>
                <p>We are happy to assist you!</p>
            </div>
        </body>
        </html>
        """

        webView.loadHTMLString(htmlString, baseURL: URL(string: "about:blank"))
    }

}
