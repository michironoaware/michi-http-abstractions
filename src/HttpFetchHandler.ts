import { HttpMessageHandler } from "./HttpMessageHandler";
import { MichiHttpObjectDisposedError } from "./MichiHttpObjectDisposedError";
import { HttpRequestMessage } from "./HttpRequestMessage";
import { HttpResponseMessage } from "./HttpResponseMessage";
import { StreamContent } from "./StreamContent";
import { TypeHelper } from "michi-typehelper";

/**
 * A {@link HttpMessageHandler} implementation that sends HTTP requests using the Fetch API.
 * @sealed
 * */
export class HttpFetchHandler extends HttpMessageHandler {
	#_disposed: boolean = false;

	constructor() {
		super();
	}

	/**
	 * Send an HTTP request as an asynchronous operation.
	 * @returns The promise object representing the asynchronous operation.
	 * @throws {MichiHttpObjectDisposedError} If the instance has been disposed.
	 * @remarks The returned {@link Promise} will complete once the response has been received.
	 * */
	public async send(message: HttpRequestMessage, abortSignal: AbortSignal) {
		TypeHelper.throwIfNotType(message, HttpRequestMessage);
		TypeHelper.throwIfNotType(abortSignal, AbortSignal);
		MichiHttpObjectDisposedError.throwIf(this.#_disposed);

		const headers: Record<string, string> = {};
		for (const [key, values] of message.headers) {
			headers[key] = values.join(";");
		}

		let received = await fetch(message.requestUri, {
			method: message.method.name,
			headers: headers,
			body: await message.content?.readAsStream(),
			duplex: "half",
			abort: abortSignal,
		} as RequestInit);

		const response = new HttpResponseMessage(received.status);

		if (received.body) {
			response.content = new StreamContent(received.body);
		}

		for (const header of received.headers) {
			const headerName = header[0];
			const headerValues = header[1].split(";");
			for (const headerValue of headerValues) {
				response.headers.append(headerName, headerValue);
			}
		}

		return response;
	}

	public [Symbol.asyncDispose]() {
		if (this.#_disposed) {
			return Promise.resolve();
		}

		this.#_disposed = true;
		return Promise.resolve();
	}
}
