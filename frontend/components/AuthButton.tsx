"use client";

import { useAuth } from "@/hooks/useAuth";
import { Loader2, LogIn, User as UserIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuSub,
    DropdownMenuSubTrigger,
    DropdownMenuSubContent
} from "@/components/ui/dropdown-menu";


export function AuthButton() {
    const { user, loading, hasMounted, loginAnonymous, loginGoogle, logout } = useAuth();

    if (!hasMounted) {
        return <div className="h-10 w-24 rounded-full bg-white/5 animate-pulse" />;
    }

    if (loading) {
        return (
            <Button variant="ghost" size="icon" disabled>
                <Loader2 className="h-4 w-4 animate-spin" />
            </Button>
        );
    }

    if (user) {
        return (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full border border-white/10 p-0 hover:bg-white/10 overflow-hidden">
                        {user.photoURL ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={user.photoURL} alt={user.displayName || "User"} className="h-full w-full rounded-full object-cover" />
                        ) : (
                            <div className="h-full w-full rounded-full bg-nature-700 flex items-center justify-center">
                                <span className="text-sm font-bold">{user.displayName ? user.displayName[0] : <UserIcon className="h-5 w-5 text-gray-400" />}</span>
                            </div>
                        )}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-dark-800 border-white/10 text-white" align="end">
                    <DropdownMenuLabel>
                        <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium leading-none">{user.displayName || "Anonymous User"}</p>
                            <p className="text-xs leading-none text-gray-400">{user.email || "No email"}</p>
                        </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-white/10" />
                    <DropdownMenuItem className="focus:bg-white/10 focus:text-white cursor-pointer" onClick={() => logout()}>
                        Log out
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        );
    }

    return (
        <Link href="/login">
            <Button variant="outline" className="border-nature-500/50 text-nature-400 hover:bg-nature-500/10 hover:text-nature-300">
                <LogIn className="mr-2 h-4 w-4" /> Sign In
            </Button>
        </Link>
    );
}
