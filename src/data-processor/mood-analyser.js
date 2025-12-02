// src/data-processor/mood-analyser.js
class MoodAnalyser {
    constructor() {
        this.moods = new Map();
        this.totalMoodEntries = 0;
    }

    process(logEntry) {
        if (logEntry.type !== 'signal:mood' || !logEntry.data || typeof logEntry.data.moodValue !== 'number') {
            return false;
        }

        const mood = logEntry.data.mood; // 'positive', 'negative', 'neutral'
        const value = logEntry.data.moodValue;

        if (!this.moods.has(mood)) {
            this.moods.set(mood, { count: 0, totalValue: 0 });
        }

        const stats = this.moods.get(mood);
        stats.count++;
        stats.totalValue += value;
        this.totalMoodEntries++;

        return true;
    }

    getSummary() {
        const results = {};
        for (const [mood, stats] of this.moods.entries()) {
            results[mood] = {
                count: stats.count,
                averageValue: stats.totalValue / stats.count,
                percentage: (stats.count / this.totalMoodEntries) * 100
            };
        }

        // Determine the overall dominant mood
        const dominantMood = Array.from(this.moods.entries())
            .sort(([, a], [, b]) => b.count - a.count)
            .shift();

        return {
            totalEntries: this.totalMoodEntries,
            dominantMood: dominantMood ? dominantMood[0] : 'unknown',
            moodDistribution: results
        };
    }
}

module.exports = MoodAnalyser;
