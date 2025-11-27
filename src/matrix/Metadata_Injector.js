/**
 * @file Metadata_Injector.js
 * @description وحدة التشابك الهجين (EB) - تحقن البيانات الوصفية (SEO) ديناميكياً بناءً على الرنين.
 */

// استيراد باستخدام مسارات نسبية صحيحة
import { findBestResonanceMatch } from './Resonance_Scorer.js';
import { calculateInformationalFrequency } from './Frequency_Generator.js';
// تعريف قاعدة بيانات المقالات
const ContentDatabase = [
    { id: 'article-123', url: '/article-123.html', text: 'مقالة عن تأثير البترول في الجزائر...', basicFrequency: [0.8, 0.1, 0.3], vibrationIntensity: 5 },
    { id: 'article-456', url: '/article-456.html', text: 'قصة نجاح نجار محلي...', basicFrequency: [0.2, 0.9, 0.1], vibrationIntensity: 2 },
];

export function injectResonanceMetadata(userQuery, currentPageURL) {
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
        const matchedContent = ContentDatabase.find(item => item.id === bestMatch.contentId);
        
        if (matchedContent) {
            seoTitle = `[رنين عالي] ${matchedContent.text.substring(0, 50)}... | نبض الجزائر`;
            seoDescription = `تحليل عميق: اكتشف التردد الطاقي للموضوع. مؤشر الرنين: ${bestMatch.resonanceScore.toFixed(3)}`;
            
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
        
        <!-- ✨ إضافة خصائص Open Graph للانتشار الفيروسي -->
        <meta property="og:title" content="${seoTitle}">
        <meta property="og:description" content="${seoDescription}">
        <meta property="og:url" content="${currentPageURL}">
        <meta property="og:type" content="article">
        <meta property="og:site_name" content="نبض الجزائر">
        
        <!-- 🚀 إضافة خصائص Twitter Cards -->
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:title" content="${seoTitle}">
        <meta name="twitter:description" content="${seoDescription}">
    `;
}
