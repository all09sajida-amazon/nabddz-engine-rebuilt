# إعداد محرك "نبض الجزائر"

هذا الدليل سيشرح كيفية إعداد المحرك بشكل صحيح ليعمل مع قالب بلوجر.

### الخطوة 1: إعداد الوكيل (Proxy)

1.  اذهب إلى [script.google.com](https://script.google.com).
2.  أنشئ مشروعًا جديدًا.
3.  انسخ الكود من ملف `proxy/gas-proxy.gs` والصقه في المحرر.
4.  أضف مفاتيح API الخاصة بك في الأماكن المخصصة.
5.  من القائمة، اختر `Deploy` > `New deployment`.
6.  اختر `Web app`.
7.  في `Execute as`، اختر `Me`.
8.  في `Who has access`، اختر `Anyone`.
9.  انشر واحصل على رابط الويب الخاص بالتطبيق. هذا هو `PROXY_URL`.

### الخطوة 2: تكوين القالب

1.  في قالب بلوجر، قبل وسم `</body>`، أضف السطر التالي:

    ```html
    <script>
      window.NABDZ_CONFIG = {
        proxyUrl: 'PROXY_URL' // ضع رابط الوكيل هنا
      };
    </script>
    <script src="https://cdn.jsdelivr.net/gh/all09sajida-amazon/nabddz-engine@v2.2.0/dist/seed.js"></script>
    ```

الآن، المحرك جاهز للعمل.
