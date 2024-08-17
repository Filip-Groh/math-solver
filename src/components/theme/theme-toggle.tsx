"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import {
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
  DropdownMenuSubContent,
  DropdownMenuSeparator,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem
} from "~/components/ui/dropdown-menu"

export function ThemeToggle() {
    const { setTheme, theme, systemTheme } = useTheme()
    const [selectedTheme, setSelectedTheme] = React.useState(theme ?? "system")

    React.useEffect(() => {
        setTheme(selectedTheme)
    }, [selectedTheme, setTheme])

    return (
        <DropdownMenuSub>
            <DropdownMenuSubTrigger>
                {theme == "light" ? <Sun className="mr-2 h-4 w-4" /> : <Moon className="mr-2 h-4 w-4" />}
                <span>Theme</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
                <DropdownMenuSubContent>
                    <DropdownMenuRadioGroup value={selectedTheme} onValueChange={setSelectedTheme}>
                        <DropdownMenuRadioItem value="light" className="justify-between">
                            <span>Light</span>
                            <Sun className="w-4 h-4" />
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="dark" className="justify-between">
                            <span>Dark</span>
                            <Moon className="w-4 h-4" />
                        </DropdownMenuRadioItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuRadioItem value="system" className="justify-between">
                            <span>System</span>
                            {systemTheme == "light" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                        </DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                </DropdownMenuSubContent>
            </DropdownMenuPortal>
        </DropdownMenuSub>
    )
}