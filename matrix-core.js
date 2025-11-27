// /matrix-core.js - نقطة الدخول المركزية للماتريكس
// ===================================================================
// Nabdz Engine - Matrix Core Entry Point
// ===================================================================
// Version: 2.5.0 - اسم جديد لتجنب التعارض

// ✅ استخدام import_map.json للاستيراد من src/matrix/
import { injectResonanceMetadata } from '@matrix/Metadata_Injector.js';

console.log("🚀 Nabd Matrix Core - جاهز من ملف matrix-core.js!");

export default {
    async fetch(request) {
        const url = new URL(request.url);
        
        try {
            // 1. تحديد الاستعلام والرابط الحالي
            const query = url.searchParams.get('q') || 'نبض الجزائر اليوم';
            const currentPageURL = url.href;

            // 2. تفعيل خوارزمية الرنين
            const metadata = injectResonanceMetadata(query, currentPageURL);

            // 3. الرد بـ HTML محقون بالبيانات الوصفية
            return new Response(`
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <title>Nabd Matrix Core - التشغيل الناجح</title>
                    ${metadata}
                </head>
                <body style="font-family: Arial, sans-serif; padding: 20px; direction: rtl;">
                    <h1>✅ المركز العصبي يعمل بنجاح!</h1>
                    <p><strong>الاستعلام:</strong> ${query}</p>
                    <p><strong>الحالة:</strong> ✅ التشغيل من matrix-core.js</p>
                    <p><strong>المسار:</strong> src/matrix/Metadata_Injector.js</p>
                    <hr>
                    <p>🔍 تفحص مصدر الصفحة لترى البيانات الوصفية المحقونة.</p>
                </body>
                </html>
            `, {
                headers: { 'Content-Type': 'text/html' }
            });
            
        } catch (error) {
            return new Response(`
                <html><body>
                    <h1>❌ خطأ: ${error.message}</h1>
                    <p>تحقق من import_map.json وملفات src/matrix/</p>
                </body></html>
            `, { status: 500 });
        }
    }
};
