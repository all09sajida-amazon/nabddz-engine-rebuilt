// src/core/core-connector.js

const { NanoSpiderCore } = require('../nano/core'); // NanoSpiderCore is assumed to be exported from core.js
const IdentitySummarizer = require('../data-processor/identity-summarizer');
const MoodAnalyser = require('../data-processor/mood-analyser');

/**
 * CoreConnector handles the initialization of the Nano Spider Kernel
 * and integrates data analysis components (M4) with the core logic (M3).
 */
class CoreConnector {
    constructor() {
        this.kernel = new NanoSpiderCore();
        this.identitySummarizer = new IdentitySummarizer();
        this.moodAnalyser = new MoodAnalyser();
        console.log("CoreConnector initialized with M3/M4 components.");
    }

    /**
     * Simulates initialization and starts listening to core events.
     */
    initialize() {
        // Example: Listen for Mood signals and process them in real-time
        this.kernel.eventBus.on('signal:mood', (logEntry) => {
            this.moodAnalyser.process(logEntry);
            console.log(`[Mood] Processed entry. Current dominant mood: ${this.moodAnalyser.getSummary().dominantMood}`);
        });

        // Example: Listen for Visit events and process identity data
        this.kernel.eventBus.on('event:visit', (logEntry) => {
            this.identitySummarizer.process(logEntry);
            console.log(`[Identity] Processed visit. Total visits: ${this.identitySummarizer.getSummary().totalVisits}`);
        });

        this.kernel.startBootstrap();
    }

    getKernelStatus() {
        return {
            status: this.kernel.getStatus(),
            moodSummary: this.moodAnalyser.getSummary(),
            identitySummary: this.identitySummarizer.getSummary()
        };
    }
}

module.exports = CoreConnector;
