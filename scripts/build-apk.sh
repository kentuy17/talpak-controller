#!/usr/bin/env bash
set -euo pipefail

# ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
# JAVA_HOME_DEFAULT="/root/.local/share/mise/installs/java/21.0.2"
# ANDROID_HOME_DEFAULT="/opt/android-sdk"

# export JAVA_HOME="${JAVA_HOME:-$JAVA_HOME_DEFAULT}"
# export ANDROID_HOME="${ANDROID_HOME:-$ANDROID_HOME_DEFAULT}"
# export ANDROID_SDK_ROOT="${ANDROID_SDK_ROOT:-$ANDROID_HOME}"
# export PATH="$JAVA_HOME/bin:$ANDROID_HOME/platform-tools:$PATH"

# cd "$ROOT_DIR"
npm run build && npx cap sync android || npx cap add android \
&& cd android && ./gradlew assembleDebug && cd .. && mkdir -p public/downloads \
&& cp android/app/build/outputs/apk/debug/app-debug.apk public/downloads/talpak-controller-mobile-debug.apk

echo "APK generated at public/downloads/talpak-controller-mobile-debug.apk"

