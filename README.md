# EML Opener Helper – Chrome Extension to Open Email Files Fast in Outlook Classic

Do you often download .eml and .msg email files just to open them? EML Opener Helper is a smart Chrome extension that lets you open these email files directly from your web browser in Outlook Classic. Just one click! You don't need to download them first. This saves your time and helps you work more efficiently. It's an easier way to handle your email files.

## How to Install
⚠️ This tool has two separate parts. You must install them in the correct order.

### 👉 Step 1 – Install the Chrome Extension
1. Open Chrome and go to `chrome://extensions`.
2. Enable **Developer mode** (top right).
3. Click **Load unpacked** and select the folder of this extension.

### 👉 Step 2 – Install the Companion Project
4. Now install the second part (**eml_opener**), which connects Chrome with Outlook Classic.  
   Install [eml_opener](https://github.com/Giancarlo1974/open_eml_msg_extension/blob/main/install.md) by following the instructions in the link.

---

## Notes
- Only for Windows


## 📄 How to Use the `.msg`/`.eml` Auto-Redirect Script

This extension automatically intercepts clicks on links to `.msg` or `.eml` files and redirects them to a custom URL protocol (e.g., `emlopen://`), allowing native applications to handle these files directly.

---

### 🧠 What It Does

- Listens for mouse clicks (`mousedown`) on `<a>` elements.
- Intercepts links that:
  - End with `.msg` or `.eml`, **or**
  - Return the MIME type `application/vnd.ms-outlook` in a `HEAD` request.
- Prevents the browser's default behavior.
- Redirects the user to a custom protocol URL like:
  `emlopen://github.com/Giancarlo1974/open_eml_msg_extension/raw/refs/heads/main/test.msg`

---

### ✅ Requirements

- Files must be served via HTTP(S) with the correct headers.
- A native application must be registered on the client machine to handle the `emlopen://` protocol.
- The web server must serve `.msg` files with the appropriate `Content-Type`.

---

### 🌐 Nginx Configuration Example (Optional)

You only need this if you are running your own web server and want to make sure `.msg` files are served with the correct MIME type (`application/vnd.ms-outlook`).

For most users, **no server configuration is required**—the extension works on any website where links to `.eml` or `.msg` files are available and the files are served with the right headers.

If you do control the web server and want to ensure compatibility, here is an example Nginx configuration:

```nginx
location ~* \.msg$ {
  default_type application/vnd.ms-outlook;
  add_header Content-Disposition "inline";
  root /var/www/html;
  try_files $uri =404;
}
```

💡 This configuration is only needed if your server does not already send the correct MIME type for `.msg` files. The extension will still work on most public sites and file links without any changes.


### 🧪 Example Usage
👉 [**/open_eml_msg_extension/raw/refs/heads/main/test.msg**](https://github.com/Giancarlo1974/open_eml_msg_extension/raw/refs/heads/main/test.msg)
When the user clicks this link:
- A HEAD request checks the file's MIME type.
- If it matches a .msg/.eml file or the MIME type application/vnd.ms-outlook, the click is intercepted.
- The browser is redirected to a custom URL scheme (e.g., emlopen://...).
- A registered native application handles the custom URL and opens the file.

### ⭐️ Like It? Star It!
🌟 Love this project? Show your support!
If this extension helped you open .eml or .msg files easily in your browser — consider giving it a ⭐️!
It only takes a second and really helps others discover the project.

Your support keeps this project alive and improving. Thanks! 🙌

