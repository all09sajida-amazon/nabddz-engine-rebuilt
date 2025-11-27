// matrix-core.js - الإصدار المبسط المؤقت
console.log("🚀 Nabd Matrix Coree - التشغيل المبسط");

// تجنب الاستيراد المعقد مؤقتاً
function injectResonanceMetadata(userQuery, currentPageURL) {
    return `
        <title>نبض الجزائر | المركز العصبي يعمل</title>
        <meta name="description" content="المركز العصبي النشط - ${userQuery}">
        <link rel="canonical" href="${currentPageURL}">
        <meta property="og:title" content="نجح التشغيل">
        <meta property="og:description" content="المركز العصبي يعمل بنجاح">
    `;
}

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
                <p>الاستعلام: <strong>${query}</strong></p>
                <p>الحالة: ✅ التشغيل المبسط الناجح</p>
                <p>الخطوة التالية: إصلاح مسارات الاستيراد</p>
            </body>
            </html>
        `, { headers: { 'Content-Type': 'text/html' } });
    }
};
