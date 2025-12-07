import { Theme, useTheme } from "@/hooks/stores/useTheme";
import { Dropdown, Button, Label } from "@heroui/react";
import { MonitorCog, Moon, Sun } from "lucide-react";

export function ThemeSelection() {
  const setTheme = useTheme((state) => state.setTheme);
  const theme = useTheme((state) => state.theme);

  const themeOptions: {
    key: Theme;
    text: string;
    icon: React.ReactNode;
  }[] = [
    {
      key: "light",
      text: "Light",
      icon: <Sun />,
    },
    {
      key: "dark",
      text: "Dark",
      icon: <Moon />,
    },
    {
      key: "device",
      text: "Device",
      icon: <MonitorCog />,
    },
  ];

  return (
    <Dropdown>
      <Button aria-label="Theme Selection">
        {themeOptions.find((option) => option.key === theme)?.icon}
      </Button>
      <Dropdown.Popover>
        <Dropdown.Menu
          onAction={(key) => setTheme(key as Theme)}
          selectedKeys={new Set([theme])}
          selectionMode="single"
        >
          {themeOptions.map((option) => (
            <Dropdown.Item
              key={option.key}
              id={option.key}
              textValue={option.text}
            >
              {option.icon}
              <Dropdown.ItemIndicator />
              <Label>{option.text}</Label>
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  );
}
