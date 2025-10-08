'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, Clock, BookOpen, Gavel, LogIn, LogOut, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSession, signOut } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';

export function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();

  const links = [
    { href: '/', label: 'Accueil', icon: Home },
    { href: '/timers', label: 'Timers', icon: Clock },
    { href: '/sets', label: 'Sets', icon: BookOpen },
    { href: '/judges/tools', label: 'Judges', icon: Gavel },
  ];

  console.log(session);

  const handleSignOut = async () => {
    await signOut();
    router.refresh();
  };

  return (
    <nav className="border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-xl font-bold">
            SWU Tools
          </Link>
          <div className="flex items-center gap-4">
            <div className="flex gap-1">
              {links.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      'flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{link.label}</span>
                  </Link>
                );
              })}
            </div>
            <div className="flex items-center gap-2">
              {session?.user ? (
                <>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <User className="h-4 w-4" />
                    <span className="hidden sm:inline">{session.user.email}</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSignOut}
                    className="flex items-center gap-2"
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="hidden sm:inline">Déconnexion</span>
                  </Button>
                </>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push('/auth/signin')}
                  className="flex items-center gap-2"
                >
                  <LogIn className="h-4 w-4" />
                  <span className="hidden sm:inline">Connexion</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
