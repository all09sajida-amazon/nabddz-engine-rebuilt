// matrix-core.js - نقطة الدخول الصحيحة
console.log("🚀 المركز العصبي - التشغيل من matrix-core.js");

// ✅ استخدام الدوال مباشرة بدون استيراد
function findBestResonanceMatch(queryFrequency, contentDB) {
    if (contentDB && contentDB.length > 0) {
        return { contentId: contentDB[0].id, resonanceScore: 0.95 };
    }
    return null;
}

function calculateInformationalFrequency(text) {
    const hash = text.length % 10;
    const frequency = [
        (hash * 0.1) % 1,
        ((hash + 3) * 0.1) % 1,
        ((hash + 7) * 0.1) % 1
    ];
    return { basicFrequency: frequency };
}

function injectResonanceMetadata(userQuery, currentPageURL) {
    const queryFrequency = calculateInformationalFrequency(userQuery);
    const bestMatch = findBestResonanceMatch(queryFrequency, [
        { id: 'article-123', url: '/article-123.html', text: 'مقالة عن تأثير البترول في الجزائر...' }
    ]);

    let seoTitle = "نبض الجزائر | صوتك اليومي";
    let seoDescription = "المحرك الذكي لتحليل المشاعر";

    if (bestMatch && bestMatch.resonanceScore > 0.85) {
        seoTitle = `[رنين عالي] نبض الجزائر | المركز العصبي`;
        seoDescription = `تحليل عميق: مؤشر الرنين: ${bestMatch.resonanceScore.toFixed(3)}`;
    }
    
    return `
        <title>${seoTitle}</title>
        <meta name="description" content="${seoDescription}">
        <link rel="canonical" href="${currentPageURL}">
    `;
}

// ✅ نقطة الدخول الرئيسية
export default {
    async fetch(request) {
        const url = new URL(request.url);
        const query = url.searchParams.get('q') || 'نبض الجزائر';
        
        const metadata = injectResonanceMetadata(query, url.href);
        
        return new Response(`
            <!DOCTYPE html>
            <html>
            <head><meta charset="utf-8">${metadata}</head>
            <body style="font-family: Arial; padding: 20px; direction: rtl;">
                <h1>✅ المركز العصبي يعمل!</h1>
                <p>الإعدادات المصححة: matrix-core.js ✓</p>
                <p>الاستعلام: ${query}</p>
            </body>
            </html>
        `, { headers: { "Content-Type": "text/html" } });
    }
};
