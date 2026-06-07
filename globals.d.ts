// Ambient declarations for side-effect CSS imports (e.g. `import './landing.css'`)
// so `next build`'s type-checker accepts them. All CSS here is global, not modules.
declare module '*.css';
