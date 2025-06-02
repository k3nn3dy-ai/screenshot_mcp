# Screenshot MCP Server

A Model Context Protocol (MCP) server that enables Claude Desktop to take screenshots of websites using [gowitness](https://github.com/sensepost/gowitness). Screenshots are organized by date with unique IDs for easy reference and retrieval. 

<img width="732" alt="image" src="https://github.com/user-attachments/assets/2e1458e4-5916-4cc8-8e9b-fee814bc66a8" />

## Features

- 📸 Take screenshots of any website URL
- 👁️ **View and analyze screenshots directly in Claude Desktop**
- 🗂️ Automatic organization by date (YYYY-MM-DD format)
- 🆔 Unique UUID for each screenshot for future reference
- 💾 SQLite database storage for metadata
- 🔍 List and search screenshots with detailed metadata
- ⚙️ Configurable screenshot parameters (resolution, delay, timeout)
- 🔗 Compatible with Claude Desktop via MCP
- 🖼️ **Real-time image analysis and visual insights**

## Prerequisites

### 1. Install gowitness

You need to have [gowitness](https://github.com/sensepost/gowitness) installed and available in your PATH.

```bash
# Install gowitness using Go (requires Go 1.24+)
GOTOOLCHAIN=go1.24.0 go install github.com/sensepost/gowitness@latest
```

Make sure `gowitness` is accessible from your terminal:
```bash
gowitness --help
```

### 2. Node.js and npm

Ensure you have Node.js (version 18 or higher) and npm installed.

## Installation

### Quick Setup (Recommended)

For the easiest installation, use the automated setup script:

```bash
# Clone or download this repository
git clone <repository-url>
cd Screenshot_MCP

# Run the automated setup script
./setup.sh
```

The setup script will automatically:
- ✅ Check for required dependencies (Node.js, npm, Go)
- ✅ Install gowitness with the correct Go version
- ✅ Install npm dependencies
- ✅ Build the TypeScript project
- ✅ Configure Claude Desktop (macOS)
- ✅ Display usage examples and available features

### Manual Installation

If you prefer to install manually or need to customize the setup:

1. Clone or download this repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the TypeScript code:
   ```bash
   npm run build
   ```

4. Install gowitness:
   ```bash
   GOTOOLCHAIN=go1.24.0 go install github.com/sensepost/gowitness@latest
   ```

## Configuration for Claude Desktop

Add the following configuration to your Claude Desktop settings file:

### macOS
Edit `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "screenshot-server": {
      "command": "node",
      "args": ["/path/to/Screenshot_MCP/dist/index.js"],
      "cwd": "/path/to/Screenshot_MCP"
    }
  }
}
```

### Windows
Edit `%APPDATA%\Claude\claude_desktop_config.json` with the same configuration, adjusting paths as needed.

### Linux
Edit `~/.config/Claude/claude_desktop_config.json` with the same configuration.

**Important:** Replace `/path/to/Screenshot_MCP` with the actual absolute path to this project directory.

## Usage

Once configured, restart Claude Desktop. You'll have access to these tools:

### 1. Take Screenshot
```
take_screenshot
```
**Parameters:**
- `url` (required): The website URL to screenshot
- `width` (optional): Screenshot width in pixels (default: 1200)
- `height` (optional): Screenshot height in pixels (default: 800)
- `delay` (optional): Delay in seconds before taking screenshot (default: 3)
- `timeout` (optional): Timeout in seconds (default: 10)
- `include_image` (optional): Whether to show the image immediately (default: false)

**Examples:**
```
Please take a screenshot of https://github.com/sensepost/gowitness
```
```
Take a screenshot of https://www.synack.com and show me the image so I can analyze it
```

### 2. View Screenshot
```
view_screenshot
```
**Parameters:**
- `screenshot_id` (required): The unique ID of the screenshot to view

**Example:**
```
Please view screenshot ID abc123def-456-789-xyz and analyze the website design
```

### 3. List Screenshots
```
list_screenshots
```
**Parameters:**
- `limit` (optional): Maximum number of screenshots to return (default: 50)

**Example:**
```
Show me the last 10 screenshots I've taken
```

### 4. Get Screenshot Info
```
get_screenshot_info
```
**Parameters:**
- `screenshot_id` (required): The unique ID of the screenshot

**Example:**
```
Get details for screenshot ID: abc123def-456-789-xyz
```

## Claude's Visual Analysis Capabilities

With the new image viewing features, Claude can now:

- 🎨 **Analyze website design and user interface**
- 🔍 **Identify login forms, buttons, and navigation elements**
- 📊 **Compare website layouts and changes over time**
- 🛡️ **Spot security-related elements and potential issues**
- 📱 **Evaluate responsive design and mobile compatibility**
- 🎯 **Provide UX/UI feedback and recommendations**
- 🔗 **Identify key website components and functionality**

## File Organization

Screenshots are automatically organized in the following structure:

```
screenshots/
├── 2024-01-15/
│   ├── uuid1_screenshot1.png
│   └── uuid2_screenshot2.png
├── 2024-01-16/
│   └── uuid3_screenshot3.png
└── screenshots.db (SQLite database with metadata)
```

Each screenshot file is prefixed with its unique UUID for easy identification and cross-referencing with the database.

## Development

### Building
```bash
npm run build
```

### Development mode
```bash
npm run dev
```

### Manual testing
```bash
# Start the server manually for testing
npm start
```

## Troubleshooting

### Common Issues

1. **"gowitness is not installed"**
   - Make sure gowitness is installed: `GOTOOLCHAIN=go1.24.0 go install github.com/sensepost/gowitness@latest`
   - Verify it's in your PATH: `gowitness --help`

2. **"Screenshot was not generated successfully"**
   - Check if the URL is accessible
   - Verify gowitness has proper permissions
   - Try increasing the timeout parameter

3. **Claude Desktop doesn't see the tools**
   - Verify the path in `claude_desktop_config.json` is correct and absolute
   - Make sure the server was built successfully (`npm run build`)
   - Restart Claude Desktop after configuration changes

4. **Permission errors**
   - Ensure the MCP server has write permissions to the directory
   - Check that the screenshots directory can be created

5. **"Unsupported image type" or image viewing issues**
   - Make sure you're using the latest version of the server
   - Restart Claude Desktop after rebuilding
   - Check that the screenshot files exist and are readable

### Debugging

To see debug output from the MCP server, check the Claude Desktop logs or run the server manually:

```bash
node dist/index.js
```

## Example Use Cases

- **Security Testing**: Take screenshots of web applications and analyze them for security elements
- **UI/UX Review**: Capture website designs and get detailed visual feedback
- **Competitive Analysis**: Screenshot competitor websites and compare layouts
- **Bug Reporting**: Capture visual bugs and have Claude analyze the issues
- **Accessibility Review**: Screenshot websites and analyze accessibility features
- **Documentation**: Create visual documentation of web interfaces

## License

This project is open source. Please refer to the gowitness license for the underlying screenshot functionality.

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## Related Projects

- [gowitness](https://github.com/sensepost/gowitness) - The underlying screenshot utility
- [Model Context Protocol](https://modelcontextprotocol.io/) - The protocol specification
- [Claude Desktop](https://claude.ai/download) - Anthropic's desktop application 
