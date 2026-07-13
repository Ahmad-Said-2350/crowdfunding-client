import { Footer } from "./Footer";
import { Navbar } from "./Navbar";

export function BasicLayout({ children }: { children: React.ReactNode }) {
  return <div className="flex min-h-screen flex-col"><Navbar /><main className="flex-1">{children}</main><Footer /></div>;
}
