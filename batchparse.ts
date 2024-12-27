import { BatchData } from "./BatchData.ts";

export async function batchparse(res: Response): Promise<any[]> {
    const json = await res.json();
    // console.log(json);
    if (Array.isArray(json)) {
        const errors = (json as BatchData[]).map((item) => item.error);
        if (errors.some((error) => error !== null && error !== undefined)) {
            throw new Error(JSON.stringify(errors), { cause: { errors } });
        }
        return (json as BatchData[]).map((item) => item.result);
    } else {
        throw new Error("json is not an array", { cause: json });
    }
}
