import { getHistoryArticles } from "./getHistoryArticles.ts";
import { getInProgressHistoryMp } from "./getInProgressHistoryMp.ts";
import { listIterator } from "./list.ts";
/**
 * 异步获取所有历史文章。
 *
 * @param args - 包含获取历史文章所需参数的对象。
 * @param args.homepageUrl - 主页的URL。
 * @param args.authCode - 认证码。
 * @param args.limit - 可选参数，限制返回的文章数量。
 */
export async function wewerssgetallhistoryarticles(args: {
    homepageUrl: string;
    authCode: string;
    limit?: string | undefined;
}) {
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
        for (const item of data.items) {
            if (item.hasHistory) {
                await processOngoingHistory(args);

                console.log(
                    "getHistoryArticles:",
                    await getHistoryArticles(
                        args.homepageUrl,
                        args.authCode,
                        item.id,
                    ),
                );
            }
        }
    }
    await processOngoingHistory(args);
}
/**
 * 持续检查并处理正在进行的历史记录。
 *
 * 该函数会不断调用 getInProgressHistoryMp 函数来检查是否有新的历史记录，
 * 直到没有新的历史记录为止。每次检查后会等待5秒再进行下一次检查。
 *
 * @param {string} homepageUrl - 主页URL。
 * @param {string} authCode - 认证码。
 */
async function processOngoingHistory(
    args: { homepageUrl: string; authCode: string },
) {
    while (true) {
        const result = await getInProgressHistoryMp(
            args.homepageUrl,
            args.authCode,
        );
        if (result.id === "") {
            break;
        } else {
            console.log(
                "getInProgressHistoryMp:",
                result,
            );

            await new Promise((resolve) => setTimeout(resolve, 5000));
            continue;
        }
    }
}
