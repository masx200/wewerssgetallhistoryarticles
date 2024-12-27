import { fetchWithStatusCheck } from "./fetchWithStatusCheck.ts";

export async function getInProgressHistoryMp(
    homepageUrl: string,
    authCode: string,
): Promise<Response> {
    return fetchWithStatusCheck(
        homepageUrl + "/trpc/feed.getInProgressHistoryMp?batch=1&input=%7B%7D",
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
                "Referer": homepageUrl + "/dash/feeds",
                "Referrer-Policy": "strict-origin-when-cross-origin",
            },
            "body": null,
            "method": "GET",
        },
    );
}
export async function getInProgressHistoryMpparse() {}
