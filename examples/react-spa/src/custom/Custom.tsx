import { useEmbeddedProjectPageQuery } from "@versori/embed-react/src/hooks/useEmbeddedIntegrationPageQuery.ts";
import { useEffect } from "react";

export function Custom() {
    const { isLoading, error, projects } = useEmbeddedProjectPageQuery({});

    useEffect(() => {
        if (error) {
            console.error("Error fetching projects:", error);
        } else {
            console.log("Fetched projects:", projects);
        }
    }, [error, projects]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h2>Custom Tab</h2>
        </div>
    );
}
