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
/**
 * 列表数据接口
 *
 * 该接口定义了列表数据的结构，包括列表项数组和下一个游标（可选）。
 *
 * @property items 列表项数组。
 * @property nextCursor 可选的下一个游标，用于分页加载更多数据。
 */
export interface ListData {
    items: ListItem[];
    nextCursor?: string;
}
// import path from 'node:path';

const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
/**
 * 打印帮助信息函数
 *
 * 该函数用于打印程序的使用帮助信息。它接受当前脚本的文件名作为参数，
 * 并可选地接受其他字符串参数，以进一步定制帮助信息的输出。
 *
 * @param __filename 当前脚本的文件名，用于在命令行中指定运行的脚本。
 * @param other 可选参数，用于添加其他帮助信息。
 */
export function printhelp(__filename: string, other: string[] = [""]) {
    for (const str of other) {
        console.log(
            `Usage:\n${Deno.execPath()} run -A ${__filename} --homepageUrl=https://***************** --authCode=*************** ` +
                str,
        );
    }
}

if (import.meta.main) {
    await main();
}
/**
 * 主函数，负责解析命令行参数，验证参数，并打印帮助信息。
 * 该函数使用异步语法来处理异步操作。
 */
async function main() {
    const args = parse(Deno.args, {
        string: ["homepageUrl", "authCode", "limit"],

        boolean: ["help"],
    });
    console.log("args:", args);
    if (args.help) {
        printhelp(__filename, ["", "--limit=50"]);
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

/**
 * 异步生成器函数，用于迭代获取列表数据
 * 该函数会根据提供的参数，不断加载列表的下一页数据，并逐页产出
 *
 * @param {Object} params - 包含请求参数的对象
 * @param {string} params.homepageUrl - 主页URL，用于构建请求
 * @param {string} params.authCode - 认证码，用于请求认证
 * @param {number} [params.limit] - 每页数据的限制数量，可选
 * @yields {AsyncGenerator<ListData>} - 产生列表数据的异步生成器
 */
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
