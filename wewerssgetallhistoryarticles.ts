import node_cron from "node-cron";
import { getHistoryArticles } from "./getHistoryArticles.ts";
import { getInProgressHistoryMp } from "./getInProgressHistoryMp.ts";
import { listIterator } from "./list.ts";
import yargs from "yargs/yargs";
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
        const data of listIterator({
            homepageUrl: args.homepageUrl,
            authCode: args.authCode,
            limit: args.limit ? Number(args.limit) : undefined,
        })
    ) {
        console.log("list:", data);
        for (const item of data.items.sort(() => Math.random() - 0.5)) {
            if (item.hasHistory) {
                await processOngoingHistory(args);
                console.log("getHistoryArticles:", {
                    homepageUrl: args.homepageUrl,
                    authCode: args.authCode,
                    mpId: item.id,
                });
                // console.log(
                //     "getHistoryArticles:",
                await getHistoryArticles(
                    args.homepageUrl,
                    args.authCode,
                    item.id,
                ); //,
                // );
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
async function processOngoingHistory(args: {
    homepageUrl: string;
    authCode: string;
}) {
    while (true) {
        const result = await getInProgressHistoryMp(
            args.homepageUrl,
            args.authCode,
        );
        if (result.id === "") {
            break;
        } else {
            console.log("getInProgressHistoryMp:", result);

            await new Promise((resolve) => setTimeout(resolve, 5000));
            continue;
        }
    }
}

/**
 * 主函数，负责解析命令行参数，验证参数，并打印帮助信息。
 * 该函数使用异步语法来处理异步操作。
 */
async function main() {
    const args = parseCommandLineArgs(Deno.args);

    console.log("args:", args);
    if (args.help || args.h) {
        // printhelp(__filename, ["", "--limit=50"]);
        // console.log(args.showHelp());
        parseCommandLineArgs(["--help"]);
        Deno.exit(0);
    }
    //check args exist
    if (!args.homepageUrl || !args.authCode) {
        console.error("homepageUrl and authCode are required");
        // printhelp();
        // console.log(args.showHelp());
        parseCommandLineArgs(["--help"]);
        Deno.exit(1);
    }
    const homepageUrl = args.homepageUrl;
    const authCode = args.authCode;
    const limit = args.limit;
    if (args.cron) {
        console.log(
            node_cron.schedule(args.cron, async () => {
                await wewerssgetallhistoryarticles({
                    homepageUrl: homepageUrl,
                    authCode: authCode,
                    limit: limit,
                });
            }),
        );
    } else {
        await wewerssgetallhistoryarticles({
            homepageUrl: homepageUrl,
            authCode: authCode,
            limit: limit,
        });
    }
}
if (import.meta.main) {
    await main();
}

function parseCommandLineArgs(args: string[]) {
    return yargs(args)
        .option("h", {
            describe: "Show help",
            type: "boolean",
            demandOption: false,
        })
        .option("homepageUrl", {
            describe: "The homepage URL",
            type: "string",
            demandOption: false, // 是否必须
        })
        .option("authCode", {
            describe: "The authentication code",
            type: "string",
            demandOption: false,
        })
        .option("limit", {
            describe: "The limit number",
            type: "string",
            demandOption: false,
        })
        .option("cron", {
            describe: "The cron expression",
            type: "string",
            demandOption: false,
        })
        .help()
        .argv;
}
