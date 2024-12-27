export async function fetchWithStatusCheck(
    input: URL | Request | string,
    init?: RequestInit,
): Promise<Response> {
    const req = new Request(input, init);
    console.log("request:", req);
    const res = await fetch(req);
    if (res.status >= 200 && res.status < 300) {
        return res;
    } else {
        throw new Error(
            JSON.stringify({
                url: req.url,
                method: req.method,
                status: res.status,
            }),
            { cause: res },
        );
    }
}
