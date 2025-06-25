// Import libraries using importmap aliases
import * as THREE from "three";
import { SplatMesh } from "@sparkjsdev/spark";

class SparkDemoApp {
    constructor() {
        this.currentDemo = null;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.hasRunDemo = false; // Track if we've run a demo before
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupNavigation();
        this.initializeComponents();
    }

    setupEventListeners() {
        // Setup demo buttons
        const demoButtons = document.querySelectorAll('.demo-card');
        demoButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                // Don't trigger if clicking on the button inside the card
                if (e.target.classList.contains('demo-btn')) {
                    const demoId = button.dataset.demo;
                    if (demoId) {
                        this.openDemo(demoId);
                    }
                }
            });
        });

        // Also bind directly to demo buttons
        const demoBtns = document.querySelectorAll('.demo-btn');
        demoBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const demoCard = btn.closest('.demo-card');
                if (demoCard) {
                    const demoId = demoCard.dataset.demo;
                    if (demoId) {
                        this.openDemo(demoId);
                    }
                }
            });
        });

        // Setup modal close button
        const closeBtn = document.getElementById('modalClose');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.closeDemo();
            });
        }

        // Setup hero buttons with null checks
        const getStartedBtn = document.getElementById('getStartedBtn');
        if (getStartedBtn) {
            getStartedBtn.addEventListener('click', () => {
                this.scrollToSection('demos');
            });
        }

        const learnMoreBtn = document.getElementById('learnMoreBtn');
        if (learnMoreBtn) {
            learnMoreBtn.addEventListener('click', () => {
                this.scrollToSection('docs');
            });
        }
    }

    setupNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href.startsWith('#')) {
                    e.preventDefault();
                    const target = href.substring(1);
                    this.scrollToSection(target);
                    
                    // Update active state
                    navLinks.forEach(l => l.classList.remove('active'));
                    link.classList.add('active');
                }
            });
        });

        // Update active nav on scroll
        window.addEventListener('scroll', () => {
            this.updateActiveNav();
        });
    }

    scrollToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
    }

    updateActiveNav() {
        const sections = ['home', 'features', 'demos', 'docs'];
        const navLinks = document.querySelectorAll('.nav-link');
        
        let currentSection = 'home';
        const scrollPosition = window.scrollY + 100;

        sections.forEach(sectionId => {
            const section = document.getElementById(sectionId);
            if (section) {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                
                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    currentSection = sectionId;
                }
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }

    initializeComponents() {
        // Add loading animation to elements
        const elements = document.querySelectorAll('.feature-card, .demo-card');
        elements.forEach((el, index) => {
            el.style.animationDelay = `${index * 0.1}s`;
            el.classList.add('loading');
        });

        // Initialize spark animation
        this.initSparkAnimation();
    }

    initSparkAnimation() {
        const particles = document.querySelectorAll('.spark-particle');
        particles.forEach((particle, index) => {
            particle.style.animationDelay = `${index * 0.5}s`;
        });
    }

    async openDemo(demoId) {
        console.log(`🚀 Opening demo: ${demoId}`);
        
        // 🎯 RADICAL SOLUTION: If we've already run a demo, refresh the page
        if (this.hasRunDemo) {
            console.log('🔄 Demo already run before, refreshing page for clean state...');
            // Store the demo ID in sessionStorage so we can auto-open it after refresh
            sessionStorage.setItem('autoOpenDemo', demoId);
            window.location.reload();
            return;
        }

        // Clean up any existing demo first
        this.cleanupDemo();

        const modal = document.getElementById('demoModal');
        const modalTitle = document.getElementById('modalTitle');
        const demoContainer = document.getElementById('demoContainer');

        // Set modal title based on demo
        const demoInfo = this.getDemoInfo(demoId);
        modalTitle.textContent = demoInfo.title;

        // Show modal
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';

        // Show simple loading state
        demoContainer.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: center; height: 100%; color: white;">
                <div style="text-align: center;">
                    <div class="loading-spinner"></div>
                    <h3>Loading Demo...</h3>
                </div>
            </div>
        `;

        // Initialize demo directly in container (like working version)
        try {
            await new Promise(resolve => setTimeout(resolve, 300));
            this.initializeDemo(demoId, demoContainer);
            // Mark that we've run a demo
            this.hasRunDemo = true;
        } catch (error) {
            console.error('Failed to initialize demo:', error);
            demoContainer.innerHTML = `
                <div style="display: flex; align-items: center; justify-content: center; height: 100%; color: white;">
                    <div style="text-align: center;">
                        <h3>Demo Loading Error</h3>
                        <p>Failed to load the demo: ${error.message}</p>
                        <button class="btn btn-primary" onclick="location.reload()">Reload</button>
                    </div>
                </div>
            `;
        }
    }

    closeDemo() {
        console.log('🔒 Closing demo');
        this.cleanupDemo();
        
        const modal = document.getElementById('demoModal');
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    getDemoInfo(demoId) {
        const demos = {
            'basic-butterfly': {
                title: 'Butterfly Demo',
                description: 'A beautiful butterfly rendered with Gaussian splatting'
            },
            'multiple-splats': {
                title: 'Multiple Robot Heads Demo',
                description: 'Multiple robot head models demonstrating batch rendering'
            },
            'color-editing': {
                title: 'Cat Color Editing Demo',
                description: 'Interactive color editing of a cat model with splat-based rendering'
            },
            'animation': {
                title: 'Forge Animation Demo',
                description: 'Animated forge scene with dynamic splat effects'
            },
            'shader-graph': {
                title: 'Valley Shader Graph Demo',
                description: 'Advanced shader effects applied to a valley scene'
            },
            'multi-view': {
                title: 'Fireplace Multi-View Demo',
                description: 'Cozy fireplace scene with multi-viewpoint rendering'
            },
            'food-gallery': {
                title: 'Food Gallery Demo',
                description: 'Delicious food models with realistic lighting and materials'
            }
        };
        return demos[demoId] || { title: 'Demo', description: '3D Splat Demo' };
    }

    initializeDemo(demoId, container) {
        console.log(`🎯 Initializing demo: ${demoId}`);
        
        // Clear container
        container.innerHTML = '';

        // Create scene, camera, renderer (exactly like official hello-world)
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(container.clientWidth, container.clientHeight);
        container.appendChild(this.renderer.domElement);

        console.log('✅ THREE.js objects created');

        // Create splat mesh(es) based on demo type
        const splatMeshes = this.createSplatMeshes(demoId);

        // Add mouse/touch controls
        this.addControls();

        // Start animation loop (exactly like official example)
        this.renderer.setAnimationLoop((time) => {
            this.renderer.render(this.scene, this.camera);
            
            // Auto-rotate for visual appeal
            splatMeshes.forEach(splatMesh => {
                splatMesh.rotation.y += 0.01;
            });
        });

        // Store current demo info
        this.currentDemo = {
            demoId,
            splatMeshes
        };

        console.log('🎬 Animation loop started');
    }

    createSplatMeshes(demoId) {
        const splatURL = this.getSplatURL(demoId);
        const splatMeshes = [];

        switch (demoId) {
            case 'multiple-splats':
                // Create multiple robot heads
                for (let i = 0; i < 3; i++) {
                    const splatMesh = new SplatMesh({ url: splatURL });
                    splatMesh.position.set((i - 1) * 2, 0, -3);
                    splatMesh.scale.set(0.8, 0.8, 0.8);
                    this.scene.add(splatMesh);
                    splatMeshes.push(splatMesh);
                }
                break;
                
            case 'food-gallery':
                // Multiple food items
                const foodURLs = [
                    'https://sparkjs.dev/assets/splats/food/burger-from-amboy.spz',
                    'https://sparkjs.dev/assets/splats/food/gyro.spz',
                    'https://sparkjs.dev/assets/splats/food/pad-thai.spz'
                ];
                
                for (let i = 0; i < foodURLs.length; i++) {
                    const foodSplatMesh = new SplatMesh({ url: foodURLs[i] });
                    foodSplatMesh.position.set((i - 1) * 2.5, 0, -3);
                    foodSplatMesh.scale.set(0.8, 0.8, 0.8);
                    this.scene.add(foodSplatMesh);
                    splatMeshes.push(foodSplatMesh);
                }
                break;
                
            default:
                // Basic single splat (exactly like official hello-world)
                const splatMesh = new SplatMesh({ url: splatURL });
                splatMesh.quaternion.set(1, 0, 0, 0);
                splatMesh.position.set(0, 0, -3);
                this.scene.add(splatMesh);
                splatMeshes.push(splatMesh);
                break;
        }

        console.log(`📦 Created ${splatMeshes.length} splat mesh(es)`);
        return splatMeshes;
    }

    addControls() {
        // Simple mouse controls for rotation
        let isMouseDown = false;
        let mouseX = 0;
        let mouseY = 0;

        const canvas = this.renderer.domElement;

        canvas.addEventListener('mousedown', (e) => {
            isMouseDown = true;
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        canvas.addEventListener('mouseup', () => {
            isMouseDown = false;
        });

        canvas.addEventListener('mousemove', (e) => {
            if (isMouseDown && this.currentDemo) {
                const deltaX = e.clientX - mouseX;
                const deltaY = e.clientY - mouseY;
                
                this.currentDemo.splatMeshes.forEach(splatMesh => {
                    splatMesh.rotation.y += deltaX * 0.01;
                    splatMesh.rotation.x += deltaY * 0.01;
                });
                
                mouseX = e.clientX;
                mouseY = e.clientY;
            }
        });

        // Touch support for mobile
        canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            isMouseDown = true;
            mouseX = e.touches[0].clientX;
            mouseY = e.touches[0].clientY;
        }, { passive: false });

        canvas.addEventListener('touchend', () => {
            isMouseDown = false;
        }, { passive: true });

        canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            if (isMouseDown && this.currentDemo) {
                const deltaX = e.touches[0].clientX - mouseX;
                const deltaY = e.touches[0].clientY - mouseY;
                
                this.currentDemo.splatMeshes.forEach(splatMesh => {
                    splatMesh.rotation.y += deltaX * 0.01;
                    splatMesh.rotation.x += deltaY * 0.01;
                });
                
                mouseX = e.touches[0].clientX;
                mouseY = e.touches[0].clientY;
            }
        }, { passive: false });
    }

    getSplatURL(demoId) {
        const splatURLs = {
            'basic-butterfly': 'https://sparkjs.dev/assets/splats/butterfly.spz',
            'multiple-splats': 'https://sparkjs.dev/assets/splats/robot-head.spz',
            'color-editing': 'https://sparkjs.dev/assets/splats/cat.spz',
            'animation': 'https://sparkjs.dev/assets/splats/forge.spz',
            'shader-graph': 'https://sparkjs.dev/assets/splats/valley.spz',
            'multi-view': 'https://sparkjs.dev/assets/splats/fireplace.spz',
            'food-gallery': 'https://sparkjs.dev/assets/splats/food/burger-from-amboy.spz'
        };
        return splatURLs[demoId] || splatURLs['basic-butterfly'];
    }

    cleanupDemo() {
        console.log('🧹 Cleaning up demo...');
        
        // Stop animation loop first
        if (this.renderer) {
            this.renderer.setAnimationLoop(null);
            console.log('⏹️ Animation loop stopped');
        }

        // Dispose splat meshes properly using Spark.js dispose method
        if (this.currentDemo && this.currentDemo.splatMeshes) {
            console.log(`🗑️ Disposing ${this.currentDemo.splatMeshes.length} splat meshes`);
            this.currentDemo.splatMeshes.forEach(splatMesh => {
                if (this.scene) {
                    this.scene.remove(splatMesh);
                }
                // Call SplatMesh dispose (this calls packedSplats.dispose())
                if (splatMesh.dispose) {
                    splatMesh.dispose();
                }
            });
        }

        // Clear the container completely
        const container = document.getElementById('demoContainer');
        if (container) {
            container.innerHTML = '';
            console.log('🧹 Container cleared');
        }

        // Dispose renderer
        if (this.renderer) {
            this.renderer.dispose();
            console.log('🗑️ Renderer disposed');
        }

        // Clear scene
        if (this.scene) {
            this.scene.clear();
            console.log('🧹 Scene cleared');
        }

        // Reset all state
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.currentDemo = null;
        
        console.log('✅ Cleanup completed');
    }

    // Check if we should auto-open a demo after page refresh
    checkAutoOpenDemo() {
        const autoOpenDemo = sessionStorage.getItem('autoOpenDemo');
        if (autoOpenDemo) {
            console.log('🔄 Auto-opening demo after refresh:', autoOpenDemo);
            sessionStorage.removeItem('autoOpenDemo');
            // Wait for page to fully load, then open the demo
            setTimeout(() => {
                this.openDemo(autoOpenDemo);
            }, 500);
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            background: ${type === 'success' ? '#2ed573' : type === 'error' ? '#ff4757' : '#3742fa'};
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.sparkDemoApp = new SparkDemoApp();
    
    // Check for auto-open after refresh
    window.sparkDemoApp.checkAutoOpenDemo();
    
    // Show welcome notification
    setTimeout(() => {
        window.sparkDemoApp.showNotification('Welcome to Spark.js Demos! 🚀', 'success');
    }, 1000);
}); 