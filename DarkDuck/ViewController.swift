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
                    privacySection.style.display = (privacySection.style.display === "none") ? "block" : "none";

                    if (privacySection.style.display === "block") {
                        privacySection.focus();  // Focus on the privacy section when it's shown
                    }
                }

                function toggleSupport() {
                    var supportSection = document.getElementById("support");
                    supportSection.style.display = (supportSection.style.display === "none") ? "block" : "none";

                    if (supportSection.style.display === "block") {
                        supportSection.focus();  // Focus on the support section when it's shown
                    }
                }
            </script>
        </head>
        <body>
            <img src="data:image/png;base64,\(base64Icon)" class="app-icon" alt="DarkDuck Icon" width="64" height="64">
            <h1>DarkDuck Setup Guide</h1>

            <div class="step">
                <h2>1. Open Safari Preferences</h2>
                <p>Navigate to Safari > Preferences > Extensions tab.</p>
            </div>

            <div class="step">
                <h2>2. Enable DarkDuck Extension</h2>
                <p>Find the DarkDuck extension and check the box next to it to enable it.</p>
            </div>

            <div class="step">
                <h2>3. Adjust Permissions</h2>
                <p>Grant the necessary permissions for the extension to work properly.</p>
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

                <h3>Interpretation and Definitions</h3>
                <p>The words of which the initial letter is capitalized have meanings defined under the following conditions. The following definitions shall have the same meaning regardless of whether they appear in singular or in plural.</p>

                <h3>Definitions</h3>
                <ul>
                    <li><strong>Application</strong> refers to the DarkDuck Safari web extension, the software program provided by the Developer.</li>
                    <li><strong>Developer</strong> (referred to as either "the Developer", "We", "Us" or "Our") refers to Elif Arslancelik.</li>
                    <li><strong>Device</strong> means any Apple device that can utilize the Safari web extension.</li>
                    <li><strong>Personal Data</strong> refers to any information related to an identified or identifiable individual. <strong>Please be aware that DarkDuck does not collect any Personal Data.</strong></li>
                    <li><strong>Service</strong> refers to the DarkDuck Safari web extension.</li>
                    <li><strong>You</strong> mean the individual accessing or using the Service.</li>
                </ul>

                <h3>No Collection of Your Personal Data</h3>
                <p><strong>DarkDuck does not collect any personal data from its users.</strong> The extension operates entirely on your local device. This means:</p>
                <ul>
                    <li>We do not ask You to provide any personally identifiable information such as your email address or name.</li>
                    <li>We do not track Your usage data, such as your IP address, browsing history, or device identifiers.</li>
                    <li>We do not use cookies or similar tracking technologies to collect information.</li>
                </ul>

                <h3>How the Service Functions</h3>
                <p>DarkDuck is a Safari web extension that operates locally to provide its intended functionality providing a dark mode for websites. Because it operates locally, it does not transmit any user data to our servers or any third-party servers.</p>

                <h3>Third-Party Links</h3>
                <p>As a web extension, DarkDuck interacts with websites you visit in your Safari browser. Please be aware that these third-party websites have their own privacy policies. We have no control over and assume no responsibility for their content, privacy policies, or practices.</p>

                <h3>Changes to this Privacy Policy</h3>
                <p>We may update Our Privacy Policy from time to time. Because DarkDuck does not collect any user data, these updates will primarily serve to reflect any changes in our operational practices or legal requirements related to the distribution of the extension. Changes are effective when posted on this page.</p>

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

        webView.loadHTMLString(htmlString, baseURL: nil)
    }

}
