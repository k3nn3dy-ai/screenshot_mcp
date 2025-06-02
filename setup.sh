#!/bin/bash

set -e

echo "🔧 Setting up Screenshot MCP Server..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js (v18+) first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

# Check if Go is installed
if ! command -v go &> /dev/null; then
    echo "❌ Go is not installed. Please install Go first to install gowitness."
    exit 1
fi

# Install gowitness if not already installed
if ! command -v gowitness &> /dev/null; then
    echo "📦 Installing gowitness (requires Go 1.24+)..."
    GOTOOLCHAIN=go1.24.0 go install github.com/sensepost/gowitness@latest
    if ! command -v gowitness &> /dev/null; then
        echo "❌ gowitness installation failed. Make sure \$GOPATH/bin is in your \$PATH"
        echo "💡 Try: export PATH=\$PATH:\$HOME/go/bin"
        exit 1
    fi
    echo "✅ gowitness installed successfully"
else
    echo "✅ gowitness is already installed"
fi

# Install npm dependencies
echo "📦 Installing npm dependencies..."
npm install

# Build the project
echo "🔨 Building the project..."
npm run build

# Get the current directory
CURRENT_DIR=$(pwd)

# Create Claude Desktop config
echo "📝 Creating Claude Desktop configuration..."
CLAUDE_CONFIG_DIR="$HOME/Library/Application Support/Claude"
CLAUDE_CONFIG_FILE="$CLAUDE_CONFIG_DIR/claude_desktop_config.json"

# Create directory if it doesn't exist
mkdir -p "$CLAUDE_CONFIG_DIR"

# Check if config file exists
if [ -f "$CLAUDE_CONFIG_FILE" ]; then
    echo "⚠️  Claude Desktop config file already exists at:"
    echo "   $CLAUDE_CONFIG_FILE"
    echo ""
    echo "Please manually add the following configuration:"
    echo ""
    echo "{"
    echo "  \"mcpServers\": {"
    echo "    \"screenshot-server\": {"
    echo "      \"command\": \"node\","
    echo "      \"args\": [\"$CURRENT_DIR/dist/index.js\"],"
    echo "      \"cwd\": \"$CURRENT_DIR\""
    echo "    }"
    echo "  }"
    echo "}"
    echo ""
    echo "If you already have other MCP servers configured, add the screenshot-server"
    echo "entry to your existing mcpServers object."
else
    # Create new config file
    cat > "$CLAUDE_CONFIG_FILE" << EOF
{
  "mcpServers": {
    "screenshot-server": {
      "command": "node",
      "args": ["$CURRENT_DIR/dist/index.js"],
      "cwd": "$CURRENT_DIR"
    }
  }
}
EOF
    echo "✅ Claude Desktop configuration created at:"
    echo "   $CLAUDE_CONFIG_FILE"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Restart Claude Desktop if it's running"
echo "2. You should now have access to screenshot tools in Claude Desktop"
echo ""
echo "🚀 Available tools:"
echo "- take_screenshot: Take a screenshot of any website"
echo "- view_screenshot: View and analyze any screenshot by ID"
echo "- list_screenshots: List all taken screenshots"
echo "- get_screenshot_info: Get details about a specific screenshot"
echo ""
echo "🎯 NEW: Claude can now view and analyze screenshots directly!"
echo ""
echo "📝 Example usage in Claude Desktop:"
echo "\"Take a screenshot of https://github.com/sensepost/gowitness and show me the image\""
echo "\"View screenshot ID [your-screenshot-id] and analyze the website design\""
echo "\"Screenshot https://www.synack.com and look for login information\""
echo ""
echo "💡 Features:"
echo "- Visual website analysis and UI/UX feedback"
echo "- Security element identification"
echo "- Login form and navigation detection"
echo "- Design comparison and recommendations" 