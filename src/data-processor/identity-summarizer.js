// src/data-processor/identity-summarizer.js
class IdentitySummarizer {
    constructor() {
        this.visits = 0;
        this.paths = new Map();
        this.userAgent = null;
        this.identity = null;
    }

    process(logEntry) {
        if (logEntry.type !== 'event:visit' || !logEntry.tags || !logEntry.tags.identity) {
            return false;
        }

        this.visits++;
        this.identity = logEntry.tags.identity;

        // Capture user agent from the first entry
        if (!this.userAgent && logEntry.userAgent) {
            this.userAgent = logEntry.userAgent;
        }

        // Track path usage
        const path = (logEntry.meta && logEntry.meta.path) || '/';
        this.paths.set(path, (this.paths.get(path) || 0) + 1);

        return true;
    }

    getSummary() {
        return {
            identity: this.identity,
            totalVisits: this.visits,
            userAgent: this.userAgent,
            mostFrequentPaths: Array.from(this.paths.entries())
                .sort(([, a], [, b]) => b - a)
                .slice(0, 5)
                .map(([path, count]) => ({ path, count }))
        };
    }
}

module.exports = IdentitySummarizer;
