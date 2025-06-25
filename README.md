# Spark.js Demos

Interactive demonstrations showcasing the power of Spark.js - an advanced 3D Gaussian Splatting renderer for THREE.js.

## ✨ About Spark.js

Spark.js is a cutting-edge 3D rendering library that brings Gaussian Splatting technology to the web. It integrates seamlessly with THREE.js to provide:

- **🎯 High-Quality Rendering** - Photorealistic 3D scenes with minimal artifacts
- **⚡ Real-Time Performance** - Optimized for smooth 60fps rendering
- **📱 Cross-Platform** - Works on desktop, mobile, and VR devices
- **🔄 Dynamic Content** - Real-time editing and animation of splat objects
- **🎨 Multiple Formats** - Support for .PLY, .SPZ, .SPLAT, .KSPLAT files

## 🚀 Live Demos

This repository contains interactive demonstrations of Spark.js capabilities:

### Available Demos

- **🦋 Butterfly Demo** - A beautiful butterfly rendered with Gaussian splatting
- **🐉 Dragon Demo** - A detailed dragon model showcasing splat rendering
- **🚗 Car Demo** - A realistic car model with splat-based rendering
- **🐰 Stanford Bunny** - The classic Stanford bunny in splat format

### Interactive Features

- **Mouse/Touch Controls** - Rotate and explore 3D models
- **Real-time Rendering** - Smooth 60fps performance
- **Responsive Design** - Works on all screen sizes
- **Modal Viewing** - Full-screen demo experience

## 🛠️ Quick Start

### Prerequisites

- Modern web browser with WebGL2 support
- Node.js (for development)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/sparkjsdev/spark.git
cd spark
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser to `http://localhost:3000`

## 📁 Project Structure

```
src/
├── index.html              # Main demo page
├── styles/
│   └── main.css           # Modern styling and animations
├── js/
│   └── main.js            # Demo application logic
└── assets/                # Demo assets (if any)
```

## 🎯 How It Works

### Core Technology

Spark.js uses **Gaussian Splatting**, a revolutionary 3D rendering technique that:

1. **Represents 3D objects** as millions of tiny, colored spheres (splats)
2. **Renders in real-time** using advanced GPU shaders
3. **Maintains quality** while being highly performant
4. **Supports animation** and real-time editing

### Demo Implementation

Each demo showcases different aspects of Spark.js:

```javascript
// Basic setup
import * as THREE from "three";
import { SplatMesh } from "@sparkjsdev/spark";

// Create scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, aspect, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();

// Load splat model
const splatMesh = new SplatMesh({ url: "model.spz" });
scene.add(splatMesh);

// Render loop
renderer.setAnimationLoop(() => {
    renderer.render(scene, camera);
});
```

## 🎨 Features

### Interactive Controls

- **Mouse Drag** - Rotate the 3D model
- **Touch Gestures** - Mobile-friendly interaction
- **Auto-rotation** - Smooth continuous rotation
- **Responsive** - Adapts to window resizing

### Visual Effects

- **Realistic Lighting** - Ambient and directional lighting
- **Smooth Animations** - 60fps rendering
- **High Quality** - Anti-aliasing and proper depth testing
- **Modern UI** - Clean, responsive design

## 📱 Browser Support

Spark.js demos work on:

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile browsers with WebGL2 support

## 🔧 Development

### Available Scripts

- `npm start` - Start development server with http-server
- `npm run dev` - Start development server with live-server (auto-reload)
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run lint` - Run linting

### Adding New Demos

1. Add demo information to `getDemoInfo()` in `main.js`
2. Add splat URL to `splatURLs` object
3. Create demo card in HTML
4. Test with different splat files

### Customization

- **Colors** - Modify CSS variables in `main.css`
- **Layout** - Update HTML structure
- **Interactions** - Extend `SparkDemoApp` class
- **Effects** - Add custom THREE.js effects

## 📚 Documentation

For detailed documentation about Spark.js:

- [Official Documentation](https://sparkjs.dev/)
- [API Reference](https://sparkjs.dev/api/)
- [Examples](https://sparkjs.dev/examples/)
- [GitHub Repository](https://github.com/sparkjsdev/spark)

## 🤝 Contributing

We welcome contributions! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

### Development Guidelines

- Follow existing code style
- Add comments for complex logic
- Test on multiple browsers
- Ensure mobile compatibility
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Spark.js Team](https://github.com/sparkjsdev) for the amazing 3D rendering library
- [THREE.js](https://threejs.org/) for the 3D graphics framework
- [Gaussian Splatting](https://repo-sam.inria.fr/fungraph/3d-gaussian-splatting/) research community

## 📞 Support

- **Documentation**: [https://sparkjs.dev/](https://sparkjs.dev/)
- **Issues**: [GitHub Issues](https://github.com/sparkjsdev/spark/issues)
- **Discussions**: [GitHub Discussions](https://github.com/sparkjsdev/spark/discussions)

---

Built with ⚡ Spark.js and ❤️ by the community
