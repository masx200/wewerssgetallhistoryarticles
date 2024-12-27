import { fetchWithStatusCheck } from "./fetchWithStatusCheck.ts";

export async function getHistoryArticles(
    homepageUrl: string,
    authCode: string,
    mpId: string,
): Promise<Response> {
    return fetchWithStatusCheck(
        homepageUrl + "/trpc/feed.getHistoryArticles?batch=1",
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
                "Referer": homepageUrl + `/dash/feeds/${mpId}`,
                "Referrer-Policy": "strict-origin-when-cross-origin",
            },
            "body": '{"0":{"mpId":' + mpId + "}}",
            "method": "POST",
        },
    );
}
export async function getHistoryArticlesparse() {}
