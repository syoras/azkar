const CACHE_NAME = 'azkar-app-v2';
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './manifest.json',
    './icon-192.png',
    './icon-512.png',
    // صور لقطات الشاشة (تأكد من وجود هذه الملفات في المجلد)
    './screenshot-mobile-1.png',
    './screenshot-mobile-2.png',
    './screenshot-desktop.png',
    // روابط خارجية (الخطوط والأيقونات)
    'https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;800&display=swap',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

// 1. تثبيت الـ Service Worker وحفظ الملفات
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('تم حفظ ملفات التطبيق (v2) في الذاكرة');
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
});

// 2. تفعيل الـ Service Worker وحذف النسخ القديمة
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.filter((key) => key !== CACHE_NAME)
                    .map((key) => caches.delete(key))
            );
        })
    );
});

// 3. جلب البيانات (استراتيجية: الكاش أولاً، ثم الشبكة)
self.addEventListener('fetch', (event) => {
    // استثناء طلبات API المواقيت لأنها تحتاج إنترنت دائماً
    if (event.request.url.includes('api.aladhan.com')) {
        return; 
    }

    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            // إذا وجد الملف في الكاش ارجعه، وإلا اطلبه من النت
            return cachedResponse || fetch(event.request);
        }).catch(() => {
            // يمكن هنا التعامل مع الأخطاء (اختياري)
        })
    );
});
