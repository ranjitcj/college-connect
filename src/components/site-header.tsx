// "use client";

// import { SidebarIcon } from "lucide-react";

// import { SearchForm } from "@/components/search-form";
// import {
//   Breadcrumb,
//   BreadcrumbItem,
//   BreadcrumbLink,
//   BreadcrumbList,
//   BreadcrumbPage,
//   BreadcrumbSeparator,
// } from "@/components/ui/breadcrumb";
// import { Button } from "@/components/ui/button";
// import { Separator } from "@/components/ui/separator";
// import { useSidebar } from "@/components/ui/sidebar";

// export function SiteHeader() {
//   const { toggleSidebar } = useSidebar();

//   return (
//     <header className="fle sticky top-0 z-50 w-full items-center border-b bg-background">
//       <div className="flex h-[--header-height] w-full items-center gap-2 px-4">
//         <Button
//           className="h-8 w-8"
//           variant="ghost"
//           size="icon"
//           onClick={toggleSidebar}
//         >
//           <SidebarIcon />
//         </Button>
//         <Separator orientation="vertical" className="mr-2 h-4" />
//         <Breadcrumb className="hidden sm:block">
//           <BreadcrumbList>
//             <BreadcrumbItem>
//               <BreadcrumbLink href="#">
//                 Building Your Application
//               </BreadcrumbLink>
//             </BreadcrumbItem>
//             <BreadcrumbSeparator />
//             <BreadcrumbItem>
//               <BreadcrumbPage>Data Fetching</BreadcrumbPage>
//             </BreadcrumbItem>
//           </BreadcrumbList>
//         </Breadcrumb>
//         <SearchForm className="w-full sm:ml-auto sm:w-auto" />
//       </div>
//     </header>
//   );
// }
"use client";

import { SidebarIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { SearchForm } from "@/components/search-form";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useSidebar } from "@/components/ui/sidebar";

// Define your route structure - you can expand this based on your app's structure
const routeMap = {
  "/": {
    title: "Home",
    isPage: true,
  },
  "/building-your-application": {
    title: "Building Your Application",
    isPage: false,
  },
  "/building-your-application/data-fetching": {
    title: "Data Fetching",
    isPage: true,
  },
  "/building-your-application/routing": {
    title: "Routing",
    isPage: true,
  },
  // Add more routes as needed
};

export function SiteHeader() {
  const { toggleSidebar } = useSidebar();
  const pathname = usePathname();
  const [breadcrumbs, setBreadcrumbs] = useState([]);

  useEffect(() => {
    // Generate breadcrumbs based on current pathname
    const generateBreadcrumbs = () => {
      // Split the path and build breadcrumb segments
      const pathSegments = pathname.split("/").filter(Boolean);
      let currentPath = "";

      // Start with home if we're not already on home
      const newBreadcrumbs = [];

      // Build up the path segments
      for (let i = 0; i < pathSegments.length; i++) {
        currentPath += `/${pathSegments[i]}`;

        // Check if this is a known route
        const routeInfo = routeMap[currentPath] || {
          title: pathSegments[i]
            .split("-")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" "),
          isPage: i === pathSegments.length - 1,
        };

        newBreadcrumbs.push({
          path: currentPath,
          title: routeInfo.title,
          isPage: routeInfo.isPage,
        });
      }

      setBreadcrumbs(newBreadcrumbs);
    };

    generateBreadcrumbs();
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 w-full items-center border-b bg-background">
      <div className="flex h-[--header-height] w-full items-center gap-2 px-4">
        <Button
          className="h-8 w-8"
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
        >
          <SidebarIcon />
        </Button>
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb className="hidden sm:block">
          <BreadcrumbList>
            {breadcrumbs.length === 0 && (
              <BreadcrumbItem>
                <BreadcrumbPage>Home</BreadcrumbPage>
              </BreadcrumbItem>
            )}

            {breadcrumbs.map((breadcrumb, index) => (
              <BreadcrumbItem key={breadcrumb.path}>
                {index > 0 && <BreadcrumbSeparator />}

                {breadcrumb.isPage ? (
                  <BreadcrumbPage>{breadcrumb.title}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={breadcrumb.path}>
                    {breadcrumb.title}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
        <SearchForm className="w-full sm:ml-auto sm:w-auto" />
      </div>
    </header>
  );
}
