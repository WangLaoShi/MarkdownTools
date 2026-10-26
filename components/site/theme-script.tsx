export function ThemeScript() {
  const code = `try{var t=localStorage.getItem("mdt-theme");var d=t==="dark"||(t!=="light"&&matchMedia("(prefers-color-scheme: dark)").matches);document.documentElement.classList.toggle("dark",d)}catch(e){}`;
  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}

export function themeToggleScript() {
  const next = document.documentElement.classList.contains("dark") ? "light" : "dark";
  document.documentElement.classList.toggle("dark", next === "dark");
  localStorage.setItem("mdt-theme", next);
}
