# Screenshot MCP Server - AI-Powered Visual Web Analysis

## 🌟 Overview

The Screenshot MCP Server is a cutting-edge Model Context Protocol (MCP) server that revolutionizes how AI assistants interact with web content. By combining the powerful screenshot capabilities of [gowitness](https://github.com/sensepost/gowitness) with Claude Desktop's visual analysis, this server enables unprecedented automated web analysis and documentation workflows.

**What makes it special?** Unlike traditional screenshot tools, this server allows Claude to actually **see and analyze** the screenshots it takes, creating a complete visual-to-insight pipeline.

## 🚀 Key Features

- **📸 Intelligent Screenshot Capture**: High-quality website screenshots with configurable parameters
- **👁️ Real-time Visual Analysis**: Claude can view and analyze screenshots immediately 
- **🖼️ Advanced Image Optimization**: Smart compression (80% size reduction) for efficient viewing
- **📅 Organized Storage**: Automatic date-based organization with unique UUIDs
- **💾 Persistent Database**: SQLite storage for metadata and retrieval
- **⚙️ Flexible Configuration**: Customizable dimensions, delays, quality, and formats
- **🔍 Comprehensive Search**: List, search, and retrieve screenshots by ID or metadata

## 🎯 Primary Use Cases

### 🛡️ Security & Penetration Testing
- **Web Application Assessment**: Capture and analyze login pages, admin panels, and security controls
- **Reconnaissance Automation**: Screenshot target websites and automatically identify attack vectors
- **Evidence Documentation**: Create visual proof of security findings with timestamped captures
- **Vulnerability Validation**: Compare before/after screenshots to verify security fixes

### 🎨 UI/UX Design & Research
- **Competitive Analysis**: Screenshot competitor websites and get detailed UX analysis from Claude
- **Design System Audits**: Capture multiple pages and analyze consistency across interfaces
- **Responsive Testing**: Document how websites appear at different resolutions
- **Accessibility Reviews**: Visual analysis of accessibility features and potential improvements

### 📊 Business Intelligence & Monitoring
- **Website Change Detection**: Regular screenshots to monitor competitor updates and market trends
- **Brand Monitoring**: Capture how your brand appears across different platforms
- **Market Research**: Screenshot e-commerce sites for pricing analysis and product positioning
- **Performance Documentation**: Visual documentation of website performance across different conditions

### 🔍 Quality Assurance & Testing
- **Cross-browser Testing**: Document visual differences across different browsers and devices
- **Regression Testing**: Compare screenshots before and after deployments
- **Bug Documentation**: Capture visual bugs with detailed analysis and context
- **User Experience Testing**: Screenshot user journeys and analyze friction points

### 📚 Documentation & Training
- **Technical Documentation**: Create visual guides and tutorials with annotated screenshots
- **Process Documentation**: Capture step-by-step workflows for training materials
- **Compliance Reporting**: Visual evidence for regulatory compliance and audits
- **Client Reporting**: Professional visual reports with AI-generated insights

## 💼 Industry Applications

### Cybersecurity Firms
*"Our penetration testers use the Screenshot MCP Server to automatically capture and analyze target websites, with Claude identifying potential vulnerabilities and attack surfaces in real-time."*

### Digital Marketing Agencies
*"We monitor 50+ competitor websites daily. Claude analyzes the screenshots and alerts us to new campaigns, design changes, and market opportunities."*

### Web Development Teams
*"Before every deployment, we capture screenshots of key pages. Claude compares them with previous versions and flags any unintended visual changes."*

### E-commerce Companies
*"We track competitor pricing and product pages. Claude analyzes the screenshots and provides insights on market positioning and pricing strategies."*

### UX Research Teams
*"We capture user interfaces across different devices and have Claude analyze accessibility, user flow, and design consistency issues."*

## ⚡ Workflow Examples

### Security Assessment Workflow
```
1. "Take a screenshot of https://target-site.com/login and analyze security features"
2. Claude captures the login page and identifies:
   - Login form fields and validation
   - Security features (2FA, captcha, etc.)
   - Potential vulnerabilities
   - Recommended security improvements
```

### Competitive Analysis Workflow
```
1. "Screenshot competitor pricing pages and compare with our current layout"
2. Claude analyzes:
   - Pricing presentation strategies
   - Design patterns and UX flows
   - Call-to-action placement
   - Value proposition messaging
```

### Quality Assurance Workflow
```
1. "Take screenshots of our checkout flow before deployment"
2. After deployment: "Compare new screenshots with the previous ones"
3. Claude identifies:
   - Visual differences and regressions
   - Layout improvements or issues
   - User experience impact
```

## 🔧 Technical Advantages

- **Automated Visual Intelligence**: No manual screenshot analysis required
- **Scalable Documentation**: Capture and analyze hundreds of pages efficiently
- **Intelligent Optimization**: Automatic image compression without quality loss
- **Persistent Storage**: Organized archive for historical comparison
- **Integration Ready**: Works seamlessly with existing MCP-compatible workflows

## 🎪 Demo Scenarios

### "Netflix Login Analysis"
```
User: "Take a screenshot of Netflix.com and analyze the login experience"
Result: Claude captures the page, identifies login options, analyzes UX patterns, 
and provides insights on conversion optimization
```

### "Security Posture Assessment"
```
User: "Screenshot the admin panel at admin.example.com and evaluate security"
Result: Claude captures the interface, identifies security controls, flags potential 
issues, and recommends improvements
```

### "Design System Audit"
```
User: "Take screenshots of our main pages and analyze design consistency"
Result: Claude captures multiple pages, compares design patterns, identifies 
inconsistencies, and suggests standardization opportunities
```

## 🌍 Perfect For

- **Security Professionals** conducting web application assessments
- **UX/UI Designers** researching and analyzing web interfaces  
- **Digital Marketers** monitoring competitive landscapes
- **QA Engineers** documenting and comparing visual states
- **Product Managers** analyzing user experiences and flows
- **Web Developers** creating visual documentation and testing
- **Compliance Teams** generating visual evidence and reports

## 🚀 Get Started

Transform your web analysis workflow with AI-powered visual intelligence. The Screenshot MCP Server bridges the gap between automated capture and intelligent analysis, making every screenshot a source of actionable insights.

*Ready to see the web through AI eyes?* 

<img width="732" alt="image" src="https://github.com/user-attachments/assets/2e1458e4-5916-4cc8-8e9b-fee814bc66a8" />

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
