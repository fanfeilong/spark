# Spark.js Available Resources

This document lists all available 3D splat resources from the Spark.js library.

## 🎯 Splat Models (.spz)

### Main Models
- **butterfly.spz** - Beautiful butterfly model
- **robot-head.spz** - Detailed robot head
- **cat.spz** - Cute cat model
- **forge.spz** - Industrial forge scene
- **valley.spz** - Mountain valley landscape
- **fireplace.spz** - Cozy fireplace scene
- **butterfly-wings-closed.spz** - Butterfly with closed wings
- **butterfly-ai.spz** - AI-generated butterfly
- **snow-street.spz** - Snowy street scene
- **furry-logo-pedestal.spz** - Logo pedestal

### Food Models
- **burger-from-amboy.spz** - Delicious burger
- **gyro.spz** - Greek gyro
- **pad-thai.spz** - Thai pad thai
- **branzino-amarin.spz** - Fish dish
- **clams-and-caviar-by-ikoyi.spz** - Seafood dish
- **coral-caviar.spz** - Caviar dish
- **double-double-from-InNOut.spz** - In-N-Out burger
- **iberico-sandwich-by-reserve.spz** - Iberico sandwich
- **primerib-tamos.spz** - Prime rib
- **steaksandwich-mels.spz** - Steak sandwich
- **tomahawk-niku.spz** - Tomahawk steak

## 🎨 3D Models (.glb)
- **rubberduck.glb** - Classic rubber duck
- **table.glb** - Table model
- **arrow.glb** - Arrow model

## 🖼️ Images
- **butterfly.png** - Butterfly texture
- **sky.jpeg** - Sky background

## 📍 Resource URLs

All resources are hosted at: `https://sparkjs.dev/assets/`

### Splat Files
- Main splats: `https://sparkjs.dev/assets/splats/[filename].spz`
- Food splats: `https://sparkjs.dev/assets/splats/food/[filename].spz`

### 3D Models
- Models: `https://sparkjs.dev/assets/models/[filename].glb`

### Images
- Images: `https://sparkjs.dev/assets/images/[filename]`

## 🚀 Demo Usage

The current demos use the following models:

1. **Basic Butterfly** - `butterfly.spz`
2. **Multiple Robot Heads** - `robot-head.spz` (3 instances)
3. **Cat Color Editing** - `cat.spz` with enhanced lighting
4. **Forge Animation** - `forge.spz` with complex animations
5. **Valley Shader** - `valley.spz` with fog effects
6. **Fireplace Multi-View** - `fireplace.spz`
7. **Food Gallery** - Multiple food models (burger, gyro, pad thai)

## 🔧 Adding New Demos

To add a new demo with a different model:

1. Add the model URL to the `splatURLs` object in `src/js/main.js`
2. Add demo info to the `getDemoInfo()` function
3. Implement the demo logic in the `loadDemo()` method
4. Add the demo card to `src/index.html`
5. Add special animations in the `startAnimationLoop()` method

## 📊 Resource Statistics

- **Total Splat Models**: 21
- **Food Models**: 11
- **3D Models**: 3
- **Images**: 2
- **Total Resources**: 37

All resources are verified to be accessible and working. 