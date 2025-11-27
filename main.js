// /main.js - نقطة الدخول المركزية للماتريكس (Deno Deploy)
// ===================================================================
// Nabdz Engine - Main Entry Point
// ===================================================================
// This file integrates the Matrix Algorithm with the existing engine.
// Version: 2.3.0

// استيراد وحدات الماتريكس
import { injectResonanceMetadata } from './src/matrix/Metadata_Injector.js';

// استيراد نظام Gamification (إذا كان متاحاً)
import { Gamification } from './src/gamification.js';

export default {
    async fetch(request) {
        const url = new URL(request.url);
        
        // 1. تحديد الاستعلام (Q) والرابط الحالي
        const query = url.searchParams.get('q') || 'نبض الجزائر اليوم';
        const currentPageURL = url.href;

        // 2. تفعيل خوارزمية الرنين
        const metadata = injectResonanceMetadata(query, currentPageURL);

        // 3. تفعيل نظام Gamification (إذا كان متاحاً)
        let gamificationStatus = '';
        if (typeof Gamification !== 'undefined') {
            try {
                // محاكاة تحديث النقاط بناءً على الاستعلام
                const mood = query.length > 10 ? 'positive' : 'neutral';
                const status = Gamification.updatePoints(mood);
                gamificationStatus = `<p>🎮 Gamification Status: ${status.level} Level - ${status.points} Points</p>`;
            } catch (error) {
                console.warn('Gamification system error:', error);
            }
        }

        // 4. الرد بـ HTML محقون بالبيانات الوصفية
        return new Response(`
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <title>Nabd Matrix Core Test</title>
                ${metadata}
            </head>
            <body>
                <h1>✅ تفعيل الماتريكس - Core Activated!</h1>
                <p>تم حقن البيانات الوصفية الديناميكية بناءً على الاستعلام: <strong>${query}</strong></p>
                <p>تفحص مصدر الصفحة (View Source) لترى الرنين والـ Canonical URL المحقون.</p>
                ${gamificationStatus}
            </body>
            </html>
        `, {
            headers: { 'Content-Type': 'text/html' }
        });
    }
};
