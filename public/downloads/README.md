# APK download artifacts

This folder is intentionally kept in git without binary APK files.

## Build the APK locally

From the project root:

```bash
npm install
npm run build
npx cap sync android || npx cap add android
cd android
./gradlew assembleDebug
```

Then copy the artifact:

```bash
mkdir -p ../public/downloads
cp app/build/outputs/apk/debug/app-debug.apk ../public/downloads/talpak-controller-mobile-debug.apk
```

The navbar link (`/downloads/talpak-controller-mobile-debug.apk`) will work after this file is built.
