# Noor Ul Huda

نور الهدى هو تطبيق قرآن غير متصل بالإنترنت يتضمن أوقات الصلاة والأدعية.

## الميزات

خصص تجربة القراءة الخاصة بك بالطريقة التي تريدها:

* اختر **الخط القرآني**: الإملائي أو العثماني.
* اختر من بين خطوط عربية مختلفة (تتطلب التحميل)، واضبط تباين الخط **وحجمه**.
* اضبط **درجة لون الخلفية** المريحة وسطوع الشاشة.
* اختر من **وضع الصفحة** أو القراءة المستمرة.
* **المظهر الداكن** وألوان سمات متعددة مدعومة.

اجعل قراءة القرآن أكثر فائدة:

* **الترجمات** بلغات مختلفة.
* سرعة تدوين الملاحظات عن طريق إنشاء **علامات** مع عنوان ووصف.
* وضع علامة على الآيات بسهولة بالضغط المطول.
* **البحث** في النص القرآني أو الترجمات.
* **المشاركة** أو نسخ الآيات (مع الترجمة) بالضغط المطول.

التنقل السهل:

* **إضافة الآيات إلى المفضلة** بالضغط المطول.
* الانتقال إلى الصفحة أو السورة أو الجزء أو المنزل المطلوب.

المزيد:

* الأدعية القرآنية والمأثورة (**الأدعية**)، العامة والمناسبات الخاصة.
* إشعارات **أوقات الصلاة** والأذان، واتجاه **القبلة** للموقع المحدد.
* **النسخ الاحتياطي والاستعادة** للتفضيلات والعلامات والمفضلة.

## متطلبات الاستخدام

1. إذن **الإنترنت** مطلوب للتحقق من التحديثات، وتنزيل النصوص القرآنية والترجمات، والخطوط وملف صوت الأذان، ولتحديد الموقع الجغرافي (العكسي).
   
   إذا كنت لا تستخدم أياً من هذه الميزات، فإن NUH لا يقوم بأي اتصال بالإنترنت، أبداً. بمجرد تنزيل المورد المطلوب (بموافقتك)، يعمل التطبيق بشكل كامل دون اتصال بالإنترنت. تشمل المواقع التي قد يتصل بها NUH [https://github.com](https://github.com) و [https://mirfatif.github.io](https://mirfatif.github.io) و [https://www.geonames.org](https://www.geonames.org).

2. إذن **FOREGROUND_SERVICE** مطلوب لإظهار إشعار الأداة الدائمة وتشغيل الأذان.

3. **WAKE_LOCK** مطلوب لتشغيل منبه الأذان.

4. **RECEIVE_BOOT_COMPLETED** مطلوب لإعادة تعيين المنبهات (لإشعارات الصلاة والأذان) عند إعادة تشغيل الجهاز.

## التحميل

يمكنك تحميله من [هنا](https://f-droid.org/en/packages/com.mirfatif.noorulhuda/).

## للمطورين

هذا تطبيق جوال مفتوح المصدر مكتوب بلغة Java. يمكنك العثور على الكود المصدري [هنا](https://github.com/ya27hw/equran_app).

### المكتبات

* [Android Jetpack](https://github.com/androidx/androidx)
* [Material Components for Android](https://github.com/material-components/material-components-android)
* [Adhan Java](https://github.com/batoulapps/adhan-java)
* [Time4A](https://github.com/batoulapps/adhan-java)
* [BetterLinkMovementMethod](https://github.com/saket/Better-Link-Movement-Method)
* [LeakCanary](https://github.com/square/leakcanary)
* [Google Java Format](https://github.com/sherter/google-java-format-gradle-plugin)
* [Guava](https://github.com/google/guava)

### تقنية البحث

تستخدم ميزة البحث في هذا المشروع دالة `INSTR()` المدمجة في SQLite. يمكنك العثور على استعلام البحث (وجميع الاستعلامات الأخرى) في هذا الملف [`https://github.com/mirfatif/NoorUlHuda/blob/master/app/src/main/java/com/mirfatif/noorulhuda/db/QuranDao.java#L83`](https://github.com/mirfatif/NoorUlHuda/blob/master/app/src/main/java/com/mirfatif/noorulhuda/db/QuranDao.java#L83)

### الموارد

1. **الترجمات**: [Crowdin](https://crowdin.com/project/nuh)
2. **النصوص القرآنية والترجمات:** [تنزيل](https://tanzil.net/download). 
3. **الخطوط:** يستخدم نور الهدى الخطوط العربية التي أنشأها:
   * [مجمع الملك فهد لطباعة المصحف الشريف](https://fonts.qurancomplex.gov.sa)
   * [Pakistan Data Management Services](https://pakdata.com/products/arabicfont)
   * [SIL International](https://software.sil.org/arabicfonts)
   * [Noor-e-Hidayat](https://www.noorehidayat.org)
   * [Meor Ridzuan](https://github.com/icikiwir/me_quran)
   * [Quran Academy](https://github.com/quranacademy/kitab-font)
4. **الأذان:** القارئ إسلام صبحي
