// scripts/data-aggregator.js
const fs = require('fs');
const path = require('path');

// M4 Processors
const IdentitySummarizer = require('../src/data-processor/identity-summarizer');
const MoodAnalyser = require('../src/data-processor/mood-analyser');
const MetadataTracker = require('../src/data-processor/metadata-tracker');

/**
 * Reads log files and applies all M4 processors to generate a unified summary.
 */
function aggregateData(logsDirectory) {
    if (!fs.existsSync(logsDirectory)) {
        console.log(`Logs directory not found: ${logsDirectory}`);
        return { error: 'Logs directory not found' };
    }

    const identitySummarizer = new IdentitySummarizer();
    const moodAnalyser = new MoodAnalyser();
    const metadataTracker = new MetadataTracker();

    let totalFiles = 0;
    
    // Recursive function to walk the log directory structure (date folders)
    function walkDir(dir) {
        const items = fs.readdirSync(dir);
        for (const item of items) {
            const itemPath = path.join(dir, item);
            const stats = fs.statSync(itemPath);

            if (stats.isDirectory()) {
                walkDir(itemPath);
            } else if (item.endsWith('.json')) {
                try {
                    const content = fs.readFileSync(itemPath, 'utf8');
                    const logData = JSON.parse(content);

                    // Process log data using all available processors
                    identitySummarizer.process(logData);
                    moodAnalyser.process(logData);
                    metadataTracker.process(logData);

                    totalFiles++;
                } catch (e) {
                    console.error(`Error processing file ${itemPath}:`, e.message);
                }
            }
        }
    }

    walkDir(logsDirectory);

    // Generate final aggregated report
    const report = {
        timestamp: new Date().toISOString(),
        totalLogsProcessed: totalFiles,
        identitySummary: identitySummarizer.getSummary(),
        moodAnalysis: moodAnalyser.getSummary(),
        metadataSummary: metadataTracker.getSummary()
    };

    return report;
}

// Example usage (run manually or via manager)
if (require.main === module) {
    const logsPath = path.join(__dirname, '..', 'data', 'logs');
    const finalReport = aggregateData(logsPath);
    
    const outputPath = path.join(__dirname, '..', 'data', 'reports', 'aggregated_report.json');
    fs.writeFileSync(outputPath, JSON.stringify(finalReport, null, 2));
    
    console.log(`Aggregation complete. Report saved to: ${outputPath}`);
}

module.exports = { aggregateData };
