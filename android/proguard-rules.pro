-dontwarn java.lang.invoke.StringConcatFactory
-keep class app.talsec.rasp.reactnative.FreeraspReactNativePackage { public *; }

-if @kotlinx.serialization.Serializable class **
-keep class <1> {
    *;
}

-keep class app.talsec.rasp.reactnative.models.RNSuspiciousAppInfo$Companion
-keep class app.talsec.rasp.reactnative.models.RNPackageInfo$Companion

-repackageclasses 'ts'