// src/main-client.js

// Import M5 components
const CoreConnector = require('./core/core-connector');
const DashboardRenderer = require('./ui/dashboard-renderer');

/**
 * Main client script for the Nabd Dz Engine.
 * This script runs in the browser and manages the connection between the kernel and the UI.
 */
class NabdClient {
    constructor() {
        this.connector = null;
        this.renderer = null;
        this.intervalId = null;
    }

    start() {
        // 1. Initialize the Core Connector (M3/M4 logic)
        this.connector = new CoreConnector();
        this.connector.initialize();

        // 2. Add the target element for the dashboard if it doesn't exist
        if (!document.getElementById('nabd-dashboard')) {
            const dashDiv = document.createElement('div');
            dashDiv.id = 'nabd-dashboard';
            document.body.appendChild(dashDiv);
        }

        // 3. Initialize the Dashboard Renderer
        this.renderer = new DashboardRenderer();

        // 4. Start updating the dashboard periodically
        this.updateDashboard();
        this.intervalId = setInterval(() => this.updateDashboard(), 3000); // Update every 3 seconds

        console.log("Nabd Client Engine started successfully.");
    }

    updateDashboard() {
        const statusData = this.connector.getKernelStatus();
        this.renderer.render(statusData);
    }
    
    stop() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
        console.log("Nabd Client Engine stopped.");
    }
}

// Global exposure to start the engine when the page is ready
document.addEventListener('DOMContentLoaded', () => {
    // Check if the engine is already running to prevent duplicates
    if (!window.NabdEngineInstance) {
        window.NabdEngineInstance = new NabdClient();
        window.NabdEngineInstance.start();
    }
});
