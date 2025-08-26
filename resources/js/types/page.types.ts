export interface PageProps<T = Record<string, unknown>> {
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
        };
    };
    ziggy: {
        location: string;
        port: number | null;
        query: Record<string, string>;
        route_name: string;
        routes: Record<string, unknown>;
        defaults: Record<string, unknown>;
        base_domain: string | null;
        base_port: number | null;
        base_protocol: string;
        base_url: string;
    };
    [key: string]: any;
}
