import "@pnp/sp/webs";
import "@pnp/sp/site-users/web";
export declare const getUserContext: () => Promise<any[]>;
export declare const getUserRequests: () => Promise<any[]>;
export declare const postNewRequest: (data: any) => Promise<{
    status: string;
    result: any;
} | {
    status: string;
    result: {
        message: any;
    };
}>;
export declare const UpdateRequestNumber: (data: any, ID: string) => Promise<{
    status: string;
    result: import("@pnp/sp/items/types").IItemUpdateResultData;
} | {
    status: string;
    result: {
        message: any;
    };
}>;
export declare const UpdateRequestPath: (data: any, Code: string) => Promise<{
    status: string;
    result: import("@pnp/sp/items/types").IItemUpdateResultData;
} | {
    status: string;
    result: {
        message: any;
    };
}>;
export declare const AddAttachments: (files: any, request: any, Code: any) => Promise<any>;
export declare const sendNotification: (details: any, Code: string, anyAttachments: boolean) => Promise<{
    status: string;
} | {
    status: string;
}>;
//# sourceMappingURL=PnpJS.d.ts.map