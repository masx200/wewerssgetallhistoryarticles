import { fetchWithStatusCheck } from "./fetchWithStatusCheck.ts";
export const headers = {
    "user-agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
};
export async function getHistoryArticles(
    homepageUrl: string,
    authCode: string,
    mpId: string,
): Promise<Response> {
    const homepageUrlobj = new URL(homepageUrl);
    return fetchWithStatusCheck(
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
}
export async function getHistoryArticlesparse() {}
