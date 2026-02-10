# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Android APK build

Prerequisites (already set in your local machine):

- Node.js + npm
- `JAVA_HOME` configured (Java 21 recommended)
- `ANDROID_HOME` configured with Android SDK installed

Build steps (local):

```bash
npm install
npm run build
npx cap sync android || npx cap add android
cd android
./gradlew assembleDebug
```

Generated APK path:

- `android/app/build/outputs/apk/debug/app-debug.apk`

If you want the web download link to work in this app, copy it to:

```bash
mkdir -p ../public/downloads
cp app/build/outputs/apk/debug/app-debug.apk ../public/downloads/talpak-controller-mobile-debug.apk
```

The app UI includes a `📱 APK` download button in the top navbar and drawer menu that points to `/downloads/talpak-controller-mobile-debug.apk`.
