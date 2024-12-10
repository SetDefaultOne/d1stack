import { QueryClient } from "./queryClient";
import { Sdk } from "./sdk";

export class Collection {
    public readonly queryClient: QueryClient;

    constructor(
        public readonly options: CollectionInitOptions,
        public readonly sdk: Sdk,
    ) {
        this.queryClient = new QueryClient(sdk.options, options);
    }
}

export interface CollectionInitOptions {
    endpoint: string;
}
