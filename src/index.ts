#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { exec } from 'child_process';
import { promisify } from 'util';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs-extra';
import * as path from 'path';
import * as os from 'os';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const execAsync = promisify(exec);

class ScreenshotMCPServer {
  private server: Server;
  private screenshotsDir: string;
  private dbPath: string;
  private gowitnessBinary: string | null = null;

  constructor() {
    this.server = new Server(
      {
        name: 'screenshot-mcp-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
          resources: {},
        },
      }
    );

    // Set up directories - use script directory as base instead of process.cwd()
    const scriptDir = this.getScriptDirectory();
    const projectRoot = path.dirname(scriptDir); // Go up one level from dist/ to project root
    this.screenshotsDir = path.join(projectRoot, 'screenshots');
    this.dbPath = path.join(projectRoot, 'screenshots.db');
    
    console.error(`Script directory: ${scriptDir}`);
    console.error(`Project root: ${projectRoot}`);
    console.error(`Process working directory: ${process.cwd()}`);
    console.error(`Screenshots directory: ${this.screenshotsDir}`);
    console.error(`Database path: ${this.dbPath}`);
    
    this.setupHandlers();
    this.setupDirectories();
  }

  private getScriptDirectory(): string {
    // Get the directory where this script is located
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    return __dirname;
  }

  private async setupDirectories(): Promise<void> {
    try {
      await fs.ensureDir(this.screenshotsDir);
      console.error(`Successfully created screenshots directory: ${this.screenshotsDir}`);
    } catch (error) {
      console.error(`Failed to create screenshots directory: ${error}`);
      throw error;
    }
  }

  private async findGowitness(): Promise<string> {
    if (this.gowitnessBinary) {
      return this.gowitnessBinary;
    }

    // Common locations where gowitness might be installed
    const possiblePaths = [
      'gowitness', // In PATH
      path.join(os.homedir(), 'go', 'bin', 'gowitness'),
      path.join(process.env.GOPATH || path.join(os.homedir(), 'go'), 'bin', 'gowitness'),
      '/usr/local/bin/gowitness',
      '/opt/homebrew/bin/gowitness',
    ];

    for (const binPath of possiblePaths) {
      try {
        await execAsync(`${binPath} --help`);
        this.gowitnessBinary = binPath;
        console.error(`Found gowitness at: ${binPath}`);
        return binPath;
      } catch (error) {
        // Continue trying other paths
      }
    }

    throw new Error(`gowitness is not installed or not found in common locations. 
Please install gowitness with: GOTOOLCHAIN=go1.24.0 go install github.com/sensepost/gowitness@latest
Or add the gowitness binary to your PATH.

Searched in:
${possiblePaths.map(p => `  - ${p}`).join('\n')}`);
  }

  private setupHandlers(): void {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: 'take_screenshot',
          description: 'Take a screenshot of a website using gowitness',
          inputSchema: {
            type: 'object',
            properties: {
              url: {
                type: 'string',
                description: 'The URL to take a screenshot of',
              },
              width: {
                type: 'number',
                description: 'Screenshot width in pixels (default: 1200)',
                default: 1200,
              },
              height: {
                type: 'number',
                description: 'Screenshot height in pixels (default: 800)',
                default: 800,
              },
              delay: {
                type: 'number',
                description: 'Delay in seconds before taking screenshot (default: 3)',
                default: 3,
              },
              timeout: {
                type: 'number',
                description: 'Timeout in seconds (default: 10)',
                default: 10,
              },
              include_image: {
                type: 'boolean',
                description: 'Whether to include the image data in the response for immediate viewing (default: false)',
                default: false,
              },
              optimize: {
                type: 'boolean',
                description: 'Whether to optimize the image for viewing (reduces file size, default: true)',
                default: true,
              },
              quality: {
                type: 'number',
                description: 'Image quality for optimization (1-100, default: 80)',
                default: 80,
                minimum: 1,
                maximum: 100,
              },
              format: {
                type: 'string',
                description: 'Output format for optimized images (jpeg, png, webp, default: jpeg)',
                enum: ['jpeg', 'png', 'webp'],
                default: 'jpeg',
              },
            },
            required: ['url'],
          },
        },
        {
          name: 'list_screenshots',
          description: 'List all screenshots taken with their metadata',
          inputSchema: {
            type: 'object',
            properties: {
              limit: {
                type: 'number',
                description: 'Maximum number of screenshots to return (default: 50)',
                default: 50,
              },
            },
          },
        },
        {
          name: 'get_screenshot_info',
          description: 'Get detailed information about a specific screenshot',
          inputSchema: {
            type: 'object',
            properties: {
              screenshot_id: {
                type: 'string',
                description: 'The unique ID of the screenshot',
              },
            },
            required: ['screenshot_id'],
          },
        },
        {
          name: 'view_screenshot',
          description: 'View a screenshot image by its ID - returns the image for analysis',
          inputSchema: {
            type: 'object',
            properties: {
              screenshot_id: {
                type: 'string',
                description: 'The unique ID of the screenshot to view',
              },
              optimize: {
                type: 'boolean',
                description: 'Whether to optimize the image for viewing (reduces file size, default: true)',
                default: true,
              },
              quality: {
                type: 'number',
                description: 'Image quality for optimization (1-100, default: 80)',
                default: 80,
                minimum: 1,
                maximum: 100,
              },
              format: {
                type: 'string',
                description: 'Output format for optimized images (jpeg, png, webp, default: jpeg)',
                enum: ['jpeg', 'png', 'webp'],
                default: 'jpeg',
              },
            },
            required: ['screenshot_id'],
          },
        },
      ],
    }));

    this.server.setRequestHandler(ListResourcesRequestSchema, async () => ({
      resources: [
        {
          uri: 'file://screenshots.db',
          name: 'Screenshots Database',
          description: 'SQLite database containing screenshot metadata',
          mimeType: 'application/x-sqlite3',
        },
      ],
    }));

    this.server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
      if (request.params.uri === 'file://screenshots.db') {
        try {
          const dbContent = await fs.readFile(this.dbPath);
          return {
            contents: [{
              uri: request.params.uri,
              mimeType: 'application/x-sqlite3',
              blob: dbContent.toString('base64'),
            }],
          };
        } catch (error) {
          return {
            contents: [{
              uri: request.params.uri,
              mimeType: 'text/plain',
              text: 'Database not found. Take a screenshot first.',
            }],
          };
        }
      }
      
      throw new Error(`Unknown resource: ${request.params.uri}`);
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      switch (request.params.name) {
        case 'take_screenshot':
          return await this.takeScreenshot(request.params.arguments);
        case 'list_screenshots':
          return await this.listScreenshots(request.params.arguments);
        case 'get_screenshot_info':
          return await this.getScreenshotInfo(request.params.arguments);
        case 'view_screenshot':
          return await this.viewScreenshot(request.params.arguments);
        default:
          throw new Error(`Unknown tool: ${request.params.name}`);
      }
    });
  }

  private async takeScreenshot(args: any): Promise<any> {
    try {
      const gowitnessBin = await this.findGowitness();

      const {
        url,
        width = 1200,
        height = 800,
        delay = 3,
        timeout = 10,
        include_image = false,
        optimize = true,
        quality = 80,
        format = 'jpeg',
      } = args;

      if (!url) {
        throw new Error('URL is required');
      }

      // Generate unique ID and timestamp
      const screenshotId = uuidv4();
      const timestamp = new Date().toISOString();
      const datePrefix = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
      
      // Create date-specific directory
      const dateDir = path.join(this.screenshotsDir, datePrefix);
      await fs.ensureDir(dateDir);

      // Use gowitness to take screenshot with database storage
      const command = [
        `"${gowitnessBin}"`,
        'scan', 'single',
        '-u', `"${url}"`,
        '--write-db',
        '--write-db-uri', `"sqlite://${this.dbPath}"`,
        '--screenshot-path', `"${dateDir}"`,
        '--screenshot-format', 'png',
        '--chrome-window-x', width.toString(),
        '--chrome-window-y', height.toString(),
        '--delay', delay.toString(),
        '--timeout', timeout.toString(),
        '--quiet'
      ].join(' ');

      console.error(`Executing: ${command}`);
      const { stdout, stderr } = await execAsync(command);

      // Find the generated screenshot file
      const files = await fs.readdir(dateDir);
      const pngFiles = files.filter((f: string) => f.endsWith('.png'));
      
      if (pngFiles.length === 0) {
        throw new Error('Screenshot was not generated successfully');
      }

      // Get the most recent screenshot (should be the one we just created)
      const screenshotFile = pngFiles[pngFiles.length - 1];
      const screenshotPath = path.join(dateDir, screenshotFile);
      
      // Rename file to include our unique ID
      const newFileName = `${screenshotId}_${screenshotFile}`;
      const newPath = path.join(dateDir, newFileName);
      await fs.rename(screenshotPath, newPath);

      // Get file stats
      const stats = await fs.stat(newPath);
      const fileSize = stats.size;

      if (include_image) {
        let imageBuffer: Buffer;
        let mimeType: string;
        
        if (optimize) {
          imageBuffer = await this.optimizeImage(newPath, {
            quality,
            format: format as 'jpeg' | 'png' | 'webp'
          });
          mimeType = `image/${format}`;
        } else {
          imageBuffer = await fs.readFile(newPath);
          mimeType = 'image/png';
        }
        
        return {
          content: [{
            type: 'image',
            data: imageBuffer.toString('base64'),
            mimeType: mimeType,
          }, {
            type: 'text',
            text: JSON.stringify({
              success: true,
              screenshot_id: screenshotId,
              url: url,
              timestamp: timestamp,
              file_path: newPath,
              file_name: newFileName,
              file_size: fileSize,
              optimized_size: optimize ? imageBuffer.length : fileSize,
              optimization_ratio: optimize ? `${((imageBuffer.length / fileSize) * 100).toFixed(1)}%` : '100%',
              width: width,
              height: height,
              delay: delay,
              timeout: timeout,
              format: optimize ? format : 'png',
              quality: optimize ? quality : 100,
              message: `Screenshot taken successfully for ${url} and ${optimize ? 'optimized ' : ''}image included for viewing`,
            }, null, 2),
          }],
        };
      }

      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            success: true,
            screenshot_id: screenshotId,
            url: url,
            timestamp: timestamp,
            file_path: newPath,
            file_name: newFileName,
            file_size: fileSize,
            width: width,
            height: height,
            delay: delay,
            timeout: timeout,
            message: `Screenshot taken successfully for ${url}`,
          }, null, 2),
        }],
      };

    } catch (error) {
      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error occurred',
          }, null, 2),
        }],
      };
    }
  }

  private async listScreenshots(args: any): Promise<any> {
    try {
      const { limit = 50 } = args;

      // Check if database exists
      if (!await fs.pathExists(this.dbPath)) {
        return {
          content: [{
            type: 'text',
            text: JSON.stringify({
              success: true,
              screenshots: [],
              message: 'No screenshots found. Take a screenshot first.',
            }, null, 2),
          }],
        };
      }

      // Use gowitness to list screenshots from database
      const gowitnessBin = await this.findGowitness();
      const command = `"${gowitnessBin}" report list --write-db-uri "sqlite://${this.dbPath}" --limit ${limit}`;
      
      let stdout = '';
      try {
        const result = await execAsync(command);
        stdout = result.stdout;
      } catch (error) {
        console.error('Failed to get database report:', error);
        stdout = 'Database report unavailable';
      }

      // Also get screenshots from filesystem
      const screenshots: any[] = [];
      const dateDirs = await fs.readdir(this.screenshotsDir);
      
      for (const dateDir of dateDirs) {
        const datePath = path.join(this.screenshotsDir, dateDir);
        const stat = await fs.stat(datePath);
        
        if (stat.isDirectory()) {
          const files = await fs.readdir(datePath);
          const pngFiles = files.filter((f: string) => f.endsWith('.png'));
          
          for (const file of pngFiles) {
            const filePath = path.join(datePath, file);
            const fileStats = await fs.stat(filePath);
            
            // Extract ID from filename if present
            const idMatch = file.match(/^([0-9a-f-]{36})_/);
            const screenshotId = idMatch ? idMatch[1] : 'unknown';
            
            screenshots.push({
              screenshot_id: screenshotId,
              file_name: file,
              file_path: filePath,
              date: dateDir,
              size: fileStats.size,
              created: fileStats.birthtime.toISOString(),
              modified: fileStats.mtime.toISOString(),
            });
          }
        }
      }

      // Sort by creation date (newest first)
      screenshots.sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime());

      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            success: true,
            count: screenshots.length,
            screenshots: screenshots.slice(0, limit),
            database_output: stdout,
          }, null, 2),
        }],
      };

    } catch (error) {
      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error occurred',
          }, null, 2),
        }],
      };
    }
  }

  private async getScreenshotInfo(args: any): Promise<any> {
    try {
      const { screenshot_id } = args;

      if (!screenshot_id) {
        throw new Error('screenshot_id is required');
      }

      // Find the screenshot file
      const dateDirs = await fs.readdir(this.screenshotsDir);
      let foundFile: string | null = null;
      let foundPath: string | null = null;

      for (const dateDir of dateDirs) {
        const datePath = path.join(this.screenshotsDir, dateDir);
        const stat = await fs.stat(datePath);
        
        if (stat.isDirectory()) {
          const files = await fs.readdir(datePath);
          const matchingFile = files.find((f: string) => f.startsWith(screenshot_id));
          
          if (matchingFile) {
            foundFile = matchingFile;
            foundPath = path.join(datePath, matchingFile);
            break;
          }
        }
      }

      if (!foundFile || !foundPath) {
        throw new Error(`Screenshot with ID ${screenshot_id} not found`);
      }

      const stats = await fs.stat(foundPath);
      
      // Try to get info from database if available
      let dbInfo: string | null = null;
      if (await fs.pathExists(this.dbPath)) {
        try {
          const gowitnessBin = await this.findGowitness();
          const command = `"${gowitnessBin}" report list --write-db-uri "sqlite://${this.dbPath}" | grep -i "${screenshot_id}" || echo "Not found in database"`;
          const { stdout } = await execAsync(command);
          dbInfo = stdout.trim();
        } catch (error) {
          dbInfo = 'Could not retrieve from database';
        }
      }

      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            success: true,
            screenshot_id: screenshot_id,
            file_name: foundFile,
            file_path: foundPath,
            file_size: stats.size,
            created: stats.birthtime.toISOString(),
            modified: stats.mtime.toISOString(),
            database_info: dbInfo,
          }, null, 2),
        }],
      };

    } catch (error) {
      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error occurred',
          }, null, 2),
        }],
      };
    }
  }

  private async viewScreenshot(args: any): Promise<any> {
    try {
      const { screenshot_id, optimize = true, quality = 80, format = 'jpeg' } = args;

      if (!screenshot_id) {
        throw new Error('screenshot_id is required');
      }

      // Find the screenshot file
      const dateDirs = await fs.readdir(this.screenshotsDir);
      let foundFile: string | null = null;
      let foundPath: string | null = null;

      for (const dateDir of dateDirs) {
        const datePath = path.join(this.screenshotsDir, dateDir);
        const stat = await fs.stat(datePath);
        
        if (stat.isDirectory()) {
          const files = await fs.readdir(datePath);
          const matchingFile = files.find((f: string) => f.startsWith(screenshot_id));
          
          if (matchingFile) {
            foundFile = matchingFile;
            foundPath = path.join(datePath, matchingFile);
            break;
          }
        }
      }

      if (!foundFile || !foundPath) {
        throw new Error(`Screenshot with ID ${screenshot_id} not found`);
      }

      let imageBuffer = await fs.readFile(foundPath);
      const stats = await fs.stat(foundPath);
      let mimeType = 'image/png';
      
      if (optimize) {
        imageBuffer = await this.optimizeImage(foundPath, {
          quality,
          format: format as 'jpeg' | 'png' | 'webp'
        });
        mimeType = `image/${format}`;
      }

      return {
        content: [{
          type: 'image',
          data: imageBuffer.toString('base64'),
          mimeType: mimeType,
        }, {
          type: 'text',
          text: JSON.stringify({
            success: true,
            screenshot_id: screenshot_id,
            file_name: foundFile,
            file_path: foundPath,
            file_size: stats.size,
            optimized_size: optimize ? imageBuffer.length : stats.size,
            optimization_ratio: optimize ? `${((imageBuffer.length / stats.size) * 100).toFixed(1)}%` : '100%',
            format: optimize ? format : 'png',
            quality: optimize ? quality : 100,
            message: `Screenshot ${screenshot_id} loaded successfully${optimize ? ' and optimized' : ''}`,
          }, null, 2),
        }],
      };

    } catch (error) {
      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error occurred',
          }, null, 2),
        }],
      };
    }
  }

  private async optimizeImage(imagePath: string, options: {
    quality?: number;
    maxWidth?: number;
    maxHeight?: number;
    format?: 'jpeg' | 'png' | 'webp';
  } = {}): Promise<Buffer> {
    const {
      quality = 80,
      maxWidth = 1200,
      maxHeight = 800,
      format = 'jpeg'
    } = options;

    const image = sharp(imagePath);
    const metadata = await image.metadata();
    
    console.error(`Original image: ${metadata.width}x${metadata.height}, ${metadata.size} bytes, format: ${metadata.format}`);

    let pipeline = image;

    // Resize if image is larger than max dimensions
    if (metadata.width && metadata.height) {
      if (metadata.width > maxWidth || metadata.height > maxHeight) {
        pipeline = pipeline.resize(maxWidth, maxHeight, {
          fit: 'inside',
          withoutEnlargement: true
        });
      }
    }

    // Convert and compress
    switch (format) {
      case 'jpeg':
        pipeline = pipeline.jpeg({ quality, mozjpeg: true });
        break;
      case 'webp':
        pipeline = pipeline.webp({ quality });
        break;
      case 'png':
        pipeline = pipeline.png({ compressionLevel: 8 });
        break;
    }

    const optimizedBuffer = await pipeline.toBuffer();
    console.error(`Optimized image: ${optimizedBuffer.length} bytes (${((optimizedBuffer.length / (metadata.size || 1)) * 100).toFixed(1)}% of original)`);
    
    return optimizedBuffer;
  }

  async run(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Screenshot MCP server running on stdio');
  }
}

const server = new ScreenshotMCPServer();
server.run().catch(console.error); 