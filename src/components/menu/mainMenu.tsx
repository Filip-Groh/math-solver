import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
} from "~/components/ui/navigation-menu"
import { navigationMenuTriggerStyle } from "~/components/ui/navigation-menu"

import React from 'react'
import Link from "next/link"
import { ThemeToggle } from "../theme/theme-toggle"
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import { LogIn, LogOut, User } from "lucide-react"
import { getServerAuthSession } from "~/server/auth"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "~/components/ui/dropdown-menu"

export type MenuItem = {
    path: string,
    description: string | React.ReactNode
}

const MainMenu = async ({menuItems}: {menuItems: MenuItem[]}) => {
    const session = await getServerAuthSession()

    return (
        <NavigationMenu>
            <NavigationMenuList className="justify-center">
                {/* <NavigationMenuItem>
                    <NavigationMenuTrigger>Item One</NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <NavigationMenuLink>Link</NavigationMenuLink>
                    </NavigationMenuContent>
                </NavigationMenuItem> */}
                {menuItems.map((menuItem, index) => {
                    return (
                        <NavigationMenuItem key={`mainMenuItem_${index}`}>
                            <Link href={menuItem.path} legacyBehavior passHref>
                                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                    {menuItem.description}
                                </NavigationMenuLink>
                            </Link>
                        </NavigationMenuItem>
                    )
                })}
                <NavigationMenuItem>
                    <DropdownMenu>
                        <DropdownMenuTrigger className="focus-visible:outline-none focus-visible:drop-shadow-none">
                            <Avatar>
                                {session?.user.image ? <AvatarImage src={session?.user.image} /> : null}
                                <AvatarFallback>
                                    <User />
                                </AvatarFallback>
                            </Avatar>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuLabel>
                                {session ? <>My Account</> : <>Please log in</>}
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                                <ThemeToggle />
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                                {session ? <>
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <Link href="/api/auth/signout">
                                        Log out
                                    </Link>
                                </> : <>
                                    <LogIn className="mr-2 h-4 w-4" />
                                    <Link href="/api/auth/signin">
                                        Log in
                                    </Link>
                                </>}
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
    )
}

export default MainMenu