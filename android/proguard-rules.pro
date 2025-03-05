-dontwarn java.lang.invoke.StringConcatFactory
-keep class com.freeraspreactnative.FreeraspReactNativePackage { public *; }

-if @kotlinx.serialization.Serializable class **
-keep class <1> {
    *;
}

-keep class com.freeraspreactnative.models.RNSuspiciousAppInfo$Companion
-keep class com.freeraspreactnative.models.RNPackageInfo$Companion
