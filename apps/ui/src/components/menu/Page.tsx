import { AppSidebar } from "@/shadcn/components/app-sidebar";
import { NavActions } from "@/shadcn/components/nav-actions";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbPage,
} from "@/shadcn/components/ui/breadcrumb";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/shadcn/components/ui/sidebar";
import { Separator } from "@heroui/react";

export default function Page() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center gap-2">
          <div className="flex flex-1 items-center gap-2 px-3">
            <SidebarTrigger />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage className="line-clamp-1">
                    Project Management & Task Tracking
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="ml-auto px-3">
            <NavActions />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 px-4 py-10">
          <div className="bg-muted/50 mx-auto h-24 w-full max-w-3xl rounded-xl">
            Lorem ipsum dolor sit amet.
          </div>
          <div className="bg-muted/50 mx-auto h-full w-full max-w-3xl rounded-xl">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. At a
            eveniet pariatur animi illo unde eos corporis aliquam voluptatibus
            beatae?
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
