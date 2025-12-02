// src/ui/dashboard-renderer.js

/**
 * Renders the dashboard elements based on data summaries from the core.
 */
class DashboardRenderer {
    constructor(targetElementId = 'nabd-dashboard') {
        this.target = document.getElementById(targetElementId);
        if (!this.target) {
            console.error(`Target element #${targetElementId} not found. Dashboard cannot render.`);
            return;
        }
        this.target.innerHTML = '<h2>Initializing Nabd Engine Dashboard...</h2>';
    }

    render(data) {
        if (!this.target) return;

        const { identitySummary, moodAnalysis } = data;
        let html = `
            <h2>📊 لوحة تحكم نبض الجزائر (Nabd Dashboard)</h2>
            <div class="stats-container">
                <div class="stat-box identity">
                    <h3>👤 ملخص الهوية</h3>
                    <p>إجمالي الزيارات: <strong>${identitySummary.totalVisits || 0}</strong></p>
                    <p>الهوية الحالية: <strong>${identitySummary.identity || 'غير محدد'}</strong></p>
                    <h4>المسارات الأكثر تكراراً:</h4>
                    <ul>
                        ${(identitySummary.mostFrequentPaths || []).map(p => `<li>${p.path}: ${p.count}</li>`).join('')}
                    </ul>
                </div>
                <div class="stat-box mood">
                    <h3>😊 تحليل المزاج</h3>
                    <p>إجمالي إشارات المزاج: <strong>${moodAnalysis.totalEntries || 0}</strong></p>
                    <p>المزاج السائد: <strong>${moodAnalysis.dominantMood || 'غير معروف'}</strong></p>
                    <h4>توزيع المزاج:</h4>
                    ${this.renderMoodDistribution(moodAnalysis.moodDistribution)}
                </div>
            </div>
        `;
        this.target.innerHTML = html;
        this.applyBasicStyles();
    }

    renderMoodDistribution(distribution) {
        if (!distribution || Object.keys(distribution).length === 0) return '<p>لا توجد بيانات مزاج كافية.</p>';
        
        let list = '<ul>';
        for (const mood in distribution) {
            const stats = distribution[mood];
            list += `<li>${mood}: ${stats.count} (${stats.percentage.toFixed(1)}%)</li>`;
        }
        list += '</ul>';
        return list;
    }

    applyBasicStyles() {
        // Basic CSS for visualization (This is usually done in a separate CSS file, but included here for a simple demo)
        if (document.getElementById('nabd-styles')) return;

        const style = document.createElement('style');
        style.id = 'nabd-styles';
        style.innerHTML = `
            #nabd-dashboard {
                position: fixed;
                bottom: 10px;
                left: 10px;
                width: 350px;
                background: #f7f7f7;
                border: 1px solid #ddd;
                padding: 15px;
                box-shadow: 0 4px 8px rgba(0,0,0,0.1);
                z-index: 10000;
                font-family: Arial, sans-serif;
                font-size: 14px;
                border-radius: 8px;
                direction: rtl; /* Ensure RTL layout */
            }
            .stats-container {
                display: flex;
                flex-direction: column;
                gap: 10px;
            }
            .stat-box {
                padding: 10px;
                border-radius: 6px;
                background: #fff;
                border-left: 5px solid;
            }
            .identity { border-color: #007bff; }
            .mood { border-color: #28a745; }
            .stat-box h3, .stat-box h4 {
                margin-top: 0;
                border-bottom: 1px solid #eee;
                padding-bottom: 5px;
            }
            .stat-box ul {
                list-style-type: none;
                padding: 0;
                margin: 5px 0 0 0;
            }
        `;
        document.head.appendChild(style);
    }
}

// Global exposure for debugging
window.DashboardRenderer = DashboardRenderer;

// We export the class directly, it will be used by the main integration file
module.exports = DashboardRenderer;
