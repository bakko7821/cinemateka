import { useEffect } from "react";

export function useApplyTheme() {
  useEffect(() => {
    const savedMainColors = localStorage.getItem("mainColors");
    const savedThemeColors = localStorage.getItem("themeColors");

    if (savedMainColors) {
      const color = JSON.parse(savedMainColors);
      document.documentElement.style.setProperty("--main-color", color.mainColor);
      document.documentElement.style.setProperty("--main-hover-color", color.mainHoverColor);
    }

    if (savedThemeColors) {
      const theme = JSON.parse(savedThemeColors);
      document.documentElement.style.setProperty("--background-color", theme.backgroundColor);
      document.documentElement.style.setProperty("--background-card-color", theme.backgroundCardColor);
      document.documentElement.style.setProperty("--text-color", theme.textColor);
    }
  }, []);
}
