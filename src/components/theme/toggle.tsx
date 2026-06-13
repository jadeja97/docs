"use client";

/* ============================================================================================= */

import { useTheme } from "next-themes";

import {
  CheckIcon,
  CircleHalfFillIcon,
  MoonFillIcon,
  SunFillIcon,
} from "@/components/assets/icons";
import { Button } from "@/components/button";
import {
  DropdownRoot,
  DropdownContent,
  DropdownItem,
  DropdownTrigger,
} from "@/components/dropdown";
import { Client } from "@/components/misc/client";

import type { UseThemeProps } from "next-themes";

import type { SVGEl } from "@/components/svg";

/* ============================================================================================= */

export const ThemeToggle = (): ReturnType<typeof DropdownRoot> => {
  //
  const { theme: activeTheme, setTheme, themes } = useTheme();

  return (
    <DropdownRoot>
      <DropdownTrigger
        render={<Button hasIcon variant="outline" size="icon" className="theme-toggle__trigger" />}
      >
        <Client>
          <Icon theme={activeTheme} />
        </Client>
        <span className="screen-reader">toggle theme</span>
      </DropdownTrigger>

      <DropdownContent align="end" className="theme-toggle__content">
        {themes.map((theme) => {
          return (
            <DropdownItem
              key={theme}
              onClick={() => {
                setTheme(theme);
              }}
            >
              <Icon theme={theme} />

              <span className="theme-toggle__label">{theme}</span>

              {theme === activeTheme && <CheckIcon className="theme-toggle__active-icon" />}
            </DropdownItem>
          );
        })}
      </DropdownContent>
    </DropdownRoot>
  );
};

/* ============================================================================================= */

export interface IconProps {
  theme: UseThemeProps["theme"];
}

export const Icon = ({ theme }: IconProps): SVGEl => {
  //
  if (theme === "light") {
    return <SunFillIcon />;
  }

  if (theme === "dark") {
    return <MoonFillIcon />;
  }

  return <CircleHalfFillIcon />;
};
