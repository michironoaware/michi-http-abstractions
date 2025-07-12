import { HttpStatusCode } from "./HttpStatusCode";
import { TypeHelper } from "michi-typehelper";

/**
 * A base class for exceptions thrown by the {@link HttpClient} and {@link HttpMessageHandler} classes.
 * @sealed
 * */
export class MichiHttpRequestError extends Error {
	readonly #_statusCode: HttpStatusCode | null;

	/**
	 * Initializes a new instance of the {@link MichiHttpRequestError} class
	 * with a specific message that describes the current error and a statusCode.
	 * @param message A message that describes the current error.
	 * @param statusCode The status code of the HTTP response that caused the error.
	 * */
	public constructor(message?: string, statusCode?: HttpStatusCode) {
		TypeHelper.throwIfNotAnyType(message, "string", "undefined");
		TypeHelper.throwIfNotAnyType(statusCode, "number", "undefined");

		super(message ? message : `Http request error failed` + statusCode ? ` with status code '${statusCode}'` : "");
		this.#_statusCode = statusCode ?? null;
	}

	/**
	 * Gets the {@link HttpStatusCode} of the HTTP response that caused the error.
	 * */
	public get statusCode() {
		return this.#_statusCode;
	}
}
