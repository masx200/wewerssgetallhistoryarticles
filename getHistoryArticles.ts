import { parse } from "https://deno.land/std@0.224.0/flags/mod.ts";
import { batchparse } from "./batchparse.ts";
import { fetchWithStatusCheck } from "./fetchWithStatusCheck.ts";
import { printhelp } from "./list.ts";
import { fileURLToPath } from "node:url";
export const headers = {
    "user-agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
};
export async function getHistoryArticles(
    homepageUrl: string,
    authCode: string,
    mpId: string,
): Promise<any> {
    const homepageUrlobj = new URL(homepageUrl);
    const res = await fetchWithStatusCheck(
        new URL(
            "/trpc/feed.getHistoryArticles?batch=1",
            homepageUrlobj.href,
        ).href,
        {
            "headers": {
                "accept": "*/*",
                "accept-language": "zh-CN,zh;q=0.9",
                "authorization": authCode,
                "content-type": "application/json",
                "priority": "u=1, i",
                "sec-ch-ua":
                    '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": '"Windows"',
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                "Referer": new URL(
                    `/dash/feeds/${mpId}`,
                    homepageUrlobj.href,
                ).href,
                "Referrer-Policy": "strict-origin-when-cross-origin",
                ...headers,
            },
            "body": JSON.stringify({ 0: { mpId: mpId } }),
            "method": "POST",
        },
    );
    const dataarray = await getHistoryArticlesparse(
        res,
    );
    if (dataarray.length === 0) {
        throw new Error("dataarray is empty", { cause: dataarray });
    }
    return dataarray[0];
}
export async function getHistoryArticlesparse(
    res: Response,
): Promise<any[]> {
    const results = await batchparse(res);
    return results.map((a) => a.data) as any[];
}

const __filename = fileURLToPath(import.meta.url);
if (import.meta.main) {
    const args = parse(Deno.args, {
        string: ["homepageUrl", "authCode", "mpId"],
        boolean: ["help"],
    });
    console.log("args:", args);
    if (args.help) {
        printhelp(__filename, ["--mpId=***************"]);
        Deno.exit(0);
    }
    if (!args.mpId || !args.authCode) {
        console.error("mpId and authCode are required");
        // printhelp();
        Deno.exit(1);
    }
    //check args exist
    if (!args.homepageUrl || !args.authCode) {
        console.error("homepageUrl and authCode are required");
        // printhelp();
        Deno.exit(1);
    }
    console.log(
        "getHistoryArticles:",
        await getHistoryArticles(
            args.homepageUrl,
            args.authCode,
            args.mpId,
        ),
    );
}
