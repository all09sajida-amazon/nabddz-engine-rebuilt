/**
 * @file Metadata_Injector.js
 * @description وحدة التشابك الهجين (EB) - تحقن البيانات الوصفية (SEO) ديناميكياً بناءً على الرنين.
 * هذا يمثل التنفيذ الصامت الذي يوجه محركات البحث إلى المدونة.
 */

// استيراد وحدات النواة
const { findBestResonanceMatch } = require('../frequency/Resonance_Scorer');
const { calculateInformationalFrequency } = require('../frequency/Frequency_Generator');

// تعريف قاعدة بيانات المقالات (يجب أن يتم جلبها من API Blogger أو ملف بيانات ثابت)
// هذا يمثل ترددات المحتوى المخزنة (F_C)
const ContentDatabase = [
    // مثال: يجب أن يتم توليد هذه البيانات بواسطة سكريبت بناء (Build Script)
    { id: 'article-123', url: '/article-123.html', text: 'مقالة عن تأثير البترول في الجزائر...', basicFrequency: [0.8, 0.1, 0.3], vibrationIntensity: 5 },
    { id: 'article-456', url: '/article-456.html', text: 'قصة نجاح نجار محلي...', basicFrequency: [0.2, 0.9, 0.1], vibrationIntensity: 2 },
    // ... المزيد من المقالات
];

/**
 * الوظيفة الرئيسية: توليد كود HTML الخاص بالبيانات الوصفية الأكثر رنيناً.
 * @param {string} userQuery - استعلام المستخدم الحالي (يتم محاكاته لـ SEO).
 * @param {string} currentPageURL - رابط الصفحة التي يزورها المستخدم.
 * @returns {string} - سلسلة HTML جاهزة للحقن في وسم <head>.
 */
function injectResonanceMetadata(userQuery, currentPageURL) {
    
    // 1. تحديد التردد الحالي للاستعلام
    const queryFrequency = calculateInformationalFrequency(userQuery);

    // 2. تطبيق مقوم الرنين للعثور على المسار الأفضل
    const bestMatch = findBestResonanceMatch(queryFrequency, ContentDatabase);

    // 3. قرار NATM
    let seoTitle = "نبض الجزائر | صوتك اليومي";
    let seoDescription = "المحرك الذكي لتحليل المشاعر والترددات في المحتوى الجزائري.";
    let canonicalURL = currentPageURL;

    // إذا كان هناك رنين قوي جداً (Threshold)
    if (bestMatch && bestMatch.resonanceScore > 0.85) {
        
        // 4. حقن الرنين (التوجيه الصامت)
        // يتم استخدام المحتوى ذي الرنين الأعلى لتعزيز العنوان والوصف.
        
        // *تأثير تسلا:* لا نغير المحتوى، بل نغير "الواجهة" التي يراها محرك البحث.
        
        const matchedContent = ContentDatabase.find(item => item.id === bestMatch.contentId);
        
        if (matchedContent) {
            // استخدام جزء من المحتوى ذي الرنين العالي في العنوان والوصف
            seoTitle = `[رنين عالي] ${matchedContent.text.substring(0, 50)}... | نبض الجزائر`;
            seoDescription = `تحليل عميق: اكتشف التردد الطاقي للموضوع. مؤشر الرنين: ${bestMatch.resonanceScore.toFixed(3)}`;
            
            // التوجيه الصامت: استخدام الـ Canonical URL لتوجيه القيمة الطاقية
            // إذا كانت الصفحة الحالية ليست هي الأفضل رنيناً، نخبر جوجل بالصفحة الأكثر رنيناً.
            if (matchedContent.url !== currentPageURL) {
                 canonicalURL = matchedContent.url;
            }
        }
    }
    
    // 5. توليد كود HTML (النتائج البسيطة للعلن)
    return `
        <title>${seoTitle}</title>
        <meta name="description" content="${seoDescription}">
        <link rel="canonical" href="${canonicalURL}">
        <meta name="generator-frequency" content="${queryFrequency.basicFrequency.join(',')}">
    `;
}

module.exports = {
    injectResonanceMetadata
};
