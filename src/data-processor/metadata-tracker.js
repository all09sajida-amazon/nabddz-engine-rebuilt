// src/data-processor/metadata-tracker.js
class MetadataTracker {
    constructor() {
        this.languageUsage = new Map();
        this.pageViews = new Map();
        this.totalMetaEntries = 0;
    }

    process(logEntry) {
        if (!logEntry.meta) {
            return false;
        }

        this.totalMetaEntries++;
        const meta = logEntry.meta;

        // 1. Track Language Usage
        if (meta.lang) {
            const lang = meta.lang.split('-')[0].toLowerCase();
            this.languageUsage.set(lang, (this.languageUsage.get(lang) || 0) + 1);
        }

        // 2. Track Page Views (by path)
        if (meta.path) {
            this.pageViews.set(meta.path, (this.pageViews.get(meta.path) || 0) + 1);
        }

        return true;
    }

    getSummary() {
        const topLanguages = Array.from(this.languageUsage.entries())
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5)
            .map(([lang, count]) => ({ lang, count }));

        const topPages = Array.from(this.pageViews.entries())
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5)
            .map(([path, views]) => ({ path, views }));

        return {
            totalEntries: this.totalMetaEntries,
            topLanguages: topLanguages,
            topPages: topPages
        };
    }
}

module.exports = MetadataTracker;
