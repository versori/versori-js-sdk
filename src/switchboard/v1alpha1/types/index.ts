export type VersoriNamepsace = {
    list: (orgId: string) => Promise<any>;
};

declare global {
    interface Window {
        versori?: {} | null;
    }
}
