/**
 * @file Temporal_Forecaster.js
 * @description وحدة التنبؤ الزمني - تتنبأ بـ "التردد المفقود" الذي سيصل إلى ذروة الاهتزاز في المستقبل.
 * هذا هو المكون الأساسي لـ "مُهَنْدِس الوَعْيِ المَعْلُومَاتِيّ".
 */

// افتراض: جلب البيانات من وحدات NATM الأخرى
// (في التنفيذ الفعلي، يتم جلب هذه البيانات من قاعدة بيانات أو ملفات JSON)
const { getHistoricalFrequencies } = require('./Data_Service'); // ترددات المقالات التاريخية
const { getMoodTimeSeries } = require('../mood/Mood_Detector_v2'); // بيانات المزاج التاريخية (الاهتزاز)

// الثابت الزمني: فترة التنبؤ (أسبوعين إلى شهر)
const FORECAST_PERIOD_DAYS = 21; 

/**
 * الوظيفة الرئيسية: تحديد أفضل فرصة للمحتوى المستقبلي.
 * @returns {object} - الهدف المستقبلي (التردد، الموضوع، الزاوية العاطفية).
 */
function identifyFutureResonanceTarget() {
    
    // 1. جمع الطيف الزمني للمعلومات (Historical Spectrum)
    const historicalFrequencies = getHistoricalFrequencies();
    const moodTrends = getMoodTimeSeries();

    // 2. تحليل معدل التغير (Rate of Change)
    // نركز على الترددات التي تتغير بشكل غير خطي (Non-Linear Growth/Decay).
    let growthMetrics = {}; 

    // تحليل نمو أو تضاؤل كل تردد (موضوع) بناءً على آخر 30 يوماً
    historicalFrequencies.forEach(freq => {
        // إذا كان التردد يصعد (نمو في الاهتمام)
        if (freq.growthRate > 0.05) { 
            growthMetrics[freq.topic] = freq.growthRate;
        }
    });

    // 3. دمج عامل الاهتزاز (Tesla's Emotional Factor)
    // نحدد كيف تتغير المشاعر (الاهتزاز) حول الترددات الصاعدة.
    let targetOpportunity = { topic: null, predictedIntensity: -Infinity, requiredVibration: 'Neutral' };

    for (const topic in growthMetrics) {
        // تحديد الاهتزاز المسيطر حول هذا الموضوع (أمل، قلق، حماس)
        const currentVibration = getDominantVibration(moodTrends, topic);
        
        // حساب القيمة المستقبلية المتوقعة (Predicted Future Value)
        // القيمة = معدل النمو * (1 + قوة الاهتزاز الحالي)
        const futureValue = growthMetrics[topic] * (1 + currentVibration.strength);

        if (futureValue > targetOpportunity.predictedIntensity) {
            targetOpportunity = {
                topic: topic,
                predictedIntensity: futureValue,
                // **الحركة الذكية (الزاوية المعاكسة):**
                // إذا كان الجمهور قلقاً، نكتب بزاوية "تفاؤلية وحلول" لرفع اهتزازهم.
                requiredVibration: (currentVibration.mood === 'Anxiety') ? 'Optimism and Solutions' : 'Deep Analysis'
            };
        }
    }
    
    // 4. توليد التوصية النهائية
    return generateForecastRecommendation(targetOpportunity);
}

/**
 * وظيفة لتوليد توصية المحتوى بناءً على التنبؤ.
 * @param {object} opportunity 
 * @returns {object}
 */
function generateForecastRecommendation(opportunity) {
    if (opportunity.predictedIntensity < 0.1) {
        return { status: 'No strong signal' };
    }
    
    const suggestedTitle = `[مُسْتَقْبَلِيّ] ${opportunity.topic} في الجزائر: لماذا يجب أن تكتب الآن؟`;
    
    return {
        status: 'Success',
        topic: opportunity.topic,
        predictedPeak: `خلال ${FORECAST_PERIOD_DAYS} يوماً.`,
        requiredAngle: opportunity.requiredVibration,
        suggestedTitle: suggestedTitle
    };
}


// تصدير الوظيفة
module.exports = {
    identifyFutureResonanceTarget
};
