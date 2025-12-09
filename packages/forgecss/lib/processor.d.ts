export declare function findUsages(filePath: string, content?: string | null): Promise<void>;
export declare function invalidateUsageCache(filePath?: string): void;
export declare function getUsages(): object;