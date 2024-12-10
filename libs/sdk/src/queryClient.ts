import { validate, ValidationError } from "class-validator";
import { deserializeEntity, isSerializedEntity } from "./utils/entities";
import { SdkInitOptions } from "./sdk";
import { CollectionInitOptions } from "./collection";

export class QueryClient {
    constructor(
        private readonly sdkOptions: SdkInitOptions,
        private readonly collectionOptions: CollectionInitOptions,
    ) {}

    async query<S = unknown, F = unknown, E = unknown>(
        path: string = "",
        options: QueryOptions = {},
    ) {
        const { apiUrl, apiVersion } = this.sdkOptions;
        const { endpoint } = this.collectionOptions;
        const { method } = options;

        const route = apiUrl + `v${apiVersion}/` + `${endpoint}/` + path;

        let response: Response;
        switch (method) {
            case "GET": {
                const { query } = options;

                if (query) {
                    const errors = await validate(query);

                    if (errors.length > 0) {
                        throw new QuerySearchParamValidationException(
                            query,
                            errors,
                        );
                    }
                }

                const searchParams = query
                    ? `?${new URLSearchParams(query as Record<string, string>).toString()}`
                    : "";

                try {
                    response = await fetch(route + searchParams, {
                        method,
                        credentials: "include",
                    });
                } catch (exception: unknown) {
                    throw new QueryFailedException(exception);
                }

                break;
            }

            case "POST":
            case "PATCH":
            case "DELETE": {
                const { body, contentType = "application/json" } = options;

                let parsedBody: BodyInit;

                if (body && typeof body === "object") {
                    const errors = await validate(body);

                    if (errors.length > 0) {
                        throw new QueryBodyValidationException(body, errors);
                    }
                }

                if (contentType === "application/json") {
                    try {
                        parsedBody = JSON.stringify(body);
                    } catch {
                        throw new QueryBodyParseException(body, contentType);
                    }
                } else {
                    parsedBody = body as BodyInit;
                }

                try {
                    response = await fetch(route, {
                        method,
                        body: parsedBody,
                        headers: {
                            "Content-Type": contentType,
                        },
                        credentials: "include",
                    });
                } catch (exception: unknown) {
                    throw new QueryFailedException(exception);
                }

                break;
            }

            default: {
                throw new QueryMethodValidationException(options.method);
            }
        }

        let json: QueryResult<S, F, E>;
        try {
            json = await response.json();
        } catch (exception: unknown) {
            throw new QueryResponseParseException(exception);
        }

        if (json.data === null || typeof json.data !== "object") {
            return {
                response,
                result: json,
            };
        }

        if (isSerializedEntity(json.data)) {
            return {
                response,
                result: deserializeEntity(json.data) as S | F | E,
            };
        }

        const data: S | F | E = json.data;

        for (const property in data as Record<keyof (S | F | E), unknown>) {
            const value = data[property as keyof (S | F | E)];

            if (isSerializedEntity(value)) {
                data[property as keyof (S | F | E)] = deserializeEntity(
                    value,
                ) as (typeof data)[keyof (S | F | E)];

                continue;
            }

            if (Array.isArray(value)) {
                data[property as keyof (S | F | E)] = value.map((entry) =>
                    deserializeEntity(entry),
                ) as (typeof data)[keyof (S | F | E)];
            }
        }

        return {
            response,
            result: data,
        };
    }
}

export type QueryOptions = QueryGetOptions | QuerySendOptions;
export type QueryGetOptions = {
    method?: "GET";
    query?: object;
};
export type QuerySendOptions = {
    method?: "POST" | "PATCH" | "DELETE";
} & QueryBodyOptions;
export type QueryBodyOptions =
    | {
          body?: object;
          contentType?: "application/json";
      }
    | {
          body?: BodyInit;
          contentType?: "multipart/form-data";
      };
export type QueryResult<S = unknown, F = unknown, E = unknown> =
    | QuerySuccessResult<S>
    | QueryFailureResult<F>
    | QueryErrorResult<E>;
export type QuerySuccessResult<T = unknown> = {
    status: "success";
    data: T;
    pagination?: {
        size: number;
        next: string | null;
    };
};
export type QueryFailureResult<T = unknown> = {
    status: "fail";
    message: string;
    data: T;
};
export type QueryErrorResult<T = unknown> = {
    status: "error";
    message: string;
    data: T;
};

export class QueryMethodValidationException extends Error {
    constructor(method: unknown) {
        super(`${method} is not a valid query method.`);
    }
}

export class QuerySearchParamValidationException extends Error {
    constructor(searchParams: object, errors: ValidationError[]) {
        super(`${searchParams} search params had validation errors: ${errors}`);
    }
}

export class QueryBodyParseException extends Error {
    constructor(body: unknown, contentType?: string) {
        super(
            `${body} with content type ${contentType} could not be parsed into JSON.`,
        );
    }
}

export class QueryBodyValidationException extends Error {
    constructor(body: object, errors: ValidationError[]) {
        super(`${body} body had validation errors: ${errors}`);
    }
}

export class QueryFailedException extends Error {
    constructor(public readonly exception: unknown) {
        super(`Query failed with exception: ${exception}.`);
    }
}

export class QueryResponseParseException extends Error {
    constructor(public readonly exception: unknown) {
        super(
            `Query response could not be parsed into JSON due to exception: ${exception}.`,
        );
    }
}
