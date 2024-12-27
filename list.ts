import { parse } from "https://deno.land/std@0.224.0/flags/mod.ts";
import { fileURLToPath } from "node:url";
import { batchparse } from "./batchparse.ts";
import { fetchWithStatusCheck } from "./fetchWithStatusCheck.ts";
import { ListItem } from "./ListItem.ts";
import { headers } from "./getHistoryArticles.ts";

export async function list(
    { homepageUrl, authCode, limit, cursor }: {
        homepageUrl: string;
        authCode: string;
        limit?: number;
        cursor?: string;
    },
): Promise<ListData> {
    const homepageUrlobj = new URL(homepageUrl);
    const res = await fetchWithStatusCheck(
        new URL(
            "/trpc/feed.list?batch=1&input=" +
                encodeURIComponent(JSON.stringify({ "0": { limit, cursor } })),
            homepageUrlobj.href,
        ).href,
        {
            "headers": {
                "accept": "*/*",
                "accept-language": "zh-CN,zh;q=0.9",
                "authorization": authCode,
                "content-type": "application/json",
                "priority": "u=1, i",
                "referrer-policy": "strict-origin-when-cross-origin",
                "sec-ch-ua":
                    '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": '"Windows"',
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                "Referer": new URL(
                    "/dash/feeds",
                    homepageUrlobj.href,
                ).href,
                "Referrer-Policy": "strict-origin-when-cross-origin",
                ...headers,
            },
            "body": null,
            "method": "GET",
        },
    );
    const dataarray = await listparse(
        res,
    );
    if (dataarray.length === 0) {
        throw new Error("dataarray is empty", { cause: dataarray });
    }
    return dataarray[0];
}
export async function listparse(res: Response): Promise<ListData[]> {
    const results = await batchparse(res);
    return results.map((a) => a.data) as ListData[];
}
export interface ListData {
    items: ListItem[];
    nextCursor?: string;
}
// import path from 'node:path';

const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
export function printhelp(__filename: string, other: string = "") {
    console.log(
        `Usage:\n${Deno.execPath()} run -A ${__filename} --homepageUrl=https://***************** --authCode=*************** ` +
            other,
    );
}

if (import.meta.main) {
    const args = parse(Deno.args, {
        string: ["homepageUrl", "authCode", "limit"],

        boolean: ["help"],
    });
    console.log("args:", args);
    if (args.help) {
        printhelp(__filename, "--limit=50");
        Deno.exit(0);
    }
    //check args exist
    if (!args.homepageUrl || !args.authCode) {
        console.error("homepageUrl and authCode are required");
        // printhelp();
        Deno.exit(1);
    }
    for await (
        const data of listIterator(
            {
                homepageUrl: args.homepageUrl,
                authCode: args.authCode,
                limit: args.limit ? Number(args.limit) : undefined,
            },
        )
    ) {
        console.log(
            "list:",
            data,
        );
    }
}

export async function* listIterator(
    { homepageUrl, authCode, limit }: {
        homepageUrl: string;
        authCode: string;
        limit?: number;
    },
): AsyncGenerator<ListData> {
    let nextCursor: string | undefined = undefined;
    const data = await list({
        homepageUrl,
        authCode,
        limit,
    });
    yield data;
    nextCursor = data.nextCursor;
    while (nextCursor) {
        const nextdata = await list({
            homepageUrl,
            authCode,
            limit,
            cursor: nextCursor,
        });
        nextCursor = nextdata.nextCursor;
        yield nextdata;
        // data.nextCursor = nextdata.nextCursor;
        // data.items.push(...nextdata.items);
    }
}
