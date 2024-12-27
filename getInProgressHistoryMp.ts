import { batchparse } from "./batchparse.ts";
import { fetchWithStatusCheck } from "./fetchWithStatusCheck.ts";
import { headers } from "./getHistoryArticles.ts";
import { parse } from "https://deno.land/std@0.224.0/flags/mod.ts";
import { printhelp } from "./list.ts";
export async function getInProgressHistoryMp(
    homepageUrl: string,
    authCode: string,
): Promise<getInProgressHistoryData> {
    const homepageUrlobj = new URL(homepageUrl);
    const res = await fetchWithStatusCheck(
        new URL(
            "/trpc/feed.getInProgressHistoryMp?batch=1&input=%7B%7D",
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
    const dataarray = await getInProgressHistoryMpparse(
        res,
    );
    if (dataarray.length === 0) {
        throw new Error("dataarray is empty", { cause: dataarray });
    }
    return dataarray[0];
}
export async function getInProgressHistoryMpparse(
    res: Response,
): Promise<getInProgressHistoryData[]> {
    const results = await batchparse(res);
    return results.map((a) => a.data) as getInProgressHistoryData[];
}
export interface getInProgressHistoryData {
    id: string;
    page: number;
}

if (import.meta.main) {
    const args = parse(Deno.args, {
        string: ["homepageUrl", "authCode"],
        boolean: ["help"],
    });
    console.log("args:", args);
    if (args.help) {
        printhelp();
        Deno.exit(0);
    }
    //check args exist
    if (!args.homepageUrl || !args.authCode) {
        console.error("homepageUrl and authCode are required");
        // printhelp();
        Deno.exit(1);
    }
    console.log(
        "getInProgressHistoryMp:",
        await getInProgressHistoryMp(
            args.homepageUrl,
            args.authCode,
        ),
    );
}
