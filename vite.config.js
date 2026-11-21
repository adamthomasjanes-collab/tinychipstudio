// During a production build, public files are staged explicitly by the build
// script. Vite's default copy would publish entire editable client projects.
export default ({ command, mode }) => ({
  publicDir: command === 'build' ? false : 'public',
  // Separate opt-in QA builds. Ordinary production builds eliminate diagnostics.
  define: { __QA_ENABLED__: JSON.stringify(mode === 'qa' && process.env.CONTEXT !== 'production') },
});
