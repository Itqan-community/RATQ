# نور الهدى (Noor Ul Huda)

نور الهدى هو تطبيق قرآني يعمل دون اتصال بالإنترنت (Offline)، يتضمن أوقات الصلاة والأدعية.

## المميزات

قم بتخصيص تجربة القراءة بالطريقة التي تريدها:

* اختيار **رسم** المصحف: الإملائي أو العثماني.
* اختيار **خطوط** عربية متنوعة (تتطلب التحميل)، مع إمكانية ضبط التباين و**الحجم**.
* ضبط **لون الخلفية** وسطوع الشاشة لراحة العين.
* الاختيار بين **نمط الصفحات** أو القراءة المستمرة.
* دعم **المظهر الداكن** وعدة سمات لونية أخرى.

اجعل قراءة القرآن أكثر نفعاً:

* **ترجمات** بلغات مختلفة.
* تدوين الملاحظات السريعة عبر إنشاء **وسوم (Tags)** بالعنوان والوصف.
* وسم الآيات بسهولة عبر الضغط المطول.
* **البحث** في النص القرآني أو الترجمات.
* **مشاركة** أو نسخ الآيات (مع الترجمة) عبر الضغط المطول.

سهولة التنقل:

* إضافة **إشارات مرجعية** للآيات عبر الضغط المطول.
* الانتقال إلى الصفحة، السورة، الجزء، الربع أو السجدة المطلوبة.

ميزات إضافية:

* أدعية قرآنية ومأثورة، عامة وللمناسبات الخاصة.
* تنبيهات **أوقات الصلاة** والأذان، وتحديد اتجاه **القبلة** للموقع المحدد.
* **نسخ احتياطي واستعادة** للتفضيلات والوسوم والإشارات المرجعية.

## متطلبات التشغيل

1. صلاحية **الوصول للإنترنت (INTERNET)** مطلوبة للتحقق من التحديثات، تنزيل النصوص القرآنية والترجمات، الخطوط، ملف الأذان الصوتي، ولتحديد الموقع الجغرافي.
   
   إذا لم تستخدم أيًا من هذه الميزات، فلن يقوم التطبيق بإجراء أي اتصال بالإنترنت أبداً. بمجرد تنزيل المصدر المطلوب (بموافقتك)، سيعمل التطبيق دون اتصال بالإنترنت تماماً. تشمل النطاقات التي قد يتصل بها التطبيق: [https://github.com](https://github.com)، [https://mirfatif.github.io](https://mirfatif.github.io) و [https://www.geonames.org](https://www.geonames.org).

2. صلاحية **خدمات الواجهة (FOREGROUND_SERVICE)** مطلوبة لعرض إشعارات الصلاة وتشغيل الأذان.

3. صلاحية **WAKE_LOCK** مطلوبة لتشغيل منبه الأذان.

4. صلاحية **RECEIVE_BOOT_COMPLETED** مطلوبة لإعادة ضبط التنبيهات (للصلاة والأذان) عند إعادة تشغيل الجهاز.

## التحميل

يمكنك تحميل التطبيق من [هنا](https://f-droid.org/en/packages/com.mirfatif.noorulhuda/).

## للمطورين

هذا تطبيق للهواتف المحمولة مفتوح المصدر مكتوب بلغة Java. يمكنك العثور على الكود المصدري [هنا](https://github.com/mirfatif/NoorUlHuda).

### المكتبات المستخدمة

* [Android Jetpack](https://github.com/androidx/androidx)
* [Material Components for Android](https://github.com/material-components/material-components-android)
* [Adhan Java](https://github.com/batoulapps/adhan-java)
* [Time4A](https://github.com/batoulapps/adhan-java)
* [BetterLinkMovementMethod](https://github.com/saket/Better-Link-Movement-Method)
* [LeakCanary](https://github.com/square/leakcanary)
* [Google Java Format](https://github.com/sherter/google-java-format-gradle-plugin)
* [Guava](https://github.com/google/guava)

### تقنية البحث

تستخدم ميزة البحث في هذا المشروع وظيفة `INSTR()` المدمجة في SQLite. يمكنك العثور على استعلام البحث (وجميع الاستعلامات الأخرى) في هذا الملف: [`QuranDao.java`](https://github.com/mirfatif/NoorUlHuda/blob/master/app/src/main/java/com/mirfatif/noorulhuda/db/QuranDao.java#L83)

### الموارد

1. **الترجمات:** [Crowdin](https://crowdin.com/project/nuh)
2. **النصوص القرآنية والتراجم:** [Tanzil](https://tanzil.net/download). 
3. **الخطوط:** يستخدم نور الهدى خطوطاً عربية تم إنشاؤها بواسطة:
   * مجمع الملك فهد لطباعة المصحف الشريف.
   * Pakistan Data Management Services.
   * SIL International.
   * Noor-e-Hidayat.
   * Meor Ridzuan.
   * Quran Academy.
4. **الأذان:** بصوت القارئ إسلام صبحي.