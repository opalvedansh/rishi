import { cn } from "@/lib/utils";
import React from "react";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
    fluid?: boolean;
}

const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
    ({ className, fluid = false, children, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    "w-full mx-auto px-4 md:px-8",
                    fluid ? "max-w-none" : "max-w-[1248px]", // Standard container width
                    className
                )}
                {...props}
            >
                {children}
            </div>
        );
    }
);
Container.displayName = "Container";

export default Container;
