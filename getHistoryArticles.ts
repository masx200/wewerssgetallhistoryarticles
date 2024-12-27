import { batchparse } from "./batchparse.ts";
import { fetchWithStatusCheck } from "./fetchWithStatusCheck.ts";
export const headers = {
    "user-agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
};
export async function getHistoryArticles(
    homepageUrl: string,
    authCode: string,
    mpId: string,
): Promise<Record<string, any>> {
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
            "body": '{"0":{"mpId":' + mpId + "}}",
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
): Promise<Record<string, any>[]> {
    const results = await batchparse(res);
    return results.map((a) => a.data) as Record<string, any>[];
}
